"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserUpdate } from "./types";
import {
  deleteUserAction,
  getMeAction,
  getUserAction,
  getUsersAction,
  updateUserAction,
} from "./api";
import { userKeys } from "./keys";

// ── Queries ────────────────────────────────────────────────────────────────────

export function useMe() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getMeAction,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useUsers(page = 1, size = 20) {
  return useQuery({
    queryKey: userKeys.list(page, size),
    queryFn: () => getUsersAction(page, size),
    staleTime: 1000 * 60,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserAction(id),
    staleTime: 1000 * 60 * 2,
    enabled: Boolean(id),
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdate }) =>
      updateUserAction(id, data),
    onSuccess: (updated) => {
      qc.setQueryData(userKeys.detail(updated.id), updated);
      qc.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUserAction(id),
    onSuccess: (_, id) => {
      qc.removeQueries({ queryKey: userKeys.detail(id) });
      qc.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
