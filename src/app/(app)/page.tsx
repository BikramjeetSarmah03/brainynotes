import Link from "next/link";
import { auth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId) return redirect("/notes");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-serif text-5xl">Brainy Notes</h1>

      <p className="mt-4 max-w-prose text-center text-xl">
        An intelligent notes taking app with AI integration, built with OpenAI,
        Pinecone, Next.js, Shadcn UI, Clerk and more...
      </p>

      <Link
        href={"/notes"}
        className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
      >
        Go to Notes
      </Link>
    </main>
  );
}
