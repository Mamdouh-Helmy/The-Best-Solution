import { memo } from "react";

// كل الأشكال هنا شكل ثابت بحركة CSS بس (لو محتاجة) — مفيش أي
// useEffect ولا gsap.to بيفضل شغال طول عمر الصفحة. الحركة نفسها
// معرّفة في header.css وبتتقفل تلقائيًا مع prefers-reduced-motion.

// </> — علامة الكود، شكل ثابت من غير أي حركة
function CodeTagShape() {
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
            <path
                d="M9 7.5 4.5 12 9 16.5M15 7.5 19.5 12 15 16.5"
                stroke="var(--color-accent)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// ترس — بيلف باستمرار
function GearShape() {
    const teeth = [0, 45, 90, 135, 180, 225, 270, 315];
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" className="logo-shape logo-shape-gear" style={{ fill: "var(--color-accent2)" }}>
            <circle cx="12" cy="12" r="3.6" />
            {teeth.map((angle) => (
                <rect key={angle} x="11" y="6.2" width="2" height="2.4" rx="0.5" transform={`rotate(${angle} 12 12)`} />
            ))}
        </svg>
    );
}

// كيرسر تيرمينال — رمشة حادة بـ steps() بدل tween بمدة 0.01
function CursorShape() {
    return (
        <svg viewBox="0 0 24 24" width="10" height="14" className="logo-shape logo-shape-cursor">
            <rect x="9" y="3" width="6" height="18" rx="1.5" style={{ fill: "var(--color-accent-soft)" }} />
        </svg>
    );
}

// Git branch — الخط بيترسم نفسه في حلقة مستمرة. pathLength="1" بيخلي
// stroke-dasharray/dashoffset يشتغلوا بنسبة مستقلة عن الطول الفعلي
// (نفس أسلوب مخطط الفوتر)، فمحتجناش getTotalLength() ولا timeline.
function GitBranchShape() {
    return (
        <svg viewBox="0 0 24 24" width="13" height="13">
            <circle cx="6" cy="6" r="2" style={{ fill: "var(--color-accent2)" }} />
            <circle cx="6" cy="18" r="2" style={{ fill: "var(--color-accent2)" }} />
            <circle cx="18" cy="12" r="2" style={{ fill: "var(--color-accent2)" }} />
            <path
                className="logo-shape logo-shape-git"
                d="M6 8v4a4 4 0 0 0 4 4h4M6 8V6"
                fill="none"
                stroke="var(--color-accent2)"
                strokeWidth="1.6"
                strokeLinecap="round"
                pathLength="1"
            />
        </svg>
    );
}

// { } — أحرف ASCII عادية (مش إيموجي)، بتتنفس (scale)
function BraceShape() {
    return (
        <span className="logo-shape logo-shape-brace font-mono text-[0.7rem] font-bold leading-none" style={{ color: "var(--color-accent2)" }}>
            {"{}"}
        </span>
    );
}

// سحابة — بتعوم لأعلى ولأسفل
function CloudShape() {
    return (
        <svg viewBox="0 0 24 24" width="15" height="11" className="logo-shape logo-shape-cloud">
            <path
                d="M6 17a4 4 0 0 1 .4-7.98 5 5 0 0 1 9.44-2A4.5 4.5 0 0 1 17.5 17H6z"
                style={{ fill: "var(--color-accent-soft)" }}
            />
        </svg>
    );
}

// خريطة shapeKey → المكوّن، بتتقرا من LOGO_SEQUENCE في data.js
export const LOGO_SHAPES = {
    codeTag: memo(CodeTagShape),
    gear: memo(GearShape),
    cursor: memo(CursorShape),
    gitBranch: memo(GitBranchShape),
    brace: memo(BraceShape),
    cloud: memo(CloudShape),
};