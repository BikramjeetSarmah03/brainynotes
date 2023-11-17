import Navbar from "@/components/common/Navbar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function NotesLayout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </>
  );
}
