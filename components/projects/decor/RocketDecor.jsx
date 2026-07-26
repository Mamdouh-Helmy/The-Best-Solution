import { memo } from "react";

// =====================================================================
// ===== بانل "$ deploy" — صاروخ بتفاصيل + شعلة وجزيئات دخان =====
// =====================================================================
function RocketDecor({ uid }) {
    const gradId = `proj-rocket-grad-${uid}`;
    const glowId = `proj-rocket-glow-${uid}`;
    const shadeId = `proj-rocket-shade-${uid}`;
    const windowId = `proj-rocket-window-${uid}`;

    return (
        <div className="proj-term proj-term-rocket" aria-hidden="true">
            <div className="proj-term-bar">
                <span className="proj-term-dot proj-term-dot-r" />
                <span className="proj-term-dot proj-term-dot-y" />
                <span className="proj-term-dot proj-term-dot-g" />
                <span className="proj-term-title">deploy.sh</span>
            </div>
            <div className="proj-term-body">
                <p className="proj-term-line">
                    <span className="proj-term-prompt">$</span> deploy --project<span className="proj-term-cursor" />
                </p>
                <div className="proj-rocket-stage">
                    <svg viewBox="0 0 180 320" width="172" height="306" style={{ overflow: "visible", display: "block" }}>
                        <defs>
                            <linearGradient id={gradId} x1="0" y1="0" x2="180" y2="300" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="var(--color-accent-soft)" />
                                <stop offset="50%" stopColor="var(--color-accent)" />
                                <stop offset="100%" stopColor="var(--color-accent2)" />
                            </linearGradient>
                            <linearGradient id={shadeId} x1="60" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#050510" stopOpacity="0.32" />
                                <stop offset="45%" stopColor="#050510" stopOpacity="0" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.16" />
                            </linearGradient>
                            <radialGradient id={windowId} cx="35%" cy="30%" r="75%">
                                <stop offset="0%" stopColor="#eaf6ff" />
                                <stop offset="45%" stopColor="var(--color-accent-soft)" />
                                <stop offset="100%" stopColor="#0b1230" />
                            </radialGradient>
                            <filter id={glowId} x="-70%" y="-70%" width="240%" height="240%">
                                <feGaussianBlur stdDeviation="4.5" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* هالة ضباب خفيفة حوالين الصاروخ كله — إحساس غلاف جوي */}
                        <ellipse cx="90" cy="150" rx="72" ry="140" fill="var(--color-accent)" opacity="0.05" filter={`url(#${glowId})`} />

                        {/* بيكون أعلى الصاروخ + هوائي */}
                        <line x1="90" y1="14" x2="90" y2="-10" stroke={`url(#${gradId})`} strokeWidth="2.5" />
                        <circle className="proj-rocket-beacon" cx="90" cy="-13" r="3.6" fill="var(--color-accent2)" />

                        <g filter={`url(#${glowId})`}>
                            {/* جسم الصاروخ الرئيسي — مقرنص وطويل بتفاصيل معدنية حقيقية */}
                            <path d="M90,14 C122,50 120,120 108,196 L72,196 C60,120 58,50 90,14 Z" fill={`url(#${gradId})`} />
                            <path d="M90,16 C104,46 106,110 100,180 L90,180 L90,14 Z" fill="#050510" opacity="0.2" />
                            <path d="M78,20 C68,52 65,108 68,168 L76,168 C73,108 74,52 82,18 Z" fill="#ffffff" opacity="0.14" />
                            <path d="M90,14 C122,50 120,120 108,196 L72,196 C60,120 58,50 90,14 Z" fill={`url(#${shadeId})`} />

                            {/* خطوط اللحام/الألواح المعدنية + برشامات */}
                            <path d="M66,90 L114,90" stroke="#050510" strokeOpacity="0.16" strokeWidth="2" />
                            <path d="M63,120 L117,120" stroke="#050510" strokeOpacity="0.16" strokeWidth="2" />
                            <path d="M61,150 L119,150" stroke="#050510" strokeOpacity="0.16" strokeWidth="2" />
                            {[70, 80, 90, 100, 110].map((rx, i) => (
                                <circle key={i} cx={rx} cy="120" r="1" fill="#050510" opacity="0.22" />
                            ))}

                            {/* نافذة الكبسولة — زجاج بانعكاس وعمق حقيقي */}
                            <circle cx="90" cy="70" r="19" fill="var(--color-bg)" opacity="0.9" />
                            <circle cx="90" cy="70" r="19" fill="none" stroke={`url(#${gradId})`} strokeWidth="3.4" />
                            <circle cx="90" cy="70" r="14.5" fill={`url(#${windowId})`} />
                            <ellipse cx="83" cy="63" rx="6" ry="3.6" fill="#ffffff" opacity="0.65" transform="rotate(-30 83 63)" />
                            <path d="M90,58 L90,82 M79,70 L101,70" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.4" />

                            {/* طوق تفاصيل معدني حوالين قاعدة الجسم */}
                            <rect x="58" y="216" width="64" height="14" rx="3" fill={`url(#${gradId})`} />
                            <rect x="58" y="216" width="64" height="14" rx="3" fill="none" stroke="#050510" strokeOpacity="0.18" strokeWidth="1" />
                            <line x1="58" y1="223" x2="122" y2="223" stroke="#050510" strokeOpacity="0.2" strokeWidth="1" />
                            {Array.from({ length: 6 }).map((_, i) => (
                                <rect
                                    key={i}
                                    x={62 + i * 10}
                                    y="218.5"
                                    width="4"
                                    height="9"
                                    rx="1"
                                    fill="#ffffff"
                                    opacity={i % 2 === 0 ? 0.22 : 0.1}
                                />
                            ))}

                            {/* البوسترز الجانبية */}
                            <path d="M68,160 L34,214 L66,200 Z" fill={`url(#${gradId})`} opacity="0.92" />
                            <path d="M112,160 L146,214 L114,200 Z" fill={`url(#${gradId})`} opacity="0.92" />
                            <path d="M68,160 L34,214 L52,206 Z" fill="#050510" opacity="0.16" />
                            <line x1="42" y1="180" x2="60" y2="172" stroke="#050510" strokeOpacity="0.2" strokeWidth="1.4" />
                            <line x1="126" y1="180" x2="108" y2="172" stroke="#050510" strokeOpacity="0.2" strokeWidth="1.4" />

                            {/* أرجل الهبوط + شعلات جانبية */}
                            <rect x="40" y="196" width="11" height="34" rx="3.5" fill={`url(#${gradId})`} opacity="0.88" />
                            <rect x="129" y="196" width="11" height="34" rx="3.5" fill={`url(#${gradId})`} opacity="0.88" />
                            <path className="proj-flame proj-flame-side" d="M42,230 Q45.5,250 49,230 Z" fill="var(--color-accent2)" opacity="0.8" />
                            <path className="proj-flame proj-flame-side" d="M131,230 Q134.5,250 138,230 Z" fill="var(--color-accent2)" opacity="0.8" />

                            {/* مؤخرة المحرك */}
                            <path d="M72,196 L108,196 L100,222 L80,222 Z" fill={`url(#${gradId})`} />
                            <ellipse cx="90" cy="222" rx="12" ry="4" fill="#050510" opacity="0.35" />

                            {/* اللهب الرئيسي — ثلاث طبقات متوهجة */}
                            <path className="proj-flame proj-flame-outer" d="M76,224 Q90,272 104,224 Q90,254 76,224 Z" fill={`url(#${gradId})`} opacity="0.38" />
                            <path className="proj-flame proj-flame-inner" d="M80,224 Q90,258 100,224 Q90,246 80,224 Z" fill="#fff" opacity="0.55" />
                            <path className="proj-flame proj-flame-core" d="M84,224 Q90,244 96,224 Q90,236 84,224 Z" fill="var(--color-accent-soft)" opacity="0.85" />
                        </g>
                    </svg>

                    <span className="proj-smoke proj-smoke-1" />
                    <span className="proj-smoke proj-smoke-2" />
                    <span className="proj-smoke proj-smoke-3" />
                    <span className="proj-smoke proj-smoke-4" />
                </div>
                <p className="proj-term-line proj-term-line-muted">Launching new deployment…</p>
            </div>
        </div>
    );
}

export default memo(RocketDecor);
