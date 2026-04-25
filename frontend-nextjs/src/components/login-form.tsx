"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/services/auth/hooks";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending, error } = useLogin();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {error.message}
        </p>
      )}
      <Button type="submit" loading={isPending} className="mt-2 w-full">
        Sign in
      </Button>
    </form>
  );
}
