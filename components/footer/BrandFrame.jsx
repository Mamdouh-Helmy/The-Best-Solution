import { memo, useId } from "react";

// إطار مرسوم بإيد حوالين اسم البراند — بيترسم لوحده لما `active`
// تبقى true (مش عند hover)، عشان يفضل ظاهر ومتناسق مع باقي عناصر
// السيكشن اللي كلها بترسم نفسها عند الظهور.
function BrandFrame({ children, active }) {
    const id = useId();
    return (
        <span className="ftr-brand-frame">
            <svg className="ftr-brand-frame-svg" viewBox="0 0 150 40" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                    <linearGradient id={`brandframe-${id}`} x1="0" y1="0" x2="150" y2="40" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--color-accent-soft)" />
                        <stop offset="100%" stopColor="var(--color-accent2)" />
                    </linearGradient>
                </defs>
                <path
                    className={`ftr-brand-frame-path ${active ? "is-drawn" : ""}`}
                    d="M9,6 C54,2 100,2 141,7 C145,15 144,26 141,35 C96,39 48,38 10,34 C5,25 5,15 9,6 Z"
                    fill="none"
                    stroke={`url(#brandframe-${id})`}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength="100"
                />
            </svg>
            <span className="ftr-brand-frame-text">{children}</span>
        </span>
    );
}

export default memo(BrandFrame);