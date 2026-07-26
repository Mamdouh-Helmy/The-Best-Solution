// lib/constants/socialIcons.js

// نفس المفاتيح دي لازم تتطابق مع مفاتيح ICON_LIBRARY في
// components/footer/icons.jsx. موجودة هنا كملف منفصل (بيانات بحتة)
// عشان الفاليديشن في الباك يقدر يتأكد من صحة iconKey من غير ما
// يحتاج يستورد أي كومبوننتس React (icons.jsx فيه JSX ومينفعش يتستورد
// جوه route handlers على السيرفر بنفس الطريقة).
export const SOCIAL_ICON_KEYS = [
    "email",
    "whatsapp",
    "phone",
    "linkedin",
    "github",
    "twitter",
    "instagram",
    "facebook",
    "telegram",
    "youtube",
    "tiktok",
    "globe",
];