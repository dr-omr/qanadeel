import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const testimonialRoles = ["parent", "teacher", "visitor"] as const;
export const testimonialStatuses = [
  "pending",
  "approved",
  "rejected",
  "hidden",
] as const;

export type TestimonialRole = (typeof testimonialRoles)[number];
export type TestimonialStatus = (typeof testimonialStatuses)[number];

export type Testimonial = {
  id: string;
  name: string;
  role: TestimonialRole;
  rating?: number;
  comment: string;
  contactInfo?: string;
  status: TestimonialStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  source: "website";
  language: "ar";
};

export type PublicTestimonial = Pick<
  Testimonial,
  | "id"
  | "name"
  | "role"
  | "rating"
  | "comment"
  | "isFeatured"
  | "createdAt"
  | "approvedAt"
  | "language"
>;

export type TestimonialCreateInput = {
  name: unknown;
  role: unknown;
  rating?: unknown;
  comment: unknown;
  contactInfo?: unknown;
};

export type TestimonialUpdateInput = {
  name?: unknown;
  role?: unknown;
  rating?: unknown;
  comment?: unknown;
  contactInfo?: unknown;
};

type UpstashResponse<T> = {
  result?: T;
  error?: string;
};

type ValidationError = {
  error: string;
  field?: "name" | "role" | "rating" | "comment" | "contactInfo";
};

const TESTIMONIAL_HASH_KEY = "qandeel:testimonials:items";
const TESTIMONIAL_ORDER_KEY = "qandeel:testimonials:created";
const MAX_TESTIMONIALS = 500;
const MAX_PUBLIC_TESTIMONIALS = 80;
const MAX_NAME_LENGTH = 80;
const MAX_COMMENT_LENGTH = 700;
const MIN_COMMENT_LENGTH = 10;
const MAX_CONTACT_LENGTH = 120;
const CONTROL_CHARS_PATTERN = /[\u0000-\u001f\u007f-\u009f]/g;
const SUSPICIOUS_HTML_PATTERN =
  /<|>|<\/|<script|javascript:|data:text\/html|on[a-z]+\s*=/i;
const URL_PATTERN = /(https?:\/\/|www\.|[a-z0-9-]+\.[a-z]{2,})/i;
const REPEATED_CHARS_PATTERN = /(.)\1{9,}/;

let writeQueue = Promise.resolve();

export function getTestimonialsStorageMode() {
  return process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
    ? "redis"
    : "file";
}

function getTestimonialsFilePath() {
  return path.join(process.cwd(), ".data", "testimonials.json");
}

function normalizeText(value: unknown, _maxLength: number) {
  void _maxLength;

  if (typeof value !== "string") return "";

  return value
    .replace(CONTROL_CHARS_PATTERN, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isValidRole(value: unknown): value is TestimonialRole {
  return (
    typeof value === "string" &&
    testimonialRoles.includes(value as TestimonialRole)
  );
}

function isValidStatus(value: unknown): value is TestimonialStatus {
  return (
    typeof value === "string" &&
    testimonialStatuses.includes(value as TestimonialStatus)
  );
}

function parseRating(value: unknown): number | undefined | ValidationError {
  if (value === undefined || value === null || value === "") return undefined;

  const rating = Number(value);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return {
      error: "التقييم يجب أن يكون رقمًا من ١ إلى ٥.",
      field: "rating",
    };
  }

  return rating;
}

function hasUnsafeContent(value: string) {
  return (
    SUSPICIOUS_HTML_PATTERN.test(value) ||
    URL_PATTERN.test(value) ||
    REPEATED_CHARS_PATTERN.test(value)
  );
}

function isTestimonial(value: unknown): value is Testimonial {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<Testimonial>;

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    isValidRole(item.role) &&
    (item.rating === undefined ||
      (typeof item.rating === "number" &&
        Number.isInteger(item.rating) &&
        item.rating >= 1 &&
        item.rating <= 5)) &&
    typeof item.comment === "string" &&
    (item.contactInfo === undefined || typeof item.contactInfo === "string") &&
    isValidStatus(item.status) &&
    typeof item.isFeatured === "boolean" &&
    typeof item.createdAt === "string" &&
    item.source === "website" &&
    item.language === "ar"
  );
}

function cleanTestimonial(value: Testimonial): Testimonial {
  return {
    ...value,
    name: normalizeText(value.name, MAX_NAME_LENGTH).slice(0, MAX_NAME_LENGTH),
    comment: normalizeText(value.comment, MAX_COMMENT_LENGTH).slice(
      0,
      MAX_COMMENT_LENGTH,
    ),
    contactInfo: value.contactInfo
      ? normalizeText(value.contactInfo, MAX_CONTACT_LENGTH).slice(
          0,
          MAX_CONTACT_LENGTH,
        )
      : undefined,
    isFeatured: Boolean(value.isFeatured),
  };
}

function sortForAdmin(testimonials: Testimonial[]) {
  return testimonials.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function sortForPublic(testimonials: Testimonial[]) {
  return testimonials.sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;

    const bTime = new Date(b.approvedAt || b.createdAt).getTime();
    const aTime = new Date(a.approvedAt || a.createdAt).getTime();

    return bTime - aTime;
  });
}

function toPublicTestimonial(testimonial: Testimonial): PublicTestimonial {
  const {
    id,
    name,
    role,
    rating,
    comment,
    isFeatured,
    createdAt,
    approvedAt,
    language,
  } = testimonial;

  return {
    id,
    name,
    role,
    rating,
    comment,
    isFeatured,
    createdAt,
    approvedAt,
    language,
  };
}

function validateCreateInput(
  input: TestimonialCreateInput,
): { testimonial: Testimonial } | ValidationError {
  const name = normalizeText(input.name, MAX_NAME_LENGTH);
  const comment = normalizeText(input.comment, MAX_COMMENT_LENGTH);
  const contactInfo = normalizeText(input.contactInfo, MAX_CONTACT_LENGTH);
  const rating = parseRating(input.rating);

  if (!name) {
    return { error: "يرجى كتابة الاسم.", field: "name" };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return {
      error: "الاسم يجب ألا يتجاوز ٨٠ حرفًا.",
      field: "name",
    };
  }

  if (!isValidRole(input.role)) {
    return { error: "يرجى اختيار الصفة.", field: "role" };
  }

  if (typeof rating === "object") {
    return rating;
  }

  if (!comment || comment.length < MIN_COMMENT_LENGTH) {
    return {
      error: "يرجى كتابة تعليق واضح من ١٠ أحرف على الأقل.",
      field: "comment",
    };
  }

  if (comment.length > MAX_COMMENT_LENGTH) {
    return {
      error: "التعليق يجب ألا يتجاوز ٧٠٠ حرف.",
      field: "comment",
    };
  }

  if (contactInfo.length > MAX_CONTACT_LENGTH) {
    return {
      error: "بيانات التواصل يجب ألا تتجاوز ١٢٠ حرفًا.",
      field: "contactInfo",
    };
  }

  if (hasUnsafeContent(name) || hasUnsafeContent(comment)) {
    return {
      error:
        "لا يمكن قبول روابط أو رموز برمجية داخل الاسم أو التعليق حفاظًا على أمان الموقع.",
      field: "comment",
    };
  }

  if (contactInfo && SUSPICIOUS_HTML_PATTERN.test(contactInfo)) {
    return {
      error: "يرجى كتابة وسيلة تواصل صحيحة بدون رموز برمجية.",
      field: "contactInfo",
    };
  }

  const now = new Date().toISOString();

  return {
    testimonial: {
      id: makeId(),
      name,
      role: input.role,
      rating,
      comment,
      contactInfo: contactInfo || undefined,
      status: "pending",
      isFeatured: false,
      createdAt: now,
      updatedAt: now,
      source: "website",
      language: "ar",
    },
  };
}

function validateUpdateInput(
  existing: Testimonial,
  input: TestimonialUpdateInput,
): { testimonial: Testimonial } | ValidationError {
  const name =
    input.name === undefined
      ? existing.name
      : normalizeText(input.name, MAX_NAME_LENGTH);
  const role = input.role === undefined ? existing.role : input.role;
  const comment =
    input.comment === undefined
      ? existing.comment
      : normalizeText(input.comment, MAX_COMMENT_LENGTH);
  const contactInfo =
    input.contactInfo === undefined
      ? existing.contactInfo
      : normalizeText(input.contactInfo, MAX_CONTACT_LENGTH) || undefined;
  const rating =
    input.rating === undefined ? existing.rating : parseRating(input.rating);

  if (!name) {
    return { error: "يرجى كتابة الاسم.", field: "name" };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return {
      error: "الاسم يجب ألا يتجاوز ٨٠ حرفًا.",
      field: "name",
    };
  }

  if (!isValidRole(role)) {
    return { error: "يرجى اختيار الصفة.", field: "role" };
  }

  if (typeof rating === "object") {
    return rating;
  }

  if (!comment || comment.length < MIN_COMMENT_LENGTH) {
    return {
      error: "يرجى كتابة تعليق واضح من ١٠ أحرف على الأقل.",
      field: "comment",
    };
  }

  if (comment.length > MAX_COMMENT_LENGTH) {
    return {
      error: "التعليق يجب ألا يتجاوز ٧٠٠ حرف.",
      field: "comment",
    };
  }

  if (contactInfo && contactInfo.length > MAX_CONTACT_LENGTH) {
    return {
      error: "بيانات التواصل يجب ألا تتجاوز ١٢٠ حرفًا.",
      field: "contactInfo",
    };
  }

  if (hasUnsafeContent(name) || hasUnsafeContent(comment)) {
    return {
      error:
        "لا يمكن قبول روابط أو رموز برمجية داخل الاسم أو التعليق حفاظًا على أمان الموقع.",
      field: "comment",
    };
  }

  if (contactInfo && SUSPICIOUS_HTML_PATTERN.test(contactInfo)) {
    return {
      error: "يرجى كتابة وسيلة تواصل صحيحة بدون رموز برمجية.",
      field: "contactInfo",
    };
  }

  return {
    testimonial: {
      ...existing,
      name,
      role,
      rating,
      comment,
      contactInfo,
      updatedAt: new Date().toISOString(),
    },
  };
}

async function upstashCommand<T>(command: unknown[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Upstash Redis is not configured.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const data = (await response.json()) as UpstashResponse<T>;

  if (!response.ok || data.error) {
    throw new Error(data.error || "Unable to complete Redis command.");
  }

  return data.result;
}

async function readFromRedis() {
  const ids =
    (await upstashCommand<string[]>([
      "ZREVRANGE",
      TESTIMONIAL_ORDER_KEY,
      0,
      MAX_TESTIMONIALS - 1,
    ])) || [];

  if (!ids.length) return [];

  const rows =
    (await upstashCommand<(string | null)[]>([
      "HMGET",
      TESTIMONIAL_HASH_KEY,
      ...ids,
    ])) || [];

  return sortForAdmin(
    rows
      .map((row) => {
        if (!row) return null;

        try {
          return JSON.parse(row) as unknown;
        } catch {
          return null;
        }
      })
      .filter(isTestimonial)
      .map(cleanTestimonial),
  );
}

async function saveToRedis(testimonial: Testimonial) {
  await upstashCommand([
    "HSET",
    TESTIMONIAL_HASH_KEY,
    testimonial.id,
    JSON.stringify(testimonial),
  ]);
  await upstashCommand([
    "ZADD",
    TESTIMONIAL_ORDER_KEY,
    new Date(testimonial.createdAt).getTime(),
    testimonial.id,
  ]);
}

async function deleteFromRedis(id: string) {
  await upstashCommand(["HDEL", TESTIMONIAL_HASH_KEY, id]);
  await upstashCommand(["ZREM", TESTIMONIAL_ORDER_KEY, id]);
}

async function readFromFile() {
  try {
    const raw = await readFile(getTestimonialsFilePath(), "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) return [];

    return sortForAdmin(parsed.filter(isTestimonial).map(cleanTestimonial));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw error;
  }
}

async function writeToFile(testimonials: Testimonial[]) {
  const filePath = getTestimonialsFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(
    filePath,
    `${JSON.stringify(sortForAdmin(testimonials), null, 2)}\n`,
    "utf8",
  );
}

async function readAllTestimonials() {
  if (getTestimonialsStorageMode() === "redis") {
    return readFromRedis();
  }

  return readFromFile();
}

async function replaceAllTestimonials(testimonials: Testimonial[]) {
  if (getTestimonialsStorageMode() === "redis") {
    await Promise.all(testimonials.map(saveToRedis));
    return;
  }

  writeQueue = writeQueue
    .catch(() => undefined)
    .then(() => writeToFile(testimonials));
  await writeQueue;
}

export async function getAllTestimonials() {
  return readAllTestimonials();
}

export async function getApprovedTestimonials(options?: {
  limit?: number;
  role?: TestimonialRole | "all";
  featuredOnly?: boolean;
}) {
  const testimonials = await readAllTestimonials();
  const limit = options?.limit ?? MAX_PUBLIC_TESTIMONIALS;

  return sortForPublic(
    testimonials.filter((testimonial) => {
      if (testimonial.status !== "approved") return false;
      if (options?.featuredOnly && !testimonial.isFeatured) return false;
      if (options?.role && options.role !== "all") {
        return testimonial.role === options.role;
      }

      return true;
    }),
  )
    .slice(0, limit)
    .map(toPublicTestimonial);
}

export async function getPendingTestimonials() {
  const testimonials = await readAllTestimonials();
  return testimonials.filter((testimonial) => testimonial.status === "pending");
}

export async function createTestimonial(input: TestimonialCreateInput) {
  const validation = validateCreateInput(input);

  if ("error" in validation) return validation;

  await saveToRedisOrFile(validation.testimonial);
  await notifyNewTestimonialSubmission(validation.testimonial);

  return { testimonial: validation.testimonial };
}

async function saveToRedisOrFile(testimonial: Testimonial) {
  if (getTestimonialsStorageMode() === "redis") {
    await saveToRedis(testimonial);
    return;
  }

  writeQueue = writeQueue.catch(() => undefined).then(async () => {
    const testimonials = await readFromFile();
    await writeToFile([testimonial, ...testimonials].slice(0, MAX_TESTIMONIALS));
  });

  await writeQueue;
}

export async function updateTestimonial(
  id: string,
  input: TestimonialUpdateInput,
) {
  const testimonials = await readAllTestimonials();
  const existing = testimonials.find((testimonial) => testimonial.id === id);

  if (!existing) {
    return { error: "لم يتم العثور على المشاركة المطلوبة." };
  }

  const validation = validateUpdateInput(existing, input);

  if ("error" in validation) return validation;

  await replaceAllTestimonials(
    testimonials.map((testimonial) =>
      testimonial.id === id ? validation.testimonial : testimonial,
    ),
  );

  return { testimonial: validation.testimonial };
}

async function changeStatus(
  id: string,
  status: TestimonialStatus,
  approvedBy?: string,
) {
  const testimonials = await readAllTestimonials();
  const existing = testimonials.find((testimonial) => testimonial.id === id);

  if (!existing) {
    return { error: "لم يتم العثور على المشاركة المطلوبة." };
  }

  const now = new Date().toISOString();
  const next: Testimonial = {
    ...existing,
    status,
    updatedAt: now,
    approvedAt: status === "approved" ? existing.approvedAt || now : undefined,
    approvedBy: status === "approved" ? approvedBy || "admin" : undefined,
    isFeatured: status === "approved" ? existing.isFeatured : false,
  };

  await replaceAllTestimonials(
    testimonials.map((testimonial) =>
      testimonial.id === id ? next : testimonial,
    ),
  );

  return { testimonial: next };
}

export async function approveTestimonial(id: string, approvedBy?: string) {
  return changeStatus(id, "approved", approvedBy);
}

export async function rejectTestimonial(id: string) {
  return changeStatus(id, "rejected");
}

export async function hideTestimonial(id: string) {
  return changeStatus(id, "hidden");
}

export async function featureTestimonial(id: string, isFeatured = true) {
  const testimonials = await readAllTestimonials();
  const existing = testimonials.find((testimonial) => testimonial.id === id);

  if (!existing) {
    return { error: "لم يتم العثور على المشاركة المطلوبة." };
  }

  if (existing.status !== "approved" && isFeatured) {
    return { error: "لا يمكن تمييز مشاركة غير منشورة." };
  }

  const next: Testimonial = {
    ...existing,
    isFeatured,
    updatedAt: new Date().toISOString(),
  };

  await replaceAllTestimonials(
    testimonials.map((testimonial) =>
      testimonial.id === id ? next : testimonial,
    ),
  );

  return { testimonial: next };
}

export async function deleteTestimonial(id: string) {
  if (getTestimonialsStorageMode() === "redis") {
    await deleteFromRedis(id);
    return { success: true };
  }

  writeQueue = writeQueue.catch(() => undefined).then(async () => {
    const testimonials = await readFromFile();
    await writeToFile(
      testimonials.filter((testimonial) => testimonial.id !== id),
    );
  });

  await writeQueue;

  return { success: true };
}

async function notifyNewTestimonialSubmission(testimonial: Testimonial) {
  const webhookUrl = process.env.TESTIMONIALS_NOTIFICATION_WEBHOOK_URL;

  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "testimonial.pending",
        title: "تم استلام رأي جديد بانتظار المراجعة.",
        testimonial: {
          id: testimonial.id,
          name: testimonial.name,
          role: testimonial.role,
          createdAt: testimonial.createdAt,
        },
      }),
      cache: "no-store",
    });
  } catch (error) {
    console.warn("Testimonial notification failed", error);
  }
}

export const testimonialsService = {
  createTestimonial,
  getApprovedTestimonials,
  getPendingTestimonials,
  getAllTestimonials,
  approveTestimonial,
  rejectTestimonial,
  hideTestimonial,
  deleteTestimonial,
  featureTestimonial,
  updateTestimonial,
};
