import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen items-center justify-center">{children}</div>
  );
}
