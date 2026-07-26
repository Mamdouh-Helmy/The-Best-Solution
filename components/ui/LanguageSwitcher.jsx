// components/ui/LanguageSwitcher.jsx
"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <button
      onClick={toggleLang}
      aria-label={isAr ? "Switch to English" : "التبديل للعربي"}
      className="relative w-12 h-12 shrink-0 group cursor-pointer"
    >
      {/* ورقة خلفية باهتة بتلمح من تحت — إحساس كومة ورق */}
      <span
        className="absolute inset-0"
        style={{
          background: "var(--color-accent2)",
          opacity: 0.35,
          clipPath:
            "polygon(4% 12%, 14% 2%, 28% 9%, 40% 0%, 55% 8%, 68% 1%, 82% 10%, 96% 3%, 100% 18%, 91% 30%, 100% 44%, 89% 56%, 98% 70%, 87% 82%, 96% 94%, 80% 100%, 66% 91%, 52% 99%, 38% 90%, 24% 98%, 10% 88%, 2% 96%, 6% 80%, 0% 66%, 9% 52%, 1% 38%, 11% 24%, 3% 10%)",
          transform: "rotate(11deg) scale(0.86)",
        }}
      />

      {/* الورقة الأساسية — ملونة بالكامل بتدرج الأكسنت، حواف ممزقة، وميل بيتغير مع كل لغة */}
      <span
        className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out group-active:scale-95"
        style={{
          backgroundImage:
            "linear-gradient(150deg, var(--color-accent-soft), var(--color-accent2))",
          clipPath:
            "polygon(3% 10%, 12% 1%, 25% 8%, 38% 0%, 50% 7%, 63% 1%, 76% 9%, 90% 2%, 99% 15%, 92% 28%, 100% 42%, 90% 55%, 99% 68%, 88% 80%, 97% 93%, 82% 99%, 68% 90%, 54% 98%, 40% 89%, 26% 97%, 12% 87%, 1% 95%, 8% 78%, 0% 64%, 10% 50%, 2% 36%, 12% 22%, 4% 9%)",
          transform: isAr ? "rotate(-7deg)" : "rotate(5deg)",
          filter: "drop-shadow(0 4px 5px rgba(0,0,0,0.3))",
        }}
      >
        {/* قطعة صولوتيب شفافة معلّقة عليها الورقة — بتدّي إحساس واقعي إنها ملزوقة مش عايمة */}
        <span
          className="absolute w-6 h-3 rotate-[-18deg]"
          style={{
            top: "-4px",
            insetInlineStart: "8px",
            background: "rgba(255,255,255,0.4)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
          }}
        />

        {/* خطوط خفيفة زي ورقة كشكول — تفصيلة نسيج بسيطة */}
        <span
          className="absolute inset-2 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.6) 4px, rgba(255,255,255,0.6) 5px)",
          }}
        />

        <span
          className={
            isAr
              ? "font-display text-lg text-white relative drop-shadow-sm"
              : "font-mono text-xs font-bold text-white relative drop-shadow-sm"
          }
        >
          {isAr ? "ع" : "EN"}
        </span>
      </span>
    </button>
  );
}