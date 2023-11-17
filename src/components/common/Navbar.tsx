import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function Navbar() {
  return (
    <header className="p-4 shadow-md">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        <Link href={"/notes"} passHref>
          <span className="hidden font-serif text-lg md:block">
            Brainy Notes
          </span>
          <span className="block font-serif text-lg md:hidden">BN</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button>
            <PlusIcon className="mr-2" size={20} />
            Add Note
          </Button>

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
            }}
          />
        </div>
      </nav>
    </header>
  );
}
