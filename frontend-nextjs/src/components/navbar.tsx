"use client";

import { useLogout } from "@/services/auth/hooks";
import { useMe } from "@/services/users/hooks";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: user } = useMe();
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Dashboard
        </span>
        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden text-sm text-zinc-500 sm:block">
              {user.email}
            </span>
          )}
          <Button
            variant="secondary"
            size="sm"
            loading={isPending}
            onClick={() => logout()}
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
