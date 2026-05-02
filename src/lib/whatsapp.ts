type WhatsappMessageInput = {
  schoolName: string;
  name?: string;
  mobile?: string;
  childAge?: string;
  requestedStage?: string;
  requestType?: string;
  message?: string;
};

const arabicIndicDigits = "٠١٢٣٤٥٦٧٨٩";
const easternArabicDigits = "۰۱۲۳۴۵۶۷۸۹";

export function normalizeWhatsappNumber(value: string) {
  const normalizedDigits = value
    .replace(/[٠-٩]/g, (digit) => String(arabicIndicDigits.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String(easternArabicDigits.indexOf(digit)))
    .replace(/\D/g, "");

  if (normalizedDigits.startsWith("968")) {
    return normalizedDigits;
  }

  if (normalizedDigits.length === 8) {
    return `968${normalizedDigits}`;
  }

  if (normalizedDigits.startsWith("0")) {
    const withoutLeadingZero = normalizedDigits.replace(/^0+/, "");
    return withoutLeadingZero.length === 8
      ? `968${withoutLeadingZero}`
      : withoutLeadingZero;
  }

  return normalizedDigits;
}

export function buildWhatsappMessage({
  schoolName,
  name = "غير محدد",
  mobile = "غير محدد",
  childAge,
  requestedStage,
  requestType,
  message = "أرغب بالاستفسار عن التسجيل والرسوم.",
}: WhatsappMessageInput) {
  return [
    `السلام عليكم، أرغب بالتواصل مع ${schoolName}.`,
    `الاسم: ${name}`,
    `رقم الجوال: ${mobile}`,
    childAge ? `عمر الطفل: ${childAge}` : null,
    requestedStage ? `المرحلة: ${requestedStage}` : null,
    requestType ? `نوع الطلب: ${requestType}` : null,
    `الرسالة: ${message}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildWhatsappUrl(phone: string, message: string) {
  const whatsappNumber = normalizeWhatsappNumber(phone);
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
