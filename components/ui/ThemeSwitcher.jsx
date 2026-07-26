// components/ui/ThemeSwitcher.jsx
"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeSwitcher() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "التبديل للوضع الفاتح" : "التبديل للوضع الداكن"}
      className="relative w-16 h-9 rounded-full border border-line overflow-hidden transition-colors duration-500 cursor-pointer"
      style={{
        backgroundImage: isDark
          ? "linear-gradient(180deg, #0B0B14, #1A1A2E)"
          : "linear-gradient(180deg, var(--color-panel2), var(--color-bg))",
      }}
    >
      {/* نجوم صغيرة بتظهر تدريجيًا بس في الدارك مود */}
      <span
        className="absolute w-[3px] h-[3px] rounded-full bg-white transition-opacity duration-500"
        style={{ top: "7px", insetInlineEnd: "10px", opacity: isDark ? 0.9 : 0 }}
      />
      <span
        className="absolute w-[2px] h-[2px] rounded-full bg-white transition-opacity duration-500"
        style={{ top: "22px", insetInlineEnd: "22px", opacity: isDark ? 0.7 : 0, transitionDelay: "100ms" }}
      />
      <span
        className="absolute w-[2px] h-[2px] rounded-full bg-white transition-opacity duration-500"
        style={{ top: "12px", insetInlineEnd: "6px", opacity: isDark ? 0.6 : 0, transitionDelay: "180ms" }}
      />

      {/* الشمس — ثابتة في مكانها طول الوقت، وبتوهّجها هو اللي بيدّي إحساس هالة الكسوف */}
      <span
        className="absolute top-1 w-7 h-7 rounded-full transition-shadow duration-500"
        style={{
          insetInlineStart: "4px",
          backgroundImage:
            "linear-gradient(135deg, var(--color-accent-soft), var(--color-accent2))",
          boxShadow: isDark
            ? "0 0 16px 3px var(--color-accent2)"
            : "0 0 10px 2px var(--color-accent-soft)",
        }}
      />

      {/* القمر — بيتحرك يغطي الشمس بالكامل لما الدارك مود يشتغل، فيحصل "كسوف" */}
      <span
        className="absolute top-1 w-7 h-7 rounded-full transition-all duration-500 ease-in-out"
        style={{
          insetInlineStart: isDark ? "4px" : "36px",
          background: isDark ? "#1A1A2E" : "var(--color-panel)",
          boxShadow:
            "inset -2px -2px 4px rgba(0,0,0,0.35), inset 3px 3px 3px rgba(255,255,255,0.15)",
        }}
      />
    </button>
  );
}