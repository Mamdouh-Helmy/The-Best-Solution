/**
 * بيشغّل كود C++ فعليًا عن طريق الـ API route المحلي بتاعنا
 * (app/api/run-cpp/route.js) اللي بدوره بيكلّم Wandbox من على السيرفر.
 *
 * ملحوظتين مهمتين:
 *
 * 1) الملف ده بيكاش النتيجة لكل كود بنفس النص بالظبط (in-memory، طول
 *    عمر الصفحة). ده مهم جدًا لـ CodeCube اللي بيعيد نفس الكود الثابت
 *    كل شوية تلقائيًا — من غير كاش، كنا هنضرب Wandbox (خدمة مجانية
 *    عمومية) بطلب جديد كل دورة أنيميشن للأبد، وده اللي كان بيسبب
 *    أخطاء زي "Resource temporarily unavailable" من ضغط زيادة على
 *    السيرفرات بتاعتهم. مع الكاش، كل كود بيتشغّل فعليًا مرة واحدة بس.
 *
 * 2) فيه إعادة محاولة تلقائية (retry) لو الخطأ الراجع من الخدمة يبان
 *    مؤقت (زي ضغط سيرفر أو resource error)، عشان الأنيميشن ما تفشلش
 *    من أول مرة على طول.
 *
 * الاستخدام: نفس الاستيراد القديم بالظبط، من غير أي تغيير في
 * CodeCube.jsx أو CppPlayground.jsx:
 *   import { runCpp } from "@/lib/piston";
 */

const RUN_CPP_ENDPOINT = "/api/run-cpp";
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

// كاش في الذاكرة: code -> Promise<result>
// بيتصفّر تلقائيًا لما المستخدم يعمل refresh للصفحة، وده كويس، مش
// محتاجين نخزّنه بشكل دائم
const resultCache = new Map();

function looksTransient(output) {
  if (!output) return false;
  const text = output.toLowerCase();
  return (
    text.includes("resource temporarily unavailable") ||
    text.includes("oci runtime error") ||
    text.includes("crun") ||
    text.includes("timed out") ||
    text.includes("timeout")
  );
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function requestRun(code) {
  const res = await fetch(RUN_CPP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    try {
      const data = await res.json();
      if (data && typeof data.output === "string") return data;
    } catch {
      // تجاهل، هنرجع رسالة عامة تحت
    }
    return {
      ok: false,
      stage: "error",
      output: `تعذّر الاتصال بخدمة التشغيل (كود ${res.status}). حاول تاني.`,
    };
  }

  const data = await res.json();
  return {
    ok: !!data.ok,
    stage: data.stage || "error",
    output: data.output || "لم يتم استلام نتيجة من خدمة التشغيل.",
  };
}

async function runWithRetry(code) {
  let lastResult = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      lastResult = await requestRun(code);
    } catch {
      lastResult = {
        ok: false,
        stage: "error",
        output: "تعذّر الوصول لخدمة التشغيل. اتأكد إن عندك اتصال إنترنت وحاول تاني.",
      };
    }

    const shouldRetry = !lastResult.ok && looksTransient(lastResult.output) && attempt < MAX_RETRIES;
    if (!shouldRetry) break;

    await sleep(RETRY_DELAY_MS * (attempt + 1));
  }

  return lastResult;
}

/**
 * بيشغّل كود C++ فعليًا وبيرجّع:
 * { ok: boolean, stage: "compile" | "run" | "error", output: string }
 *
 * نتيجة نفس الكود (نص مطابق تمامًا) بتتكاش، فمكالمة تانية بنفس الكود
 * هترجع فورًا من غير ما تضرب الشبكة تاني.
 */
export async function runCpp(code) {
  if (resultCache.has(code)) {
    return resultCache.get(code);
  }

  const promise = runWithRetry(code);
  resultCache.set(code, promise);

  const result = await promise;

  // لو النتيجة فشل مؤقت حتى بعد المحاولات، ما نكاشهاش عشان المرة
  // الجاية تدّي فرصة تانية بدل ما تفضل عالقة على نفس الخطأ للأبد
  if (!result.ok && looksTransient(result.output)) {
    resultCache.delete(code);
  }

  return result;
}