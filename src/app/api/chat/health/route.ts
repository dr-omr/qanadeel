import { NextResponse } from "next/server";

export async function GET() {
  const hasApiKey = Boolean(process.env.OPENAI_API_KEY);
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  return NextResponse.json({
    ok: hasApiKey,
    hasApiKey,
    model,
    message: hasApiKey
      ? "Chat API is configured. The OpenAI API key is present on the server."
      : "Chat API is not configured. OPENAI_API_KEY is missing on the server.",
  });
}
