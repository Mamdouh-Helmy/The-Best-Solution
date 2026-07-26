import { memo } from "react";

// =====================================================================
// ===== بانل "// exploring" — كوكب بقمر مداري وحزام كويكبات =====
// =====================================================================
function PlanetDecor({ uid }) {
    const sphereId = `proj-planet-sphere-${uid}`;
    const bandId = `proj-planet-band-${uid}`;
    const ringId = `proj-planet-ring-${uid}`;
    const clipId = `proj-planet-clip-${uid}`;
    const ringClipId = `proj-planet-ringclip-${uid}`;
    const shadeId = `proj-planet-shade-${uid}`;
    const specId = `proj-planet-spec-${uid}`;
    const rimId = `proj-planet-rim-${uid}`;
    const glowId = `proj-planet-glow-${uid}`;

    return (
        <div className="proj-term proj-term-planet" aria-hidden="true">
            <div className="proj-term-bar">
                <span className="proj-term-dot proj-term-dot-r" />
                <span className="proj-term-dot proj-term-dot-y" />
                <span className="proj-term-dot proj-term-dot-g" />
                <span className="proj-term-title">architecture.md</span>
            </div>
            <div className="proj-term-body proj-term-body-center">
                <p className="proj-term-line proj-term-line-comment">// exploring the next idea</p>
                <div className="proj-planet-stage">
                    <svg viewBox="0 0 300 300" width="256" height="256" style={{ overflow: "visible", display: "block" }}>
                        <defs>
                            <radialGradient id={sphereId} cx="34%" cy="26%" r="80%">
                                <stop offset="0%" stopColor="var(--color-accent-soft)" />
                                <stop offset="52%" stopColor="var(--color-accent)" />
                                <stop offset="100%" stopColor="var(--color-accent2)" />
                            </radialGradient>
                            <radialGradient id={shadeId} cx="30%" cy="24%" r="92%">
                                <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                                <stop offset="48%" stopColor="#000000" stopOpacity="0" />
                                <stop offset="100%" stopColor="#000000" stopOpacity="0.58" />
                            </radialGradient>
                            <radialGradient id={specId} cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                            </radialGradient>
                            <linearGradient id={rimId} x1="0" y1="300" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
                                <stop offset="55%" stopColor="var(--color-accent-soft)" stopOpacity="0.85" />
                                <stop offset="100%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id={bandId} x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="var(--color-panel2)" stopOpacity="0" />
                                <stop offset="50%" stopColor="var(--color-panel2)" stopOpacity="0.55" />
                                <stop offset="100%" stopColor="var(--color-panel2)" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id={ringId} x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="var(--color-accent-soft)" />
                                <stop offset="50%" stopColor="var(--color-accent2)" />
                                <stop offset="100%" stopColor="var(--color-accent-soft)" />
                            </linearGradient>
                            <clipPath id={clipId}>
                                <circle cx="150" cy="150" r="74" />
                            </clipPath>
                            <clipPath id={ringClipId}>
                                <rect x="0" y="150" width="300" height="150" />
                            </clipPath>
                            <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
                                <feGaussianBlur stdDeviation="10" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* هالة الغلاف الجوي — توهج ناعم حوالين الكوكب */}
                        <circle cx="150" cy="150" r="88" fill="var(--color-accent)" opacity="0.16" filter={`url(#${glowId})`} />

                        {/* حزام كويكبات خلفي أكتف وأكتر تفصيلًا */}
                        <g className="proj-asteroid-belt">
                            {Array.from({ length: 14 }).map((_, i) => {
                                const angle = (i / 14) * Math.PI * 2;
                                const rx = 138 * Math.cos(angle);
                                const ry = 44 * Math.sin(angle);
                                return (
                                    <circle
                                        key={i}
                                        cx={150 + rx}
                                        cy={150 + ry}
                                        r={i % 3 === 0 ? 2.6 : 1.5}
                                        fill="var(--color-accent2)"
                                        opacity="0.5"
                                        transform="rotate(-14 150 150)"
                                    />
                                );
                            })}
                        </g>

                        <g transform="rotate(-14 150 150)">
                            {/* الحلقة — الجزء الخلفي، طبقات متعددة زي الأصل */}
                            <ellipse cx="150" cy="150" rx="142" ry="46" fill="none" stroke={`url(#${ringId})`} strokeWidth="5" opacity="0.35" />
                            <ellipse cx="150" cy="150" rx="135" ry="43" fill="none" stroke="var(--color-bg)" strokeWidth="1.6" opacity="0.5" />
                            <ellipse cx="150" cy="150" rx="128" ry="40" fill="none" stroke={`url(#${ringId})`} strokeWidth="9" opacity="0.9" />
                            <ellipse cx="150" cy="150" rx="112" ry="33" fill="none" stroke="var(--color-bg)" strokeWidth="1" opacity="0.4" />
                            <ellipse cx="150" cy="150" rx="103" ry="28" fill="none" stroke={`url(#${ringId})`} strokeWidth="6" opacity="0.6" />

                            {/* الكوكب — واضح وواقع في نص الحلقة بفراغ حقيقي حواليه */}
                            <circle cx="150" cy="150" r="74" fill={`url(#${sphereId})`} />

                            {/* شرائط الغلاف الجوي + بقعة عاصفة (إحساس عملاق غازي حقيقي) */}
                            <g className="proj-planet-bands" clipPath={`url(#${clipId})`}>
                                <ellipse cx="150" cy="122" rx="74" ry="8" fill={`url(#${bandId})`} opacity="0.5" />
                                <ellipse cx="150" cy="146" rx="74" ry="11" fill={`url(#${bandId})`} opacity="0.35" />
                                <ellipse cx="150" cy="170" rx="74" ry="7" fill={`url(#${bandId})`} opacity="0.45" />
                                <ellipse cx="150" cy="190" rx="74" ry="5" fill={`url(#${bandId})`} opacity="0.3" />
                                <ellipse cx="126" cy="168" rx="17" ry="9" fill="var(--color-accent2)" opacity="0.4" />
                            </g>

                            {/* تظليل الكرة — ثابت، بيدّي إحساس الكروية والعمق الحقيقي */}
                            <circle cx="150" cy="150" r="74" fill={`url(#${shadeId})`} />

                            {/* بريق ضوء ثابت الموقع */}
                            <ellipse cx="122" cy="118" rx="22" ry="15" fill={`url(#${specId})`} />

                            {/* خط ضوء رفيع على حافة الكوكب */}
                            <circle cx="150" cy="150" r="72.5" fill="none" stroke={`url(#${rimId})`} strokeWidth="2" opacity="0.55" />

                            {/* الحلقة — الجزء الأمامي، مقصوص على نص السفلي بس */}
                            <g clipPath={`url(#${ringClipId})`}>
                                <ellipse cx="150" cy="150" rx="142" ry="46" fill="none" stroke={`url(#${ringId})`} strokeWidth="5" opacity="0.4" />
                                <ellipse cx="150" cy="150" rx="135" ry="43" fill="none" stroke="var(--color-bg)" strokeWidth="1.6" opacity="0.55" />
                                <ellipse cx="150" cy="150" rx="128" ry="40" fill="none" stroke={`url(#${ringId})`} strokeWidth="9" opacity="0.95" />
                                <ellipse cx="150" cy="150" rx="112" ry="33" fill="none" stroke="var(--color-bg)" strokeWidth="1" opacity="0.45" />
                                <ellipse cx="150" cy="150" rx="103" ry="28" fill="none" stroke={`url(#${ringId})`} strokeWidth="6" opacity="0.65" />
                            </g>
                        </g>

                        {/* قمر مداري بتفاصيل فوهات صغيرة */}
                        <g className="proj-moon-orbit">
                            <circle cx="150" cy="150" r="128" fill="none" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="2 7" opacity="0.5" />
                            <circle className="proj-moon" cx="278" cy="150" r="10" fill="var(--color-accent-soft)" />
                            <circle cx="278" cy="150" r="10" fill="none" stroke="var(--color-accent2)" strokeWidth="1" opacity="0.6" />
                            <circle cx="275" cy="147" r="2" fill="#050510" opacity="0.18" />
                            <circle cx="281.5" cy="153" r="1.3" fill="#050510" opacity="0.15" />
                            <circle cx="280" cy="146" r="0.9" fill="#050510" opacity="0.12" />
                        </g>
                    </svg>
                </div>
                <p className="proj-term-line proj-term-line-muted">idea.status = "in progress"</p>
            </div>
        </div>
    );
}

export default memo(PlanetDecor);
