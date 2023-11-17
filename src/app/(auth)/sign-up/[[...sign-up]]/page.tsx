import { Metadata } from "next";

import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "BrainyNotes - Sign Up",
};

export default function Page() {
  return <SignUp appearance={{ variables: { colorPrimary: "#0F172A" } }} />;
}
