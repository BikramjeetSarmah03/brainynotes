"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { Button } from "@/components/ui/button";
import AddEditNoteDialog from "@/components/notes/AddEditNoteDialog";
import { ThemeButton } from "@/components/ui/theme-button";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme } = useTheme();

  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

  return (
    <>
      <header className="p-4 shadow-md">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <Link href={"/notes"} passHref>
            <span className="hidden font-serif text-lg md:block">
              Brainy Notes
            </span>
            <span className="block font-serif text-lg md:hidden">BN</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button onClick={() => setShowAddNoteDialog(true)}>
              <PlusIcon className="mr-2" size={20} />
              Add Note
            </Button>

            <ThemeButton />

            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
              }}
            />
          </div>
        </nav>
      </header>

      <AddEditNoteDialog
        open={showAddNoteDialog}
        setOpen={setShowAddNoteDialog}
      />
    </>
  );
}
