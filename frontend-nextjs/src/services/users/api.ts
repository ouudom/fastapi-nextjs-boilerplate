"use server";

import { http } from "@/lib/api-client";
import { getAccessToken } from "@/lib/auth";
import type { PaginatedData } from "@/lib/api-response";
import type { User, UserCreate, UserUpdate } from "./types";

const BASE = "/api/v1/users";

async function requireToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error("Unauthorized");
  return token;
}

// ── HTTP calls ─────────────────────────────────────────────────────────────────

async function me(token: string): Promise<User> {
  return http.get<User>(`${BASE}/me`, { token });
}

async function list(
  token: string,
  page: number,
  size: number,
): Promise<PaginatedData<User>> {
  return http.get<PaginatedData<User>>(`${BASE}?page=${page}&size=${size}`, {
    token,
  });
}

async function getById(id: string, token: string): Promise<User> {
  return http.get<User>(`${BASE}/${id}`, { token });
}

async function create(data: UserCreate, token: string): Promise<User> {
  return http.post<User>(BASE, data, { token });
}

async function update(
  id: string,
  data: UserUpdate,
  token: string,
): Promise<User> {
  return http.patch<User>(`${BASE}/${id}`, data, { token });
}

async function remove(id: string, token: string): Promise<void> {
  return http.delete<void>(`${BASE}/${id}`, { token });
}

// ── Actions ────────────────────────────────────────────────────────────────────

export async function getMeAction(): Promise<User> {
  return me(await requireToken());
}

export async function getUsersAction(
  page = 1,
  size = 20,
): Promise<PaginatedData<User>> {
  return list(await requireToken(), page, size);
}

export async function getUserAction(id: string): Promise<User> {
  return getById(id, await requireToken());
}

export async function createUserAction(data: UserCreate): Promise<User> {
  return create(data, await requireToken());
}

export async function updateUserAction(
  id: string,
  data: UserUpdate,
): Promise<User> {
  return update(id, data, await requireToken());
}

export async function deleteUserAction(id: string): Promise<void> {
  await remove(id, await requireToken());
}
