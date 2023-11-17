"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Note as NoteModel } from "@prisma/client";
import toast from "react-hot-toast";

import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/ui/loading-button";
import { useState } from "react";

interface AddEditNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: NoteModel;
}

export default function AddEditNoteDialog({
  open,
  setOpen,
  noteToEdit,
}: AddEditNoteDialogProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const router = useRouter();

  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  async function onSubmit(input: CreateNoteSchema) {
    try {
      if (noteToEdit) {
        const response = await fetch("/api/notes", {
          method: "PATCH",
          body: JSON.stringify({
            id: noteToEdit.id,
            ...input,
          }),
        });

        if (!response.ok) throw Error("Status code: " + response.status);

        form.reset();
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input),
        });

        if (!response.ok) throw Error("Status code: " + response.status);

        form.reset();
      }

      router.refresh();
      setOpen(false);
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
    }
  }

  async function deleteNote() {
    if (!noteToEdit) return;

    try {
      setDeleteInProgress(true);
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({
          id: noteToEdit.id,
        }),
      });

      if (!response.ok) throw Error("Status Code: " + response.status);

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{noteToEdit ? "Update Note" : "Add Note"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Add Note Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add Note Title" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-4">
              {noteToEdit && (
                <LoadingButton
                  type="button"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                  loading={deleteInProgress}
                  onClick={deleteNote}
                  variant={"destructive"}
                >
                  Delete Note
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
                loading={form.formState.isSubmitting}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
