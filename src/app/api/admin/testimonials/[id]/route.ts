import { NextRequest, NextResponse } from "next/server";
import { isAdminConfigured, isAdminRequest } from "@/lib/admin-auth";
import {
  approveTestimonial,
  deleteTestimonial,
  featureTestimonial,
  hideTestimonial,
  rejectTestimonial,
  updateTestimonial,
} from "@/lib/testimonials";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function assertAdmin(request: NextRequest) {
  if (!isAdminConfigured()) {
    return jsonError(
      "لوحة الإدارة تحتاج إلى إعداد TESTIMONIALS_ADMIN_TOKEN.",
      503,
    );
  }

  if (!isAdminRequest(request)) {
    return jsonError("غير مصرح بالدخول إلى لوحة إدارة الآراء.", 401);
  }

  return null;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const authError = assertAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      action?: string;
      name?: unknown;
      role?: unknown;
      rating?: unknown;
      comment?: unknown;
      contactInfo?: unknown;
    };
    const approvedBy = request.headers.get("x-admin-name") || "admin";

    let result:
      | Awaited<ReturnType<typeof approveTestimonial>>
      | Awaited<ReturnType<typeof updateTestimonial>>;

    if (body.action === "approve") {
      result = await approveTestimonial(id, approvedBy);
    } else if (body.action === "reject") {
      result = await rejectTestimonial(id);
    } else if (body.action === "hide") {
      result = await hideTestimonial(id);
    } else if (body.action === "feature") {
      result = await featureTestimonial(id, true);
    } else if (body.action === "unfeature") {
      result = await featureTestimonial(id, false);
    } else if (body.action === "update") {
      result = await updateTestimonial(id, {
        name: body.name,
        role: body.role,
        rating: body.rating,
        comment: body.comment,
        contactInfo: body.contactInfo,
      });
    } else {
      return jsonError("الإجراء المطلوب غير معروف.");
    }

    if ("error" in result) {
      return jsonError(result.error || "تعذر تنفيذ الإجراء المطلوب.");
    }

    return NextResponse.json(
      { testimonial: result.testimonial },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Admin testimonials PATCH failed", error);
    return jsonError("تعذر تنفيذ الإجراء المطلوب.", 500);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const authError = assertAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await context.params;
    await deleteTestimonial(id);

    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Admin testimonials DELETE failed", error);
    return jsonError("تعذر حذف المشاركة.", 500);
  }
}
