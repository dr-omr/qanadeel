import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

const DEV_ADMIN_TOKEN = "dev-admin";

export function getAdminToken() {
  const token = process.env.TESTIMONIALS_ADMIN_TOKEN?.trim();

  if (token) return token;

  if (process.env.NODE_ENV !== "production") {
    return DEV_ADMIN_TOKEN;
  }

  return "";
}

export function isAdminConfigured() {
  return Boolean(getAdminToken());
}

function safeCompare(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

export function isAdminRequest(request: NextRequest) {
  const expected = getAdminToken();
  const headerToken = request.headers.get("x-admin-token")?.trim();
  const bearerToken = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  const provided = headerToken || bearerToken || "";

  if (!expected || !provided) return false;

  return safeCompare(provided, expected);
}
