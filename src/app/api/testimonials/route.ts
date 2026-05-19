import { NextRequest, NextResponse } from "next/server";
import {
  createTestimonial,
  getApprovedTestimonials,
  testimonialRoles,
  type TestimonialRole,
} from "@/lib/testimonials";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return `testimonials:${forwardedFor?.split(",")[0]?.trim() || "local"}`;
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function getRoleFilter(value: string | null): TestimonialRole | "all" {
  if (!value || value === "all") return "all";
  return testimonialRoles.includes(value as TestimonialRole)
    ? (value as TestimonialRole)
    : "all";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = Number(searchParams.get("limit") || 12);
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(limitParam, 1), 80)
      : 12;
    const role = getRoleFilter(searchParams.get("role"));
    const featuredOnly = searchParams.get("featured") === "true";

    const testimonials = await getApprovedTestimonials({
      limit,
      role,
      featuredOnly,
    });

    return NextResponse.json(
      { testimonials },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Testimonials GET failed", error);
    return jsonError("حدث خطأ أثناء تحميل الآراء.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(getClientKey(request), 4, 15 * 60_000);

    if (!rateLimit.allowed) {
      return jsonError(
        "تم إرسال عدة مشاركات خلال وقت قصير. يرجى المحاولة لاحقًا.",
        429,
      );
    }

    const body = (await request.json()) as {
      name?: unknown;
      role?: unknown;
      rating?: unknown;
      comment?: unknown;
      contactInfo?: unknown;
      consent?: unknown;
      website?: unknown;
    };

    if (typeof body.website === "string" && body.website.trim()) {
      return NextResponse.json({ accepted: true });
    }

    if (body.consent !== true) {
      return jsonError(
        "يرجى الموافقة على إرسال الرأي للإدارة قبل المتابعة.",
      );
    }

    const result = await createTestimonial({
      name: body.name,
      role: body.role,
      rating: body.rating,
      comment: body.comment,
      contactInfo: body.contactInfo,
    });

    if ("error" in result) {
      return jsonError(result.error);
    }

    return NextResponse.json(
      {
        status: "pending",
        message:
          "تم استلام مشاركتك بنجاح، وستظهر في الموقع بعد مراجعتها من الإدارة. شكرًا لثقتك بقناديل العلم.",
      },
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Testimonials POST failed", error);
    return jsonError("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.", 500);
  }
}
