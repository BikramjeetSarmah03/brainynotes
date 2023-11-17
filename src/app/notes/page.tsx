import { Metadata } from "next";

import { UserButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "BrainyNotes - Notes",
};

export default function Notes() {
  return (
    <div>
      Your Notes
      <UserButton />
    </div>
  );
}
