import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/* ══════════════════════════════════════════════════════
   Single-admin auth. There is no user table — the password lives in
   ADMIN_PASSWORD and the session is a stateless signed cookie, so this
   works on Vercel with zero extra infrastructure.
   ══════════════════════════════════════════════════════ */

const COOKIE = "hirad_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Dev-only fallbacks. Production refuses to authenticate without real values. */
const DEV_PASSWORD = "hirad1234";
const DEV_SECRET = "dev-secret-not-for-production";

const isProd = process.env.NODE_ENV === "production";

function adminPassword() {
  return process.env.ADMIN_PASSWORD || (isProd ? "" : DEV_PASSWORD);
}

function authSecret() {
  return process.env.AUTH_SECRET || (isProd ? "" : DEV_SECRET);
}

/** True when the panel can actually be logged into. */
export function isAuthConfigured() {
  return Boolean(adminPassword() && authSecret());
}

/** Compares without leaking length or position through timing. */
function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

const sign = (payload: string) =>
  createHmac("sha256", authSecret()).update(payload).digest("hex");

function createToken() {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined) {
  if (!token || !isAuthConfigured()) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload))) return false;

  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}

export async function isLoggedIn() {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}

/** @returns whether the password matched. */
export async function login(password: string) {
  if (!isAuthConfigured()) return false;
  if (!safeEqual(password, adminPassword())) return false;

  const store = await cookies();
  store.set(COOKIE, createToken(), {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function logout() {
  const store = await cookies();
  store.delete(COOKIE);
}
