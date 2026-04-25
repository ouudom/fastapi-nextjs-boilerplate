import "server-only";
import { cookies } from "next/headers";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function setSession(accessToken: string, refreshToken: string) {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...COOKIE_BASE,
    maxAge: 60 * 30,
  });
  store.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...COOKIE_BASE,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
}

export async function getAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_TOKEN_COOKIE)?.value;
}
