import { memo } from "react";

// =====================================================================
// ===== بانل "comet.trace" — مذنّب بذيل طبقات ونجوم خلفية =====
// =====================================================================
function CometDecor({ uid }) {
    const coreId = `proj-comet-core-${uid}`;
    const tailId = `proj-comet-tail-${uid}`;
    const glowId = `proj-comet-glow-${uid}`;
    const stars = [
        { x: 18, y: 30, r: 1.3, d: "0s" },
        { x: 40, y: 12, r: 1, d: "0.4s" },
        { x: 70, y: 46, r: 1.5, d: "0.9s" },
        { x: 34, y: 70, r: 1, d: "1.3s" },
        { x: 12, y: 96, r: 1.2, d: "1.7s" },
        { x: 96, y: 20, r: 1, d: "2.1s" },
        { x: 108, y: 78, r: 1.4, d: "0.6s" },
        { x: 60, y: 100, r: 1, d: "1.9s" },
    ];

    return (
        <div className="proj-term proj-term-comet" aria-hidden="true">
            <div className="proj-term-bar">
                <span className="proj-term-dot proj-term-dot-r" />
                <span className="proj-term-dot proj-term-dot-y" />
                <span className="proj-term-dot proj-term-dot-g" />
                <span className="proj-term-title">comet.trace</span>
            </div>
            <div className="proj-term-body proj-term-body-center">
                <p className="proj-term-line proj-term-line-comment">// tracking incoming object</p>
                <div className="proj-comet-stage">
                    <svg viewBox="0 0 260 180" width="240" height="166" style={{ overflow: "visible", display: "block" }}>
                        <defs>
                            <radialGradient id={coreId} cx="45%" cy="42%" r="62%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="35%" stopColor="var(--color-accent-soft)" />
                                <stop offset="100%" stopColor="var(--color-accent2)" />
                            </radialGradient>
                            <linearGradient id={tailId} x1="1" y1="0" x2="0" y2="0">
                                <stop offset="0%" stopColor="var(--color-accent2)" stopOpacity="0.75" />
                                <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.28" />
                                <stop offset="100%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
                            </linearGradient>
                            <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* نجوم خلفية بتلمع */}
                        <g className="proj-comet-stars">
                            {stars.map((s, i) => (
                                <circle
                                    key={i}
                                    cx={s.x * 1.15}
                                    cy={s.y * 1.15}
                                    r={s.r}
                                    fill="var(--color-line)"
                                    className="proj-star"
                                    style={{ animationDelay: s.d }}
                                />
                            ))}
                        </g>

                        <g transform="translate(0,14)">
                            {/* طبقات الذيل — من الأعرض للأضيق */}
                            <path d="M176,70 L246,40 L176,58 Z" fill={`url(#${tailId})`} opacity="0.5" />
                            <path d="M176,72 L254,72 L176,75 Z" fill={`url(#${tailId})`} opacity="0.75" />
                            <path d="M176,74 L246,102 L176,86 Z" fill={`url(#${tailId})`} opacity="0.5" />

                            {/* جزيئات متطايرة من الذيل */}
                            <circle className="proj-comet-particle proj-comet-particle-1" cx="198" cy="63" r="1.8" fill="var(--color-accent2)" />
                            <circle className="proj-comet-particle proj-comet-particle-2" cx="212" cy="76" r="1.5" fill="var(--color-accent-soft)" />
                            <circle className="proj-comet-particle proj-comet-particle-3" cx="204" cy="88" r="1.6" fill="var(--color-accent2)" />

                            {/* رأس المذنّب — نواة بتفاصيل سطح واقعية */}
                            <g filter={`url(#${glowId})`}>
                                <circle cx="176" cy="72" r="17" fill={`url(#${coreId})`} />
                                <circle cx="171" cy="66" r="4.6" fill="#ffffff" opacity="0.55" />
                                <circle cx="184" cy="78" r="2.4" fill="#050510" opacity="0.14" />
                                <circle cx="169" cy="79" r="1.8" fill="#050510" opacity="0.12" />
                                <circle cx="180" cy="65" r="1.4" fill="#050510" opacity="0.1" />
                                <circle cx="176" cy="72" r="21" fill="none" stroke="var(--color-accent-soft)" strokeWidth="1" opacity="0.35" />
                            </g>
                        </g>
                    </svg>
                </div>
                <p className="proj-term-line proj-term-line-muted">trajectory locked · eta 00:14</p>
            </div>
        </div>
    );
}

export default memo(CometDecor);
