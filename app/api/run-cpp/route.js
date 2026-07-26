/**
 * سيرفر-سايد فقط — بيستقبل كود C++ من الـ client ويشغّله فعليًا عن طريق
 * OnlineCompiler.io: خدمة مخصصة لتنفيذ الكود، مجانية لحد مليون طلب في
 * الشهر، من غير أي بطاقة ائتمان — بس تسجيل دخول بحساب Google.
 *
 * الإعداد:
 * 1) سجّل دخول على https://api.onlinecompiler.io/ بحساب Google.
 * 2) من صفحة "API Keys" اعمل مفتاح جديد.
 * 3) ضيفه في .env.local:
 *      ONLINECOMPILER_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 */

export const runtime = "nodejs";

const RUN_URL = "https://api.onlinecompiler.io/api/run-code-sync/";
const CPP_COMPILER = "g++-15";

export async function POST(req) {
  const apiKey = process.env.ONLINECOMPILER_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        ok: false,
        stage: "error",
        output: "متغير البيئة ONLINECOMPILER_API_KEY مش متظبط على السيرفر.",
      },
      { status: 500 }
    );
  }

  let code;
  try {
    const body = await req.json();
    code = body?.code;
  } catch {
    return Response.json(
      { ok: false, stage: "error", output: "طلب غير صالح." },
      { status: 400 }
    );
  }

  if (!code || typeof code !== "string") {
    return Response.json(
      { ok: false, stage: "error", output: "مفيش كود للتشغيل." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(RUN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        compiler: CPP_COMPILER,
        code,
        input: "",
      }),
    });

    if (!res.ok) {
      let detail = "";
      try {
        const errBody = await res.json();
        detail = errBody?.detail || errBody?.message || JSON.stringify(errBody);
      } catch {
        // تجاهل
      }
      return Response.json({
        ok: false,
        stage: "error",
        output: `تعذّر الاتصال بخدمة التشغيل (كود ${res.status})${detail ? `: ${detail}` : ""}.`,
      });
    }

    const data = await res.json();

    const output = (data.output || "").trim();
    const errorText = (data.error || "").trim();
    const exitCode = data.exit_code;

    // لو مفيش أي ناتج طباعة خالص وفيه رسالة خطأ، يبقى الأغلب إن الكود
    // فشل في مرحلة الترجمة ومحصلش تنفيذ فعلي
    if (!output && errorText) {
      return Response.json({
        ok: false,
        stage: "compile",
        output: errorText,
      });
    }

    const ok = data.status === "success" && exitCode === 0;
    const text = output + (errorText ? "\n" + errorText : "");

    return Response.json({
      ok,
      stage: "run",
      output: text.trim() || "(البرنامج نفّذ من غير أي طباعة على الشاشة)",
    });
  } catch {
    return Response.json({
      ok: false,
      stage: "error",
      output: "تعذّر الوصول لخدمة التشغيل. اتأكد إن عندك اتصال إنترنت وحاول تاني.",
    });
  }
}