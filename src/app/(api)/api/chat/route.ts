import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";

import openai, { getEmbedding } from "@/lib/openai";
import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTruncate = messages.slice(-6);

    const embedding = await getEmbedding(
      messagesTruncate.map((message) => message.content).join("\n"),
    );

    const { userId } = auth();

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 5,
      filter: { userId },
    });

    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content:
        "You are an intelligent note taking app. You answe the user's question based on their existing notes. " +
        "The relevant notes for this query are:\n" +
        relevantNotes
          .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
          .join("\n\n"),
    };

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncate],
    });

    const stream = OpenAIStream(gptResponse);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log("🔴ERROR: Chat Sending");
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 },
    );
  }
}
