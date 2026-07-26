export function seededRandom(seed) {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
}

// بيقرّب أي رقم float لعدد خانات عشرية ثابت — ضروري لأي رقم هيتحط في
// style attribute، لأن المتصفح بيخزن قيم الـ inline style جوه الـ
// CSSOM بدقة محدودة (~6 أرقام معنوية) بعد أول parse. لو احنا حطينا
// رقم كامل الدقة (زي 28.358873104734812) وقت الـ SSR، وبعدين React
// حسبه تاني بنفس الدقة الكاملة وقت الـ hydration، هيقارنه بالقيمة
// المقرّبة اللي المتصفح رجّعها من الـ DOM ويلاقيهم مختلفين نصيًا =
// hydration mismatch، حتى لو الرقمين فعليًا نفس القيمة.
export function round(n, decimals = 4) {
    const factor = 10 ** decimals;
    return Math.round(n * factor) / factor;
}

export function waveY(xPercent) {
    const x = xPercent * 10;
    return 70 - Math.sin((x / 1000) * Math.PI * 2.4) * 30 - Math.sin((x / 1000) * Math.PI * 6.2) * 11;
}

export function waveBottomPx(xPercent) {
    return 140 - waveY(xPercent);
}

export function tr(t, key, fallback) {
    const val = t(key);
    return !val || val === key ? fallback : val;
}