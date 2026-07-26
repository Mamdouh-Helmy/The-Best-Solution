// lib/mail/sendContactNotification.js
import { getTransporter } from "./transporter";
import { newMessageEmailHtml } from "./templates/newMessageEmail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContactNotification(doc) {
    if (!process.env.SMTP_HOST || !process.env.ADMIN_EMAIL) {
        console.warn("[mail] SMTP غير مُعدّ — تم تخطي إرسال الإيميل");
        return;
    }

    const transporter = getTransporter();
    const dashboardUrl = process.env.SITE_URL ? `${process.env.SITE_URL}/admin/messages` : undefined;

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        replyTo: EMAIL_RE.test(doc.contact) ? doc.contact : undefined,
        subject: `📩 رسالة جديدة من ${doc.name}`,
        html: newMessageEmailHtml({
            name: doc.name,
            contact: doc.contact,
            message: doc.message,
            createdAt: doc.createdAt,
            dashboardUrl,
        }),
    });
}