// TextMarks.jsx
"use client";

import { useId } from "react";

/* ============================================================
   عناصر مساعدة داخلية صغيرة — كل Mark تحت بيستخدمها بدل ما يكرر
   نفس كود الجراديانت أو نفس منطق "الرسم عند الهوفر" في كل مرة.
   مش متصدّرة (export) لأنها تفاصيل تنفيذ داخلية بس.
   ============================================================ */

// جراديانت قياسي بلونين، بينادى من جوه أي رسمة محتاجة تدرّج لوني.
function MarkGradient({ id, x1 = "0", y1 = "0", x2 = "100", y2 = "0", from = "var(--color-accent-soft)", to = "var(--color-accent2)" }) {
  return (
    <defs>
      <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={from} />
        <stop offset="100%" stopColor={to} />
      </linearGradient>
    </defs>
  );
}

// path بيترسم لوحده تدريجيًا (stroke-dashoffset) — إما عند الهوفر
// (drawOnHover=true) أو ظاهر تمامًا على طول (drawOnHover=false).
function DrawnStroke({ d, gradientId, strokeWidth = 2.4 }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={`url(#${gradientId})`}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength="100"
      strokeDasharray="100"
      strokeDashoffset="100"
      className="transition-[stroke-dashoffset] duration-500 ease-out group-hover:[stroke-dashoffset:0]"
    />
  );
}

// path مليان بلون (fill) — بيتستخدم في اللطخات زي بقعة الهايلايتر،
// مفيهوش أنيميشن رسم لأنه أصلاً مش خط بل مساحة.
function FilledBlob({ d, gradientId, opacity = 0.75 }) {
  return <path d={d} fill={`url(#${gradientId})`} opacity={opacity} />;
}

// رأس سهم بسيط (خطين بيتقابلوا) — بيتستخدم في PointerArrow و TripleArrows.
function ArrowHead({ d, gradientId, strokeWidth = 3 }) {
  return (
    <path
      d={d}
      stroke={`url(#${gradientId})`}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
}

/* ============================================================
   الرسومات المتصدّرة (Marks) — كل واحدة بتوصف شكلها بس (الـ path
   والـ viewBox)، وبتسيب مهمة الرسم/الجراديانت للمكونات اللي فوق.
   ============================================================ */

// هايلايتر بإحساس رسم إيد حقيقي — ضربتين متراكبتين بزاوية مختلفة شوية.
export function HighlightMark({ children, className = "" }) {
  const id = useId();
  return (
    <span className={`relative inline-block px-3 py-1 ${className}`}>
      <svg
        className="absolute -inset-x-[5%] -inset-y-[12%] -z-10 h-[124%] w-[110%] rotate-[1.2deg]"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <MarkGradient id={`hl1-${id}`} />
        <FilledBlob
          gradientId={`hl1-${id}`}
          opacity={0.7}
          d="M4,22 C2,15 3,8 7,5 C26,1 52,3 68,2 C81,1 92,4 96,9
             C97,16 96,22 94,27 C76,31 48,29 24,30 C13,30.5 5,27 4,22 Z"
        />
      </svg>
      <svg
        className="absolute -inset-x-[3%] -inset-y-[8%] -z-10 h-[116%] w-[106%] -rotate-[2.4deg]"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <FilledBlob
          gradientId={`hl1-${id}`}
          opacity={0.75}
          d="M3,25 C1,17 2,9 6,4 C22,0 48,2 64,1 C79,0 91,3 97,8
             C99,15 98,24 95,30 C78,35 50,32 25,33.5 C14,34.5 3,29 3,25 Z"
        />
      </svg>
      <span className="relative text-white font-bold">{children}</span>
    </span>
  );
}

// سهم صغير مرسوم بإيد بيشاور على العنصر جنبه.
export function PointerArrow({ flip = false, className = "" }) {
  const id = useId();
  return (
    <svg
      className={`absolute top-1 ${flip ? "-right-5 mr-1 scale-x-[-1]" : "-left-5 ml-1"} w-10 h-14 pointer-events-none ${className}`}
      viewBox="0 0 50 70"
      fill="none"
      aria-hidden="true"
    >
      <MarkGradient id={`arrow-${id}`} x1="5" y1="0" x2="25" y2="70" />
      <ArrowHead gradientId={`arrow-${id}`} d="M8,4 C4,16 20,22 14,34 C10,44 22,50 18,58" />
      <ArrowHead gradientId={`arrow-${id}`} d="M18,58 L9,48 M18,58 L27,50" />
    </svg>
  );
}

// خط تحتي موجي، ظاهر على طول (مش مربوط بهوفر) — بيتستخدم جوه فقرات.
export function MarkUnderline({ children, className = "" }) {
  const id = useId();
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative">{children}</span>
      <svg className="absolute -bottom-1.5 left-0 w-full h-2.5" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M1,6 C15,2 20,10 34,6 C48,2 53,10 67,6 C81,2 86,9 99,5"
          fill="none"
          stroke="var(--color-accent2)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

// دايرة/لفة مرسومة بإيد حوالين كلمة قصيرة (زي "open"، "live").
export function CircleMark({ children, className = "" }) {
  const id = useId();
  return (
    <span className={`relative inline-block px-1.5 ${className}`}>
      <svg
        className="absolute -inset-x-[16%] -inset-y-[38%] -z-10 h-[176%] w-[132%] -rotate-[2deg]"
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <MarkGradient id={`circle-${id}`} x2="100" y2="50" />
        <path
          d="M51,3 C75,2 93,11 95,25 C97,37 83,46 56,48
             C29,49.5 6,43 4,27 C2.5,13 23,4.5 51,3 Z"
          fill="none"
          stroke={`url(#circle-${id})`}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

// 3 سهام متجمعة بتلفت النظر لكلمة واحدة مهمة.
export function TripleArrows({ className = "" }) {
  const id = useId();
  const arrows = [
    { d: "M20,4 C30,20 38,26 52,48", tipX: 52, tipY: 48, rotate: -32.5 },
    { d: "M80,0 C80,16 80,32 80,48", tipX: 80, tipY: 48, rotate: 0 },
    { d: "M140,4 C130,20 122,26 108,48", tipX: 108, tipY: 48, rotate: 32.5 },
  ];
  return (
    <svg className={`pointer-events-none ${className}`} viewBox="0 0 160 64" fill="none" aria-hidden="true">
      <MarkGradient id={`tri-${id}`} x2="160" y2="64" />
      {arrows.map(({ d, tipX, tipY, rotate }, i) => (
        <g key={i}>
          <ArrowHead gradientId={`tri-${id}`} strokeWidth={2.6} d={d} />
          <g transform={`translate(${tipX} ${tipY}) rotate(${rotate})`}>
            <ArrowHead gradientId={`tri-${id}`} strokeWidth={2.6} d="M0,0 L-6,-9 M0,0 L6,-9" />
          </g>
        </g>
      ))}
    </svg>
  );
}

// فقاعة كلام بترسم نفسها عند الهوفر — لعناصر التواصل/الرسايل.
export function SpeechBubbleMark({ children, className = "" }) {
  const id = useId();
  return (
    <span className={`group relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        className="absolute -inset-x-[14%] -inset-y-[55%] -z-0 h-[210%] w-[128%] rotate-[1deg] pointer-events-none"
        viewBox="0 0 100 46"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <MarkGradient id={`bubble-${id}`} x2="100" y2="46" />
        <DrawnStroke
          gradientId={`bubble-${id}`}
          d="M8,4 C30,1 60,1 88,3 C95,4 97,9 96,16
             C97,23 95,30 90,32 C70,35 45,35 30,34
             L18,42 L20,33 C10,31 4,25 4,17 C3,10 4,6 8,4 Z"
        />
      </svg>
    </span>
  );
}

// إطار/تاج مرسوم بإيد حوالين كلمة، بفتحة صغيرة بتبان بعد ما
// الإطار يخلص رسمه — لعناصر زي روابط المشاريع.
export function TagFrameMark({ children, className = "", holeSide = "start" }) {
  const id = useId();
  const isEnd = holeSide === "end";
  return (
    <span className={`group relative inline-block px-2.5 py-1 ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        className="absolute -inset-x-[6%] -inset-y-[28%] -z-0 h-[156%] w-[112%] -rotate-[1deg] pointer-events-none"
        viewBox="0 0 100 34"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <MarkGradient id={`tag-${id}`} x2="100" y2="34" />
        <DrawnStroke
          gradientId={`tag-${id}`}
          strokeWidth={2.2}
          d={
            isEnd
              ? "M6,4 C40,1 70,2 94,5 C97,12 96,22 95,30 C65,32 30,31 5,29 C3,21 4,11 6,4 Z"
              : "M6,5 C30,2 65,1 94,4 C96,11 95,21 97,29 C70,31 35,32 5,30 C4,22 3,12 6,5 Z"
          }
        />
        <circle
          cx={isEnd ? 90 : 10}
          cy={8}
          r="3.2"
          fill="none"
          stroke={`url(#tag-${id})`}
          strokeWidth="2"
          opacity="0"
          className="transition-opacity duration-200 delay-500 group-hover:opacity-100"
        />
      </svg>
    </span>
  );
}

// بياخد جملة كاملة ويحط الخط الموجي تحت آخر كلمة بس فيها.
export function UnderlineLastWord({ text, className = "", markClassName = "font-bold text-ink" }) {
  const words = text.trim().split(" ");
  const lastWord = words.pop();
  const rest = words.join(" ");

  return (
    <p className={className}>
      {rest}{" "}
      <MarkUnderline className={markClassName}>{lastWord}</MarkUnderline>
    </p>
  );
}

// إضافة تحت باقي الـ exports في TextMarks.jsx

// خط موجي بيترسم لوحده تحت الكلمة عند الهوفر (draw-on-hover) —
// نفس شكل MarkUnderline لكن متحرك بدل ما يكون ظاهر على طول.
export function WavyDrawMark({ children, className = "" }) {
  const id = useId();
  return (
    <span className={`group relative inline-block ${className}`}>
      <span className="relative">{children}</span>
      <svg
        className="absolute -bottom-1.5 start-0 w-full h-2.5 overflow-visible pointer-events-none"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <MarkGradient id={`wavy-${id}`} />
        <DrawnStroke gradientId={`wavy-${id}`} strokeWidth={4} d="M1,6 C15,2 20,10 34,6 C48,2 53,10 67,6 C81,2 86,9 99,5" />
      </svg>
    </span>
  );
}

// دايرة مرسومة بإيد بتلف حوالين الكلمة عند الهوفر (draw-on-hover) —
// نفس path بتاع CircleMark لكن متحركة بدل ما تكون ظاهرة على طول.
export function CircleDrawMark({ children, className = "" }) {
  const id = useId();
  return (
    <span className={`group relative inline-block px-1.5 ${className}`}>
      <span className="relative">{children}</span>
      <svg
        className="absolute -inset-x-[16%] -inset-y-[45%] -z-10 h-[190%] w-[132%] -rotate-[2deg] pointer-events-none"
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <MarkGradient id={`circledraw-${id}`} x2="100" y2="50" />
        <DrawnStroke gradientId={`circledraw-${id}`} d="M51,3 C75,2 93,11 95,25 C97,37 83,46 56,48
             C29,49.5 6,43 4,27 C2.5,13 23,4.5 51,3 Z" />
      </svg>
    </span>
  );
}

// بقعة هايلايتر بتنتشر تحت الكلمة من نقطة البداية للنهاية عند الهوفر،
// وبتغيّر لون النص لأبيض فوقها. sweepFrom بيتحكم في اتجاه الانتشار
// ("start" أو "end") — مرّر الاتجاه المناسب حسب isRTL عند الاستخدام.
// textClassName بيتحكم في لون النص قبل/أثناء الهوفر — افتراضيًا
// text-ink العادي، لكن ممكن تستبدله بلون مخصص (زي accent2 ثابت).
export function HighlightSweepMark({ children, className = "", sweepFrom = "start" }) {
  const id = useId();
  const origin = sweepFrom === "end" ? "100% 50%" : "0% 50%";
  return (
    <span className={`group relative inline-block py-1 px-0.5 ${className}`}>
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
        {children}
      </span>
      <svg
        className="absolute -inset-x-[10%] -inset-y-[30%] -z-0 h-[160%] w-[120%] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
        style={{ transformOrigin: origin }}
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <MarkGradient id={`sweep-${id}`} />
        <FilledBlob
          gradientId={`sweep-${id}`}
          opacity={0.85}
          d="M4,22 C2,15 3,8 7,5 C26,1 52,3 68,2 C81,1 92,4 96,9
             C97,16 96,22 94,27 C76,31 48,29 24,30 C13,30.5 5,27 4,22 Z"
        />
      </svg>
    </span>
  );
}

// سهم بسيط بيتحرك لتحت عند الهوفر — لعناصر زي روابط الفوتر أو أي
// حاجة معناها "روح لتحت / كمّل".
export function DownArrowMark({ children, className = "" }) {
  return (
    <span className={`group inline-flex items-center gap-1.5 ${className}`}>
      <span>{children}</span>
      <svg
        viewBox="0 0 24 24"
        width="10"
        height="10"
        fill="none"
        className="transition-transform duration-300 group-hover:translate-y-1"
        aria-hidden="true"
      >
        <path d="M12 4v14M5 11l7 7 7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}