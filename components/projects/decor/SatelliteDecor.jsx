import { memo } from "react";

// =====================================================================
// ===== بانل "satellite.log" — قمر صناعي بألواح شمسية وطبق إرسال =====
// =====================================================================
function SatelliteDecor({ uid }) {
    const bodyId = `proj-sat-body-${uid}`;
    const panelId = `proj-sat-panel-${uid}`;
    const glowId = `proj-sat-glow-${uid}`;
    const dishId = `proj-sat-dish-${uid}`;

    return (
        <div className="proj-term proj-term-satellite" aria-hidden="true">
            <div className="proj-term-bar">
                <span className="proj-term-dot proj-term-dot-r" />
                <span className="proj-term-dot proj-term-dot-y" />
                <span className="proj-term-dot proj-term-dot-g" />
                <span className="proj-term-title">satellite.log</span>
            </div>
            <div className="proj-term-body proj-term-body-center">
                <p className="proj-term-line proj-term-line-comment">// syncing with orbit relay</p>
                <div className="proj-sat-stage">
                    <svg viewBox="0 0 280 230" width="240" height="197" style={{ overflow: "visible", display: "block" }}>
                        <defs>
                            <linearGradient id={bodyId} x1="0" y1="0" x2="280" y2="230" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="var(--color-accent-soft)" />
                                <stop offset="50%" stopColor="var(--color-accent)" />
                                <stop offset="100%" stopColor="var(--color-accent2)" />
                            </linearGradient>
                            <linearGradient id={panelId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-accent-soft)" stopOpacity="0.92" />
                                <stop offset="55%" stopColor="var(--color-accent)" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="var(--color-accent2)" stopOpacity="0.78" />
                            </linearGradient>
                            <radialGradient id={dishId} cx="35%" cy="30%" r="80%">
                                <stop offset="0%" stopColor="var(--color-accent-soft)" />
                                <stop offset="100%" stopColor="var(--color-accent2)" />
                            </radialGradient>
                            <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* خطوط مدار خلفية */}
                        <ellipse cx="140" cy="115" rx="130" ry="52" fill="none" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="3 8" opacity="0.4" />

                        <g transform="rotate(-18 140 115)">
                            {/* اللوح الشمسي الشمال — شبكة خلايا بلمعة انعكاس */}
                            <g>
                                <rect x="18" y="86" width="70" height="58" rx="4" fill={`url(#${panelId})`} stroke="var(--color-line)" strokeWidth="1" />
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <line key={`vL${i}`} x1={18 + (i + 1) * (70 / 6)} y1="86" x2={18 + (i + 1) * (70 / 6)} y2="144" stroke="#050510" strokeOpacity="0.25" strokeWidth="1" />
                                ))}
                                <line x1="18" y1="115" x2="88" y2="115" stroke="#050510" strokeOpacity="0.25" strokeWidth="1" />
                                <ellipse cx="40" cy="98" rx="18" ry="6" fill="#ffffff" opacity="0.14" />
                                <line x1="10" y1="115" x2="18" y2="115" stroke={`url(#${bodyId})`} strokeWidth="3.4" />
                            </g>

                            {/* اللوح الشمسي اليمين — نفس الشبكة */}
                            <g>
                                <rect x="192" y="86" width="70" height="58" rx="4" fill={`url(#${panelId})`} stroke="var(--color-line)" strokeWidth="1" />
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <line key={`vR${i}`} x1={192 + (i + 1) * (70 / 6)} y1="86" x2={192 + (i + 1) * (70 / 6)} y2="144" stroke="#050510" strokeOpacity="0.25" strokeWidth="1" />
                                ))}
                                <line x1="192" y1="115" x2="262" y2="115" stroke="#050510" strokeOpacity="0.25" strokeWidth="1" />
                                <ellipse cx="240" cy="98" rx="18" ry="6" fill="#ffffff" opacity="0.14" />
                                <line x1="262" y1="115" x2="270" y2="115" stroke={`url(#${bodyId})`} strokeWidth="3.4" />
                            </g>

                            {/* جسم القمر الصناعي — تفاصيل أكتر */}
                            <g filter={`url(#${glowId})`}>
                                <rect x="102" y="94" width="76" height="46" rx="7" fill={`url(#${bodyId})`} />
                                <rect x="102" y="94" width="76" height="16" rx="5" fill="#050510" opacity="0.18" />
                                <rect x="111" y="116" width="12" height="12" rx="2" fill="var(--color-bg)" opacity="0.7" />
                                <rect x="127" y="116" width="12" height="12" rx="2" fill="var(--color-bg)" opacity="0.5" />
                                <rect x="143" y="116" width="12" height="12" rx="2" fill="var(--color-bg)" opacity="0.35" />
                                <circle className="proj-sat-blink" cx="164" cy="122" r="3" fill="#fff" />
                                <circle className="proj-sat-blink proj-sat-blink-2" cx="112" cy="103" r="2" fill="var(--color-accent2)" />

                                {/* طبق الإرسال — شبكة مقعّرة واقعية */}
                                <path d="M140,94 L140,66" stroke={`url(#${bodyId})`} strokeWidth="3.4" />
                                <path d="M114,66 Q140,44 166,66 Q140,80 114,66 Z" fill={`url(#${dishId})`} opacity="0.92" />
                                <ellipse cx="140" cy="66" rx="24" ry="7" fill="none" stroke="#050510" strokeOpacity="0.2" strokeWidth="1.6" />
                                <ellipse cx="140" cy="66" rx="14" ry="4" fill="none" stroke="#050510" strokeOpacity="0.15" strokeWidth="1" />

                                {/* هوائي صغير */}
                                <line x1="178" y1="98" x2="198" y2="80" stroke={`url(#${bodyId})`} strokeWidth="2.2" />
                                <circle cx="198" cy="80" r="2.8" fill="var(--color-accent2)" />
                            </g>

                            {/* موجات إشارة متتالية من الطبق */}
                            <g className="proj-sat-signal">
                                <path d="M140,40 a30,30 0 0 1 30,30" fill="none" stroke="var(--color-accent2)" strokeWidth="1.8" opacity="0.7" />
                                <path d="M140,26 a44,44 0 0 1 44,44" fill="none" stroke="var(--color-accent2)" strokeWidth="1.5" opacity="0.45" />
                                <path d="M140,12 a58,58 0 0 1 58,58" fill="none" stroke="var(--color-accent2)" strokeWidth="1.2" opacity="0.25" />
                            </g>
                        </g>
                    </svg>
                </div>
                <p className="proj-term-line proj-term-line-muted">status: connection stable ✓</p>
            </div>
        </div>
    );
}

export default memo(SatelliteDecor);
