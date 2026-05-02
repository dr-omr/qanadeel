import { NextRequest, NextResponse } from "next/server";
import {
  chatbotKnowledgeContext,
  chatbotSystemPrompt,
} from "@/data/chatbot-knowledge";
import { schoolInfo } from "@/data/school-info";
import { getOpenAIClient } from "@/lib/ai";
import {
  buildCloudIntentContext,
  getBestFallbackAnswer,
  isHighConfidenceFact,
  isWeakCloudReply,
} from "@/lib/local-chatbot";
import { checkRateLimit } from "@/lib/rate-limit";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const MAX_MESSAGES = 6;
const MAX_INPUT_LENGTH = 1200;

function cleanMessage(value: unknown): ChatMessage | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<ChatMessage>;
  if (item.role !== "user" && item.role !== "assistant") return null;
  if (typeof item.content !== "string") return null;

  const content = item.content.trim().slice(0, MAX_INPUT_LENGTH);
  if (!content) return null;

  return { role: item.role, content };
}

function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "local";
}

function getLatestUserMessage(messages: ChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user");
}

function buildLocalResponse(
  userInput: string,
  lastIntentId?: string,
  fallbackReason?: string,
) {
  const local = getBestFallbackAnswer(userInput, { lastIntentId });

  return {
    reply: local.reply,
    source: local.source,
    intentId: local.intentId,
    category: local.category,
    title: local.title,
    score: local.score,
    suggestedReplies: local.suggestedReplies,
    actions: local.actions,
    topIntents: local.topIntents,
    fallbackReason,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      messages?: unknown[];
      lastIntent?: string;
    };
    const messages: ChatMessage[] = Array.isArray(body.messages)
      ? body.messages
          .map(cleanMessage)
          .filter((message): message is ChatMessage => Boolean(message))
          .slice(-MAX_MESSAGES)
      : [];

    if (!messages.length) {
      return NextResponse.json(
        { error: "يرجى كتابة سؤال واضح عن الروضة." },
        { status: 400 },
      );
    }

    const latestUserMessage = getLatestUserMessage(messages);
    if (!latestUserMessage) {
      return NextResponse.json(
        { error: "يرجى كتابة سؤال واضح عن الروضة." },
        { status: 400 },
      );
    }

    const localResponse = buildLocalResponse(
      latestUserMessage.content,
      body.lastIntent,
    );

    if (!process.env.OPENAI_API_KEY) {
      console.warn("Chat API cloud model disabled: OPENAI_API_KEY is missing");

      return NextResponse.json({
        ...localResponse,
        fallbackReason: "missing_api_key",
      });
    }

    if (isHighConfidenceFact({ ...localResponse, source: "local" })) {
      return NextResponse.json({
        ...localResponse,
        fallbackReason: "high_confidence_local_fact",
      });
    }

    const rateLimit = checkRateLimit(getClientKey(request));
    if (!rateLimit.allowed) {
      return NextResponse.json({
        ...localResponse,
        fallbackReason: "rate_limited_cloud",
      });
    }

    const conversation = messages
      .map((message) =>
        `${message.role === "user" ? "ولي الأمر" : "المساعد"}: ${
          message.content
        }`,
      )
      .join("\n");
    const matchedIntentContext = buildCloudIntentContext(
      latestUserMessage.content,
    );

    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      instructions: chatbotSystemPrompt,
      input: `${chatbotKnowledgeContext}

أفضل نوايا محلية مطابقة للسؤال، استخدمها كقرائن رسمية مختصرة ولا تخترع خارجها:
${matchedIntentContext || "لا توجد نوايا مطابقة بدقة."}

المحادثة الحالية:
${conversation}

أجب اعتمادًا على معرفة الروضة الرسمية فقط. عند ذكر واتساب استخدم ${schoolInfo.whatsapp}، وعند ذكر رابط الخريطة استخدم ${schoolInfo.mapUrl}.`,
      max_output_tokens: 450,
      store: false,
    });

    const reply = response.output_text?.trim() || "";

    if (!reply || isWeakCloudReply(reply)) {
      return NextResponse.json({
        ...localResponse,
        fallbackReason: "weak_cloud_reply",
      });
    }

    return NextResponse.json({
      reply,
      source: "cloud",
      intentId: localResponse.intentId,
      category: localResponse.category,
      title: localResponse.title,
      score: localResponse.score,
      suggestedReplies: localResponse.suggestedReplies,
      actions: localResponse.actions,
      topIntents: localResponse.topIntents,
    });
  } catch (error) {
    console.error("Chat route error; serving local fallback when possible", error);

    return NextResponse.json({
      ...buildLocalResponse(
        "أريد التواصل مع إدارة الروضة",
        undefined,
        "route_error",
      ),
      reply:
        "حدث تعذر مؤقت في المساعد الذكي، لكن يمكنك التواصل مباشرة مع إدارة الروضة عبر واتساب 94734809 أو الاتصال على 94734809.",
    });
  }
}
