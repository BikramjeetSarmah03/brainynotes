import { Metadata } from "next";

import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "BrainyNotes - Sign In",
};

export default function Page() {
  return <SignIn appearance={{ variables: { colorPrimary: "#0F172A" } }} />;
}
