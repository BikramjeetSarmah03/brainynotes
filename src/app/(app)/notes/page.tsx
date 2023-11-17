import { Metadata } from "next";

import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import Note from "@/components/notes/Note";

export const metadata: Metadata = {
  title: "BrainyNotes - Notes",
};

export default async function Notes() {
  const { userId } = auth();

  if (!userId) throw Error("UserId Undefined");

  const notes = await prisma.note.findMany({ where: { userId } });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Note note={note} key={note.id} />
      ))}

      {notes.length === 0 && (
        <div className="col-span-full text-center font-serif text-xl md:text-2xl lg:text-3xl">
          You {`don't`} have any notes yet. Why {`don't`} you create one?
        </div>
      )}
    </div>
  );
}
