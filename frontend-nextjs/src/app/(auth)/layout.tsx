import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      {children}
    </div>
  );
}
