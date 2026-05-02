import { branding } from "./branding";
import { schoolInfo } from "./school-info";

export const chatbotQuickQuestions = [
  "ما الرسوم؟",
  "ما أوقات الدوام؟",
  "أين موقع الروضة؟",
  "هل يوجد نقل؟",
  "كيف أسجل طفلي؟",
  "ما المستندات المطلوبة؟",
];

export const chatbotKnowledgeContext = `
معرفة الروضة الرسمية:
- الاسم: ${schoolInfo.fullName}
- الاسم الرسمي: ${schoolInfo.officialName}
- الدولة: ${schoolInfo.country}
- العنوان: ${schoolInfo.address}
- الهاتف: ${schoolInfo.phone}
- واتساب: ${schoolInfo.whatsapp}
- البريد: ${schoolInfo.email}
- الخريطة: ${schoolInfo.mapUrl}
- الدوام: ${schoolInfo.workingHours}
- الصفوف: روضة ٢، تمهيدي ٢
- الرسوم: ${schoolInfo.tuitionFees.amount}
- النقل: ${schoolInfo.transportFees.status}
- الخدمات: ${schoolInfo.serviceFees
  .map((item) => `${item.service}: ${item.fee} (${item.notes})`)
  .join(" | ")}
- المستندات المطلوبة: ${schoolInfo.admissionDocuments.join("، ")}
- السياسات: ${schoolInfo.policies
  .map((policy) => `${policy.title}: ${policy.summary} ${policy.items.join(" ")}`)
  .join(" | ")}
- خطوات التسجيل: ${schoolInfo.admissionSteps.join(" | ")}
- روابط الموقع: الرئيسية /، الرسوم /fees، التسجيل /admission، السياسات /policies، التواصل /contact، عن الروضة /about.
`.trim();

export const chatbotSystemPrompt = `
أنت "مساعد قناديل العلم"، مساعد رسمي لموقع ${schoolInfo.fullName} في ${schoolInfo.country}.

التزم بهذه القواعد:
- أجب فقط عن: الصفوف، الرسوم، التسجيل، المستندات، الخدمات، السياسات، التواصل، الدوام، الموقع، والنقل.
- لا تخترع أي معلومة غير موجودة في بيانات المدرسة.
- إذا سُئلت عن شيء غير متوفر، قل: "هذه المعلومة تحتاج تأكيدًا من إدارة الروضة، يمكنك التواصل على واتساب ${schoolInfo.whatsapp}."
- إذا سأل الزائر عن التسجيل، اطلب: اسم ولي الأمر، رقم الجوال، عمر الطفل، المرحلة المطلوبة. ثم اقترح إرسالها عبر واتساب.
- لا تؤكد قبولًا ولا مقعدًا.
- استخدم لغة عربية بسيطة، رسمية، دافئة، مختصرة.
- قل عند الحاجة: "تأكيد التسجيل والمقاعد يتم عبر إدارة الروضة."

ألوان الهوية: أخضر داكن ${branding.colors.deepGreen}، بيج دافئ ${branding.colors.warmBeige}.
`.trim();

export function buildChatbotKnowledgeSummary() {
  return {
    schoolName: schoolInfo.fullName,
    country: schoolInfo.country,
    tuitionFees: schoolInfo.tuitionFees.amount,
    classes: schoolInfo.classes,
    transport: schoolInfo.transportFees,
    services: schoolInfo.serviceFees,
    policies: schoolInfo.policies,
    documents: schoolInfo.admissionDocuments,
    contact: {
      phone: schoolInfo.phone,
      whatsapp: schoolInfo.whatsapp,
      email: schoolInfo.email,
      address: schoolInfo.address,
      mapUrl: schoolInfo.mapUrl,
      workingHours: schoolInfo.workingHours,
    },
  };
}
