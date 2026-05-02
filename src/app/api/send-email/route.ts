import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, mobile, childAge, requestedStage, requestType, message } = body;

    if (!name || !mobile) {
      return Response.json({ success: false, error: "بيانات ناقصة" }, { status: 400 });
    }

    await resend.emails.send({
      // Free tier: must use onboarding@resend.dev as sender
      from: "مدرسة قناديل العلم (مرحلة الروضة) <onboarding@resend.dev>",
      // Change this to your verified Resend email / inbox
      to: ["qanadeel@moe.om"],
      replyTo: mobile ? `${name} <noreply@example.com>` : undefined,
      subject: `📩 طلب ${requestType ?? "تواصل"} جديد — ${name}`,
      html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f7f1e6;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#17483A;padding:28px 32px;text-align:center;">
      <h1 style="margin:0;color:#D9C39A;font-size:20px;font-weight:800;">مدرسة قناديل العلم (مرحلة الروضة)</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">طلب جديد من الموقع الرسمي</p>
    </div>

    <!-- Badge -->
    <div style="padding:20px 32px 0;">
      <span style="display:inline-block;background:#f0faf5;border:1px solid #c3e6d5;color:#17483A;font-size:12px;font-weight:700;padding:6px 14px;border-radius:999px;">
        نوع الطلب: ${requestType ?? "تواصل عام"}
      </span>
    </div>

    <!-- Fields -->
    <div style="padding:20px 32px 28px;">
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ["👤 اسم ولي الأمر", name],
          ["📱 رقم الجوال", mobile],
          ["🎂 عمر الطفل", childAge || "—"],
          ["🎓 المرحلة المطلوبة", requestedStage || "—"],
          ["📋 نوع الطلب", requestType || "—"],
        ]
          .map(
            ([label, value], i) => `
          <tr style="background:${i % 2 === 0 ? "#f9f9f9" : "white"};">
            <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#555;white-space:nowrap;border-bottom:1px solid #eee;">${label}</td>
            <td style="padding:12px 16px;font-size:14px;font-weight:800;color:#17483A;border-bottom:1px solid #eee;">${value}</td>
          </tr>`,
          )
          .join("")}
        <tr>
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#555;vertical-align:top;">💬 الرسالة</td>
          <td style="padding:12px 16px;font-size:14px;color:#333;line-height:1.7;">${message || "—"}</td>
        </tr>
      </table>
    </div>

    <!-- CTA -->
    <div style="padding:0 32px 28px;text-align:center;">
      <a href="https://wa.me/96894734809" 
         style="display:inline-block;background:#25D366;color:white;text-decoration:none;font-weight:800;font-size:14px;padding:14px 28px;border-radius:999px;">
        رد عبر واتساب
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#f7f1e6;padding:16px 32px;text-align:center;">
      <p style="margin:0;color:#999;font-size:11px;">
        أُرسلت هذه الرسالة تلقائياً من موقع مدرسة قناديل العلم (مرحلة الروضة) — ${new Date().toLocaleDateString("ar-OM", { year: "numeric", month: "long", day: "numeric" })}
      </p>
    </div>

  </div>
</body>
</html>`,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("[send-email] error:", error);
    return Response.json({ success: false, error: "فشل الإرسال" }, { status: 500 });
  }
}
