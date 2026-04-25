"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { LoginRequest } from "./types";
import { loginAction, logoutAction } from "./api";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => loginAction(data),
    onSuccess: () => {
      router.push("/dashboard");
      router.refresh();
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
