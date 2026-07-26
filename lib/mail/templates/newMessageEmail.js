// lib/mail/templates/newMessageEmail.js

// قالب HTML بـ inline styles + جدول (لازم كده عشان عملاء الإيميل زي
// Outlook/Gmail بيتجاهلوا كتير من الـ CSS العادي). التصميم بسيط وقريب
// من هوية الداشبورد (accent بنفسجي + خلفية غامقة)، عدّل الألوان تحت
// لو عندك accent مختلف.
export function newMessageEmailHtml({ name, contact, message, createdAt, dashboardUrl }) {
    const date = new Date(createdAt).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });
    const safe = (v) => String(v).replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background-color:#0f1115;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f1115;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#171a21;border-radius:16px;overflow:hidden;border:1px solid #262a33;">
        <tr>
          <td style="background:linear-gradient(135deg,#6c5ce7,#a29bfe);padding:28px 32px;">
            <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.85);font-family:monospace;">رسالة جديدة</p>
            <h1 style="margin:8px 0 0;font-size:22px;color:#fff;">وصلتك رسالة تواصل جديدة</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 4px;font-size:12px;color:#8b8f9a;font-family:monospace;">الاسم</p>
            <p style="margin:0 0 16px;font-size:15px;color:#f2f3f5;font-weight:600;">${safe(name)}</p>

            <p style="margin:0 0 4px;font-size:12px;color:#8b8f9a;font-family:monospace;">وسيلة التواصل</p>
            <p style="margin:0 0 16px;font-size:15px;color:#f2f3f5;font-weight:600;" dir="ltr" align="right">${safe(contact)}</p>

            <p style="margin:0 0 6px;font-size:12px;color:#8b8f9a;font-family:monospace;">الرسالة</p>
            <p style="margin:0 0 20px;font-size:14px;line-height:1.8;color:#dcdfe4;background-color:#1e2229;border-radius:10px;padding:14px 16px;border:1px solid #2a2f38;white-space:pre-wrap;">${safe(message)}</p>

            <p style="margin:0 0 24px;font-size:12px;color:#5f636d;font-family:monospace;">${date}</p>

            ${dashboardUrl ? `<a href="${dashboardUrl}" style="display:inline-block;background-color:#6c5ce7;color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 22px;border-radius:10px;">فتح لوحة التحكم</a>` : ""}
          </td>
        </tr>
        <tr>
          <td style="padding:18px 32px;border-top:1px solid #262a33;">
            <p style="margin:0;font-size:11px;color:#5f636d;">رسالة تلقائية أُرسلت فور استلام نموذج التواصل من موقعك.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}