"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Note } from "@prisma/client";

import AddEditNoteDialog from "@/components/notes/AddEditNoteDialog";

interface EditButtonProps {
  note?: Note;
}

export default function ActionButton({ note }: EditButtonProps) {
  const [openEditDialog, setOpenEditDialog] = useState(false);

  return (
    <>
      <Pencil
        className="h-5 w-5 cursor-pointer"
        onClick={() => setOpenEditDialog(true)}
      />

      <AddEditNoteDialog
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        noteToEdit={note}
      />
    </>
  );
}
