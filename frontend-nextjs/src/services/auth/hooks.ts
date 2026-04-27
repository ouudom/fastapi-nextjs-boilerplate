"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { LoginRequest } from "./types";
import { loginAction, logoutAction } from "./api";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => loginAction(data),
    onSuccess: () => {
      toast.success("Signed in successfully");
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Sign in failed");
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      window.location.href = "/login";
    },
  });
}
