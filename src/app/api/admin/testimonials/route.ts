import { NextRequest, NextResponse } from "next/server";
import { isAdminConfigured, isAdminRequest } from "@/lib/admin-auth";
import {
  getAllTestimonials,
  testimonialStatuses,
  type TestimonialStatus,
} from "@/lib/testimonials";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function getStatusFilter(value: string | null): TestimonialStatus | "all" {
  if (!value || value === "all") return "all";
  return testimonialStatuses.includes(value as TestimonialStatus)
    ? (value as TestimonialStatus)
    : "all";
}

export async function GET(request: NextRequest) {
  if (!isAdminConfigured()) {
    return jsonError(
      "لوحة الإدارة تحتاج إلى إعداد TESTIMONIALS_ADMIN_TOKEN.",
      503,
    );
  }

  if (!isAdminRequest(request)) {
    return jsonError("غير مصرح بالدخول إلى لوحة إدارة الآراء.", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = getStatusFilter(searchParams.get("status"));
    const featuredOnly = searchParams.get("featured") === "true";
    const allTestimonials = await getAllTestimonials();
    const testimonials = allTestimonials.filter((testimonial) => {
      if (status !== "all" && testimonial.status !== status) return false;
      if (featuredOnly && !testimonial.isFeatured) return false;
      return true;
    });

    return NextResponse.json(
      {
        testimonials,
        counts: {
          all: allTestimonials.length,
          pending: allTestimonials.filter((item) => item.status === "pending")
            .length,
          approved: allTestimonials.filter((item) => item.status === "approved")
            .length,
          rejected: allTestimonials.filter((item) => item.status === "rejected")
            .length,
          hidden: allTestimonials.filter((item) => item.status === "hidden")
            .length,
          featured: allTestimonials.filter((item) => item.isFeatured).length,
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Admin testimonials GET failed", error);
    return jsonError("تعذر تحميل مشاركات الإدارة.", 500);
  }
}
