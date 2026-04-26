"use client";

import { useLogout } from "@/services/auth/hooks";
import { useMe } from "@/services/users/hooks";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const { data: user } = useMe();
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <span className="text-sm font-semibold">Dashboard</span>
        <div className="flex items-center gap-2">
          {user && (
            <span className="hidden text-sm text-muted-foreground sm:block">{user.email}</span>
          )}
          <ThemeToggle />
          <Button variant="outline" size="sm" loading={isPending} onClick={() => logout()}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
