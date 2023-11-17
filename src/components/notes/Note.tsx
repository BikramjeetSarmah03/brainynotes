import { Note as NoteModel } from "@prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ActionButton from "@/components/common/ActionButton";

interface NoteProps {
  note: NoteModel;
}

export default function Note({ note }: NoteProps) {
  const wasUpdated = note.updatedAt > note.createdAt;

  const createdUpdateAtTimestamp = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p>{note.title}</p>

          <ActionButton note={note} />
        </CardTitle>
        <CardDescription>
          {createdUpdateAtTimestamp}
          {wasUpdated && " (updated)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{note.content}</p>
      </CardContent>
    </Card>
  );
}
