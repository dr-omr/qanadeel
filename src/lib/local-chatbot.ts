import {
  fallbackDefaultSuggestions,
  fallbackIntents,
  fallbackUnknownAnswers,
  type ChatbotAction,
  type ChatbotFallbackIntent,
} from "@/data/chatbot-fallback-large";

export type LocalChatbotResult = {
  reply: string;
  intentId: string;
  category: string;
  title: string;
  score: number;
  source: "local";
  suggestedReplies: string[];
  actions: ChatbotAction[];
  topIntents: Array<{
    id: string;
    category: string;
    title: string;
    score: number;
    answer: string;
  }>;
};

const arabicIndicDigits = "٠١٢٣٤٥٦٧٨٩";
const easternArabicDigits = "۰۱۲۳۴۵۶۷۸۹";

const synonymMap: Record<string, string[]> = {
  وين: ["اين", "موقع", "مكان"],
  فين: ["اين", "موقع", "مكان"],
  بكم: ["كم", "رسوم", "سعر"],
  بكام: ["كم", "رسوم", "سعر"],
  باص: ["نقل", "حافلة", "مواصلات"],
  باصات: ["نقل", "حافلة", "مواصلات"],
  واتس: ["واتساب"],
  وتساب: ["واتساب"],
  واتسابكم: ["واتساب", "رقم"],
  دوامكم: ["دوام", "وقت"],
  رقمكم: ["رقم", "تواصل"],
  اسجل: ["تسجيل", "قبول"],
  نسجل: ["تسجيل", "قبول"],
  سجل: ["تسجيل", "قبول"],
  ابني: ["طفلي"],
  ولدي: ["طفلي"],
  بنتي: ["طفلي"],
  طفلي: ["الطفل"],
  اوراق: ["مستندات", "وثائق"],
  ورق: ["مستندات", "وثائق"],
  ايميل: ["بريد", "email"],
  اميل: ["بريد", "email"],
  لوكيشن: ["موقع", "خريطة"],
  ادارة: ["تواصل", "مدير", "مسؤول"],
  فلوس: ["رسوم", "مبلغ", "دفع"],
};

const actionWords: Record<string, string[]> = {
  map: ["افتح", "ارسل", "خريطة", "لوكيشن", "موقع"],
  whatsapp: ["ارسل", "واتساب", "واتس", "رسالة", "تواصل"],
  call: ["اتصل", "اكلم", "هاتف", "تلفون", "رقم"],
  email: ["ايميل", "بريد", "راسل", "email"],
};

const categoryContext: Record<string, string[]> = {
  "الرسوم والدفع": ["رسوم", "سعر", "دفع", "قسط", "ريال"],
  "الصفوف والمراحل": ["صف", "مرحلة", "روضة", "تمهيدي", "عمر"],
  "التسجيل والقبول": ["تسجيل", "قبول", "مقعد", "بيانات", "زيارة"],
  "المستندات المطلوبة": ["اوراق", "مستندات", "وثائق", "شهادة", "تطعيمات"],
  "الدوام والحضور": ["دوام", "حضور", "انصراف", "غياب", "غاب", "وقت"],
  "الموقع والخريطة": ["موقع", "عنوان", "خريطة", "صحار", "الجفرة"],
  التواصل: ["رقم", "واتساب", "هاتف", "بريد", "تواصل"],
  النقل: ["نقل", "باص", "حافلة", "مواصلات"],
  السياسات: ["سياسة", "سياسات", "نظام", "قوانين"],
  "السلامة والرعاية": ["سلامة", "رعاية", "امن", "نظافة", "مرض"],
  "الخدمات والأنشطة": ["خدمات", "انشطة", "تعليم", "مهارات"],
  "الزي والكتب والمواد": ["زي", "كتب", "مواد", "حقيبة", "مستلزمات"],
  "الوجبات والصحة": ["وجبات", "اكل", "حساسية", "دواء", "صحة"],
};

export function normalizeArabic(input: string) {
  return input
    .toLowerCase()
    .replace(/[٠-٩]/g, (digit) => String(arabicIndicDigits.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String(easternArabicDigits.indexOf(digit)))
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/ـ/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/گ/g, "ك")
    .replace(/[^\p{L}\p{N}:]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeArabic(input: string) {
  const normalized = normalizeArabic(input);
  if (!normalized) return [];
  return normalized.split(" ").filter(Boolean);
}

export function expandSynonyms(tokens: string[]) {
  const expanded = new Set(tokens);

  for (const token of tokens) {
    for (const synonym of synonymMap[token] || []) {
      expanded.add(normalizeArabic(synonym));
    }
  }

  return Array.from(expanded);
}

function phraseTokens(value: string) {
  return tokenizeArabic(value);
}

function containsAllTokens(tokens: Set<string>, value: string) {
  const phrase = phraseTokens(value);
  return phrase.length > 0 && phrase.every((token) => tokens.has(token));
}

function phraseIncluded(query: string, phrase: string) {
  const normalizedPhrase = normalizeArabic(phrase);
  return normalizedPhrase.length > 1 && query.includes(normalizedPhrase);
}

function actionTypeMatches(intent: ChatbotFallbackIntent, actionKey: string) {
  if (!intent.actions?.length) return false;

  return intent.actions.some((action) => {
    if (actionKey === "map") return action.type === "map";
    if (actionKey === "whatsapp") return action.type === "whatsapp";
    if (actionKey === "call") return action.type === "call";
    if (actionKey === "email") return action.type === "email";
    return false;
  });
}

function contextBoost(intent: ChatbotFallbackIntent, lastIntentId?: string) {
  if (!lastIntentId) return 0;
  const lastIntent = fallbackIntents.find((item) => item.id === lastIntentId);
  if (!lastIntent) return 0;

  if (lastIntent.id === intent.id) return 2;
  if (lastIntent.relatedIntents?.includes(intent.id)) return 3;
  if (lastIntent.category === intent.category) return 2;
  if (
    lastIntent.category === "التسجيل والقبول" &&
    (intent.category === "الصفوف والمراحل" ||
      intent.category === "المستندات المطلوبة")
  ) {
    return 2;
  }

  return 0;
}

export function scoreIntent(
  query: string,
  intent: ChatbotFallbackIntent,
  lastIntentId?: string,
) {
  const normalizedQuery = normalizeArabic(query);
  const queryTokens = tokenizeArabic(query);
  const expandedTokens = new Set(expandSynonyms(queryTokens));
  let score = intent.priority / 10;

  for (const keyword of intent.keywords) {
    const normalizedKeyword = normalizeArabic(keyword);
    if (!normalizedKeyword) continue;

    if (normalizedQuery === normalizedKeyword) score += 8;
    if (expandedTokens.has(normalizedKeyword)) score += 2;
    else if (phraseIncluded(normalizedQuery, normalizedKeyword)) score += 2;
  }

  for (const pattern of intent.patterns) {
    const normalizedPattern = normalizeArabic(pattern);
    if (!normalizedPattern) continue;

    if (normalizedQuery === normalizedPattern) score += 8;
    else if (phraseIncluded(normalizedQuery, normalizedPattern)) score += 4;
    else if (containsAllTokens(expandedTokens, pattern)) score += 4;
  }

  if (phraseIncluded(normalizedQuery, intent.title)) score += 5;

  for (const categoryWord of categoryContext[intent.category] || []) {
    if (expandedTokens.has(normalizeArabic(categoryWord))) {
      score += 2;
      break;
    }
  }

  for (const [actionKey, words] of Object.entries(actionWords)) {
    if (
      actionTypeMatches(intent, actionKey) &&
      words.some((word) => expandedTokens.has(normalizeArabic(word)))
    ) {
      score += 2;
    }
  }

  score += contextBoost(intent, lastIntentId);

  return score;
}

export function detectIntent(query: string, lastIntentId?: string) {
  const scored = fallbackIntents
    .map((intent) => ({
      intent,
      score: scoreIntent(query, intent, lastIntentId),
    }))
    .sort((a, b) => b.score - a.score);

  return {
    best: scored[0],
    scored,
  };
}

function chooseAnswer(answers: string[], query: string) {
  if (!answers.length) return fallbackUnknownAnswers[0];
  const seed = normalizeArabic(query).length + Date.now();
  return answers[Math.abs(seed) % answers.length];
}

export function getSuggestedReplies(intent?: ChatbotFallbackIntent) {
  if (!intent) return fallbackDefaultSuggestions;

  const suggestions = new Set<string>(intent.suggestedReplies);

  for (const relatedId of intent.relatedIntents || []) {
    const related = fallbackIntents.find((item) => item.id === relatedId);
    if (related?.suggestedReplies[0]) {
      suggestions.add(related.suggestedReplies[0]);
    }
  }

  return Array.from(suggestions).slice(0, 5);
}

export function getActionsForIntent(intent?: ChatbotFallbackIntent) {
  return intent?.actions?.slice(0, 4) || [];
}

export function buildSmartReply(
  intent: ChatbotFallbackIntent,
  query: string,
  lastIntentId?: string,
) {
  const answer = chooseAnswer(intent.answers, query);

  if (
    lastIntentId === "admission_start" &&
    /^child_age_/.test(intent.id)
  ) {
    return `${answer}\n\nإذا رغبت بإكمال التسجيل، أرسل اسم ولي الأمر ورقم الجوال والمرحلة المطلوبة عبر واتساب 94734809.`;
  }

  return answer;
}

function topIntentSummaries(
  scored: Array<{ intent: ChatbotFallbackIntent; score: number }>,
  limit = 5,
) {
  return scored.slice(0, limit).map(({ intent, score }) => ({
    id: intent.id,
    category: intent.category,
    title: intent.title,
    score: Math.round(score * 10) / 10,
    answer: intent.answers[0] || "",
  }));
}

export function getBestFallbackAnswer(
  query: string,
  options: { lastIntentId?: string; threshold?: number } = {},
): LocalChatbotResult {
  const { best, scored } = detectIntent(query, options.lastIntentId);
  const threshold = options.threshold ?? 4.5;
  const useUnknown = !best || best.score < threshold;
  const intent = useUnknown
    ? fallbackIntents.find((item) => item.id === "unknown_fallback") ||
      fallbackIntents[0]
    : best.intent;
  const score = useUnknown ? 0 : best.score;

  return {
    reply: useUnknown
      ? chooseAnswer(fallbackUnknownAnswers, query)
      : buildSmartReply(intent, query, options.lastIntentId),
    intentId: intent.id,
    category: intent.category,
    title: intent.title,
    score: Math.round(score * 10) / 10,
    source: "local",
    suggestedReplies: getSuggestedReplies(intent),
    actions: getActionsForIntent(intent),
    topIntents: topIntentSummaries(scored),
  };
}

export function getTopMatchingIntents(query: string, limit = 5) {
  const { scored } = detectIntent(query);

  return topIntentSummaries(scored, limit).filter((item) => item.score >= 3);
}

export function buildCloudIntentContext(query: string) {
  const top = getTopMatchingIntents(query, 5);

  return top
    .map(
      (item, index) =>
        `${index + 1}. ${item.title} (${item.category}) - ${item.answer}`,
    )
    .join("\n");
}

export function isHighConfidenceFact(result: LocalChatbotResult) {
  return (
    result.score >= 8 &&
    [
      "fees_general",
      "fees_confirmation",
      "working_hours",
      "location_general",
      "map_link",
      "transport_available",
      "transport_fees",
      "phone_contact",
      "whatsapp_contact",
      "email_contact",
      "required_documents",
    ].includes(result.intentId)
  );
}

export function isWeakCloudReply(reply: string) {
  const normalized = normalizeArabic(reply);
  if (normalized.length < 18) return true;

  const weakPhrases = [
    "لا اعرف",
    "لا يمكنني",
    "غير متاكد",
    "كمساعد",
    "تواصل مع الاداره فقط",
    "ليس لدي معلومات",
  ];

  return weakPhrases.some((phrase) => normalized.includes(normalizeArabic(phrase)));
}
