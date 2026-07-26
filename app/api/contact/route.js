// app/api/contact/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/models/Message";
import { validateContactPayload } from "@/lib/validation/contact";
import { sendContactNotification } from "@/lib/mail/sendContactNotification";

export async function POST(req) {
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // honeypot بسيط: حقل مخفي في الفورم (name="website") لازم يفضل فاضي
    // عند البني آدمين. لو اتملى معناها بوت — نرد بنجاح وهمي من غير حفظ.
    if (body.website) {
        return NextResponse.json({ ok: true });
    }

    const { isValid, errors, values } = validateContactPayload(body);
    if (!isValid) {
        return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
    }

    await connectDB();
    const doc = await Message.create(values);

    // الإيميل مش لازم يوقف الريسبونس — لو الـ SMTP بطيء أو واقع، المستخدم
    // برضه بياخد "اترسلت" فورًا لأن الرسالة اتحفظت في الداتابيز فعلاً.
    sendContactNotification(doc).catch((err) => {
        console.error("[contact] failed to send notification email:", err.message);
    });

    return NextResponse.json({ ok: true, id: doc._id }, { status: 201 });
}