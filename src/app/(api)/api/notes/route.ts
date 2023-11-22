import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";

import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { notesIndex } from "@/lib/db/pinecone";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = createNoteSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
    }

    const { title, content } = parseResult.data;

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);

    const note = await prisma.$transaction(
      async (tx) => {
        const note = await tx.note.create({
          data: {
            title,
            content,
            userId,
          },
        });

        await notesIndex.upsert([
          {
            id: note.id,
            values: embedding,
            metadata: { userId },
          },
        ]);

        return note;
      },
      { maxWait: 5000, timeout: 100000 },
    );

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.log("🔴ERROR: Notes Creation");
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const parseResult = updateNoteSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
    }

    const { id, title, content } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note)
      return NextResponse.json({ error: "Note not found" }, { status: 404 });

    const { userId } = auth();

    if (!userId || userId !== note.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: {
          id,
          userId,
        },
        data: {
          title,
          content,
        },
      });

      await notesIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return updatedNote;
    });

    return NextResponse.json({ updatedNote }, { status: 200 });
  } catch (error) {
    console.log("🔴ERROR: Notes Updation");
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 },
    );
  }
}
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const parseResult = deleteNoteSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note)
      return NextResponse.json({ error: "Note not found" }, { status: 404 });

    const { userId } = auth();

    if (!userId || userId !== note.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.note.delete({
          where: {
            id,
            userId,
          },
        });

        await notesIndex.deleteOne(id);
      },
      { maxWait: 5000, timeout: 100000 },
    );

    return NextResponse.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.log("🔴ERROR: Notes Updation");
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 },
    );
  }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "");
}
