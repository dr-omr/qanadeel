"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Bot,
  ChevronDown,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { chatbotQuickQuestions } from "@/data/chatbot-knowledge";
import { schoolInfo } from "@/data/school-info";
import type { ChatbotAction } from "@/data/chatbot-fallback-large";
import { buildWhatsappMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import { IconBadge } from "./IconBadge";

type ChatSource = "cloud" | "local";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: ChatSource;
  intentId?: string;
  suggestedReplies?: string[];
  actions?: ChatbotAction[];
};

type ChatApiResponse = {
  reply?: string;
  error?: string;
  code?: string;
  source?: ChatSource;
  intentId?: string;
  suggestedReplies?: string[];
  actions?: ChatbotAction[];
};

const initialMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "مرحبًا، أنا مساعد قناديل العلم. أجيب عن الرسوم، الدوام، الموقع، التسجيل، المستندات، السياسات، والنقل. تأكيد التسجيل والمقاعد يتم عبر إدارة الروضة.",
  source: "local",
  suggestedReplies: chatbotQuickQuestions.slice(0, 5),
  actions: [
    {
      label: "تواصل واتساب",
      type: "whatsapp",
      href: `https://wa.me/${schoolInfo.whatsappInternational}`,
    },
    {
      label: "فتح الخريطة",
      type: "map",
      href: schoolInfo.mapUrl,
    },
  ],
};

const MAX_CLIENT_INPUT_LENGTH = 600;
const disabledMessage =
  "المساعد الذكي غير مفعّل حاليًا، يمكنك التواصل مباشرة عبر واتساب 94734809.";

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getActionIcon(type: ChatbotAction["type"]) {
  if (type === "whatsapp") return MessageCircle;
  if (type === "call") return Phone;
  if (type === "map") return MapPin;
  if (type === "email") return Mail;
  return ExternalLink;
}

function isExternalAction(action: ChatbotAction) {
  return action.type !== "internal-link";
}

function sourceLabel(source?: ChatSource) {
  if (source === "local") return "تمت الإجابة من قاعدة معرفة الروضة";
  if (source === "cloud") return "رد ذكي معزز ببيانات الروضة";
  return null;
}

export function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastIntent, setLastIntent] = useState<string | undefined>();
  const lastUserMessage = useRef("");

  const whatsappUrl = useMemo(() => {
    const message = buildWhatsappMessage({
      schoolName: schoolInfo.shortName,
      requestType: "استفسار",
      message: "أرغب بالتواصل مع إدارة الروضة بخصوص استفسار.",
    });

    return buildWhatsappUrl(schoolInfo.whatsappInternational, message);
  }, []);

  async function sendMessage(content: string) {
    const trimmed = content.trim().slice(0, MAX_CLIENT_INPUT_LENGTH);
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: trimmed,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsLoading(true);
    lastUserMessage.current = trimmed;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastIntent,
          messages: nextMessages
            .filter((message) => message.id !== "welcome")
            .slice(-6)
            .map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = (await response.json()) as ChatApiResponse;
      const reply = data.reply;

      if (!response.ok || !reply) {
        throw new Error(
          data.code === "CHAT_DISABLED"
            ? disabledMessage
            : data.error ||
                "تعذر الاتصال بالمساعد الآن. يمكنك التواصل مباشرة عبر واتساب 94734809.",
        );
      }

      if (data.intentId && data.intentId !== "unknown_fallback") {
        setLastIntent(data.intentId);
      }

      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content: reply,
          source: data.source,
          intentId: data.intentId,
          suggestedReplies: data.suggestedReplies?.slice(0, 5),
          actions: data.actions?.slice(0, 4),
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ مؤقت في المساعد. يمكنك التواصل مباشرة عبر واتساب 94734809.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleRetry() {
    if (lastUserMessage.current) {
      void sendMessage(lastUserMessage.current);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="فتح مساعد قناديل العلم"
        className="fixed bottom-[calc(96px+env(safe-area-inset-bottom))] left-4 z-[55] inline-flex min-h-[3.25rem] items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 text-xs font-extrabold text-brand-deep shadow-[0_20px_50px_rgba(16,64,45,0.22)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white sm:px-4 sm:text-sm lg:bottom-6 lg:left-6"
      >
        <span className="relative flex size-8 items-center justify-center rounded-full bg-brand-deep text-white shadow-inner sm:size-9">
          <Bot className="size-5" aria-hidden="true" />
          <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-white bg-brand-warm" />
        </span>
        اسأل مساعد قناديل
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[80] lg:pointer-events-none">
          <button
            type="button"
            aria-label="إغلاق مساعد قناديل العلم"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-brand-deep/30 backdrop-blur-[3px] lg:hidden"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-label="مساعد قناديل العلم"
            className="pointer-events-auto absolute inset-x-0 bottom-0 flex h-[min(84svh,780px)] flex-col overflow-hidden rounded-t-[2rem] border border-white/70 bg-white/96 shadow-[0_-28px_90px_rgba(23,72,58,0.24)] backdrop-blur-xl lg:bottom-24 lg:left-6 lg:right-auto lg:h-[650px] lg:w-[440px] lg:rounded-[2rem]"
          >
            <header className="relative overflow-hidden border-b border-white/20 bg-[linear-gradient(135deg,rgba(23,72,58,0.98),rgba(43,91,71,0.94))] p-4 text-white">
              <span className="absolute -left-16 -top-16 size-40 rounded-full bg-brand-warm/20 blur-2xl" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <IconBadge tone="glass" size="lg">
                    <Sparkles className="size-6 text-brand-warm" aria-hidden="true" />
                  </IconBadge>
                  <div className="min-w-0">
                    <p className="text-lg font-extrabold">
                      مساعد قناديل العلم
                    </p>
                    <p className="text-xs font-bold text-[#f7ead0]">
                      النموذج الذكي عند التوفر • ردود محلية ذكية عند الحاجة
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="إغلاق الشات"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/22"
                >
                  <X className="size-5 hidden lg:block" aria-hidden="true" />
                  <ChevronDown className="size-5 lg:hidden" aria-hidden="true" />
                </button>
              </div>
            </header>

            <div className="scrollbar-none flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => {
                const label = message.role === "assistant"
                  ? sourceLabel(message.source)
                  : null;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div className="max-w-[90%] space-y-2">
                      {label ? (
                        <div className="flex justify-end">
                          <span className="rounded-full border border-brand-line bg-white px-2.5 py-1 text-[11px] font-extrabold text-brand-calm shadow-sm">
                            {label}
                          </span>
                        </div>
                      ) : null}

                      <div
                        className={`rounded-[1.35rem] px-4 py-3 text-sm font-bold leading-7 shadow-sm ${
                          message.role === "user"
                            ? "bg-brand-deep text-white"
                            : "border border-brand-line bg-brand-ivory text-brand-deep"
                        }`}
                      >
                        {message.content}
                      </div>

                      {message.role === "assistant" &&
                      message.actions?.length ? (
                        <div className="flex flex-wrap justify-end gap-2">
                          {message.actions.map((action) => {
                            const Icon = getActionIcon(action.type);

                            return (
                              <a
                                key={`${message.id}-${action.label}`}
                                href={action.href}
                                target={
                                  isExternalAction(action) &&
                                  !action.href.startsWith("tel:") &&
                                  !action.href.startsWith("mailto:")
                                    ? "_blank"
                                    : undefined
                                }
                                rel={
                                  isExternalAction(action)
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-brand-line bg-white px-3 text-xs font-extrabold text-brand-deep shadow-sm transition hover:-translate-y-0.5 hover:border-brand-deep/30"
                              >
                                <Icon className="size-3.5" aria-hidden="true" />
                                {action.label}
                              </a>
                            );
                          })}
                        </div>
                      ) : null}

                      {message.role === "assistant" &&
                      message.suggestedReplies?.length ? (
                        <div className="flex flex-wrap justify-end gap-2">
                          {message.suggestedReplies.map((suggestion) => (
                            <button
                              type="button"
                              key={`${message.id}-${suggestion}`}
                              onClick={() => void sendMessage(suggestion)}
                              disabled={isLoading}
                              className="min-h-8 rounded-full bg-white px-3 text-[11px] font-extrabold text-brand-calm shadow-sm ring-1 ring-brand-line transition hover:bg-brand-ivory disabled:opacity-50"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              {isLoading ? (
                <div className="flex justify-end">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-extrabold text-brand-calm shadow-sm">
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    يكتب الآن
                  </div>
                </div>
              ) : null}

              {error ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-7 text-red-700">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-1 size-4 shrink-0" aria-hidden="true" />
                    <p>{error}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 text-brand-deep shadow-sm"
                  >
                    <RefreshCw className="size-4" aria-hidden="true" />
                    إعادة المحاولة
                  </button>
                </div>
              ) : null}
            </div>

            <div className="border-t border-brand-line bg-white/90 p-4">
              <div className="scrollbar-none -mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1">
                {chatbotQuickQuestions.map((question) => (
                  <button
                    type="button"
                    key={question}
                    onClick={() => void sendMessage(question)}
                    className="shrink-0 rounded-full border border-brand-line bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(247,241,230,0.88))] px-3 py-2 text-xs font-extrabold text-brand-deep shadow-sm transition hover:-translate-y-0.5 hover:bg-white disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {question}
                  </button>
                ))}
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-brand-deep px-3 text-xs font-extrabold text-white shadow-sm"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  تواصل عبر واتساب
                </a>
                <a
                  href={schoolInfo.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-brand-line bg-white px-3 text-xs font-extrabold text-brand-deep shadow-sm"
                >
                  <MapPin className="size-4" aria-hidden="true" />
                  فتح الخريطة
                </a>
              </div>

              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <label className="min-w-0 flex-1">
                  <span className="sr-only">اكتب سؤالك</span>
                  <textarea
                    value={input}
                    onChange={(event) =>
                      setInput(
                        event.currentTarget.value.slice(
                          0,
                          MAX_CLIENT_INPUT_LENGTH,
                        ),
                      )
                    }
                    rows={1}
                    aria-label="اكتب سؤالًا عن الروضة"
                    className="max-h-28 min-h-12 w-full resize-none rounded-2xl border border-brand-line bg-brand-ivory px-4 py-3 text-sm font-bold leading-6 text-brand-deep outline-none transition focus:border-brand-deep focus:ring-4 focus:ring-brand-deep/10"
                  />
                </label>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-deep text-white shadow-sm transition hover:bg-[#11382d] disabled:cursor-not-allowed disabled:bg-brand-calm"
                  aria-label="إرسال السؤال"
                >
                  <Send className="size-5" aria-hidden="true" />
                </button>
              </form>

              <p className="mt-3 text-xs font-bold leading-6 text-brand-calm">
                لا يتم حفظ المحادثات افتراضيًا. لا ترسل بيانات حساسة؛ ولتأكيد
                التسجيل والمقاعد يرجى التواصل مع إدارة الروضة.
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
