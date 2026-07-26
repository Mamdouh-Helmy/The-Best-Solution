// ===== إحصائيات المدار — غيّرها بأرقام الشركة الحقيقية قبل النشر =====
export const DEFAULT_STATS = [
    { value: "+5", label: "سنين خبرة" },
    { value: "+40", label: "مشروع" },
    { value: "+20", label: "عميل" },
];

// ===== ضبط مدار الكوكب =====
export const TILT_DEG = -14;
export const ORBIT_RX = 45;
export const ORBIT_RY = 24;

// ===== عناصر الفضاء الليلية بتاعة AboutSky =====
export const SATELLITES = [
    { top: 12, size: 64, duration: 46, delay: 0, driftY: 14 },
    { top: 58, size: 44, duration: 60, delay: -20, driftY: 10 },
];

export const MINI_PLANETS = [
    { top: 22, left: 8, size: 34, craterSide: "right", floatDuration: 9, delay: -2 },
    { top: 68, left: 14, size: 24, craterSide: "left", floatDuration: 12, delay: -6 },
    { top: 40, left: 92, size: 28, craterSide: "left", floatDuration: 10.5, delay: -4 },
];

// ===== رحلة الشركة (وضع النهار) — 4 محطات =====
export const JOURNEY_STAGES = [
    { top: 16, left: 88, type: "idea", labelKey: "about.stage.idea", w: 74, h: 74, duration: 9, delay: 0, rotate: -4 },
    { top: 70, left: 90, type: "build", labelKey: "about.stage.build", w: 68, h: 68, duration: 11, delay: -3, rotate: 3 },
    { top: 12, left: 6, type: "launch", labelKey: "about.stage.launch", w: 70, h: 70, duration: 10, delay: -5, rotate: 4 },
    { top: 66, left: 4, type: "clients", labelKey: "about.stage.clients", w: 76, h: 76, duration: 12.5, delay: -1.5, rotate: -3 },
];