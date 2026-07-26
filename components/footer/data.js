// ثوابت الفوتر — بيانات بحتة من غير أي منطق أو JSX، عشان تتقرا
// وتتعدّل من غير ما تدخل في تفاصيل الكومبوننتس.

export const CHART_WIDTH = 1000;
export const CHART_HEIGHT = 260;

// نقاط "مسار الرحلة" — frac/yFrac نسب من عرض/ارتفاع الـ viewBox
// (0..1) مش بكسلات ثابتة، عشان الرسم يفضل متجاوب.
export const NODES = [
    { id: "idea", key: "footer.idea", fallback: "الفكرة", frac: 0.04, yFrac: 0.86, size: 3.4, deco: true },
    { id: "about", key: "footer.navAbout", fallback: "من نحن", href: "#about", frac: 0.28, yFrac: 0.64, size: 5.5 },
    { id: "projects", key: "footer.navProjects", fallback: "مشاريعنا", href: "#projects", frac: 0.51, yFrac: 0.42, size: 5.5 },
    { id: "testimonials", key: "footer.navTestimonials", fallback: "آراء العملاء", href: "#testimonials", frac: 0.74, yFrac: 0.22, size: 5.5 },
    { id: "contact", key: "footer.cta", fallback: "لنبدأ", href: "#contact", frac: 0.95, yFrac: 0.09, size: 10, big: true },
];

// شظايا انفجار "القص" — إزاحات ثابتة محسوبة مسبقًا (مش trig وقت
// التشغيل)، عشان التوافق مع كل المتصفحات يبقى أوسع.
export const BURST_SHARDS = [
    { rot: -60, tx: -22, ty: -16 },
    { rot: -18, tx: -8, ty: -27 },
    { rot: 18, tx: 9, ty: -27 },
    { rot: 60, tx: 23, ty: -14 },
    { rot: 150, tx: -19, ty: 15 },
    { rot: -150, tx: 19, ty: 15 },
];

// روابط التواصل — iconKey بيتربط بمكوّن الأيقونة في icons.jsx،
// عشان data.js يفضل بيانات بحتة من غير ما يستورد JSX.
export const SOCIALS = [
    { id: "email", href: "mailto:hello@example.com", label: "Email", iconKey: "email" },
    { id: "whatsapp", href: "https://wa.me/000000000000", label: "WhatsApp", iconKey: "chat" },
    { id: "linkedin", href: "#", label: "LinkedIn", iconKey: "node" },
    { id: "github", href: "#", label: "GitHub", iconKey: "brackets" },
];