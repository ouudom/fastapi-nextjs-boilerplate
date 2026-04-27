"use server";

import { http } from "@/lib/api-client";
import { clearSession, getRefreshToken, setSession } from "@/lib/auth";
import type { LoginRequest, TokenResponse } from "./types";

const BASE = "/api/v1/auth";

// ── HTTP calls ─────────────────────────────────────────────────────────────────

async function login(data: LoginRequest): Promise<TokenResponse> {
  return http.post<TokenResponse>(`${BASE}/login`, data);
}

async function refresh(refreshToken: string): Promise<TokenResponse> {
  return http.post<TokenResponse>(`${BASE}/refresh`, {
    refresh_token: refreshToken,
  });
}

// ── Actions ────────────────────────────────────────────────────────────────────

export async function loginAction(data: LoginRequest): Promise<void> {
  const tokens = await login(data);
  await setSession(tokens.access_token, tokens.refresh_token);
}

export async function logoutAction(): Promise<void> {
  await clearSession();
}

export async function refreshAction(): Promise<void> {
  const token = await getRefreshToken();
  if (!token) throw new Error("No refresh token");
  const tokens = await refresh(token);
  await setSession(tokens.access_token, tokens.refresh_token);
}
