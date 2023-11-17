import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return <SignUp appearance={{ variables: { colorPrimary: "#0F172A" } }} />;
}
