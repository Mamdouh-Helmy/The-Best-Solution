"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import "./about.css";
import { SATELLITES, MINI_PLANETS, JOURNEY_STAGES } from "./data";
import { roundCoord } from "./utils";

// قمر صناعي — تكستشر معدني (noise) على الجسم، ظل جانبي حقيقي، شبكة خلايا
// شمسية فعلية، لمعة زجاجية، ولمبة إشارة حمراء بتومض
function SpaceProbeSVG({ gradId, glowId, size = 70 }) {
    const bodyClipId = `${gradId}-bodyclip`;
    const noiseId = `${gradId}-noise`;
    const dishGradId = `${gradId}-dish`;
    const panelGradId = `${gradId}-panel`;

    const panelSegment = (x) => (
        <g>
            <rect x={x} y="14" width="14" height="18" rx="1.5" fill={`url(#${panelGradId})`} stroke={`url(#${gradId})`} strokeWidth="1" />
            {[0, 1, 2].map((row) => (
                <line key={`h${row}`} x1={x + 1} y1={17 + row * 5.5} x2={x + 13} y2={17 + row * 5.5} stroke="currentColor" strokeWidth="0.5" opacity="0.45" />
            ))}
            {[0, 1, 2, 3].map((col) => (
                <line key={`v${col}`} x1={x + 1 + col * 4} y1="15" x2={x + 1 + col * 4} y2="31" stroke="currentColor" strokeWidth="0.5" opacity="0.45" />
            ))}
            <rect x={x + 1} y="15" width="4" height="4.5" fill="#ffffff" opacity="0.18" />
        </g>
    );

    return (
        <svg viewBox="0 0 70 50" width={size} height={size} style={{ overflow: "visible", display: "block" }}>
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="70" y2="50" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="var(--color-accent2)" />
                    <stop offset="100%" stopColor="var(--color-accent-soft)" />
                </linearGradient>
                <linearGradient id={panelGradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent-soft)" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="var(--color-accent2)" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#050510" stopOpacity="0.35" />
                </linearGradient>
                <radialGradient id={dishGradId} cx="42%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#f4f7ff" stopOpacity="0.65" />
                    <stop offset="55%" stopColor="var(--color-accent2)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#050510" stopOpacity="0.4" />
                </radialGradient>
                <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="1.8" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <clipPath id={bodyClipId}>
                    <rect x="27" y="10" width="16" height="24" rx="5" />
                </clipPath>
                <filter id={noiseId} x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" result="noise" />
                    <feColorMatrix in="noise" type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3" intercept="0" />
                    </feComponentTransfer>
                </filter>
            </defs>

            <g filter={`url(#${glowId})`} color="var(--color-accent2)">
                <line x1="27" y1="18" x2="16" y2="18" stroke={`url(#${gradId})`} strokeWidth="1.4" />
                <line x1="43" y1="18" x2="54" y2="18" stroke={`url(#${gradId})`} strokeWidth="1.4" />

                {panelSegment(1)}
                {panelSegment(16)}
                {panelSegment(54)}
                {panelSegment(40)}

                <line x1="35" y1="10" x2="35" y2="2" stroke={`url(#${gradId})`} strokeWidth="1.3" />
                <ellipse cx="35" cy="2" rx="8" ry="2.6" fill={`url(#${dishGradId})`} stroke={`url(#${gradId})`} strokeWidth="1" />
                <ellipse cx="35" cy="1.4" rx="4.5" ry="1.2" fill="#050510" opacity="0.3" />
                <circle className="about-sat-beacon" cx="35" cy="2" r="1" fill="#ff5b5b" />

                <rect x="27" y="10" width="16" height="24" rx="5" fill={`url(#${gradId})`} />
                <rect x="27" y="10" width="16" height="24" fill="#000000" filter={`url(#${noiseId})`} clipPath={`url(#${bodyClipId})`} style={{ mixBlendMode: "multiply" }} />
                <path d="M37,10 L43,10 L43,34 L39,34 Z" fill="#050510" opacity="0.25" clipPath={`url(#${bodyClipId})`} />
                <path d="M28,11 L32,11 L28.5,33 L27,33 Z" fill="#ffffff" opacity="0.16" clipPath={`url(#${bodyClipId})`} />

                <circle cx="35" cy="20" r="4" fill="#050510" opacity="0.55" />
                <circle cx="35" cy="20" r="4" fill="none" stroke={`url(#${gradId})`} strokeWidth="1" />
                <circle cx="33.5" cy="18.5" r="1.1" fill="#f4f7ff" opacity="0.6" />

                <circle className="about-stage-dot" cx="35" cy="27" r="1.3" fill="#ffffff" />

                <path d="M31,34 L39,34 L37.5,38 L32.5,38 Z" fill={`url(#${gradId})`} opacity="0.85" />
                <path className="about-stage-flame" d="M32.5,38 Q35,48 37.5,38 Q35,43 32.5,38 Z" fill={`url(#${gradId})`} opacity="0.75" />
            </g>
        </svg>
    );
}

// كوكب صغير بعيد — تكستشر صخري، خط ظل، 5 كريترات، حافة إضاءة جوية
function AsteroidSVG({ gradId, glowId, size = 34, craterSide = "right" }) {
    const flip = craterSide === "right" ? 1 : -1;
    const rockClipId = `${gradId}-rockclip`;
    const craterGradId = `${gradId}-crater`;
    const noiseId = `${gradId}-noise`;
    const shadeGradId = `${gradId}-shade`;
    const rockPath = "M20,3 C26,2 32,5 35,11 C38,17 37,24 34,30 C31,36 24,39 17,37 C10,35 4,30 3,23 C2,16 5,9 11,5 C14,3 17,3.5 20,3 Z";

    const CRATERS = [
        { x: 6, y: -8, r: 5.2 },
        { x: -7, y: 4, r: 3.4 },
        { x: 2, y: 10, r: 2.6 },
        { x: -3, y: -3, r: 1.8 },
        { x: 9, y: 1, r: 1.4 },
        { x: -8, y: -6, r: 1.6 },
    ];

    return (
        <svg viewBox="0 0 40 42" width={size} height={size} style={{ overflow: "visible", display: "block" }}>
            <defs>
                <radialGradient id={gradId} cx="35%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="var(--color-accent-soft)" />
                    <stop offset="100%" stopColor="var(--color-accent2)" />
                </radialGradient>
                <radialGradient id={craterGradId} cx="38%" cy="32%" r="65%">
                    <stop offset="0%" stopColor="#050510" stopOpacity="0.6" />
                    <stop offset="70%" stopColor="#050510" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#050510" stopOpacity="0" />
                </radialGradient>
                <linearGradient id={shadeGradId} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="45%" stopColor="#050510" stopOpacity="0" />
                    <stop offset="100%" stopColor="#050510" stopOpacity="0.55" />
                </linearGradient>
                <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="1.6" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <clipPath id={rockClipId}>
                    <path d={rockPath} />
                </clipPath>
                <filter id={noiseId} x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="9" result="noise" />
                    <feColorMatrix in="noise" type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.32" intercept="0" />
                    </feComponentTransfer>
                </filter>
            </defs>
            <g filter={`url(#${glowId})`} transform={flip === -1 ? "scale(-1,1) translate(-40,0)" : undefined}>
                <ellipse cx="20" cy="34" rx="13" ry="3.4" fill="#050510" opacity="0.18" />
                <path d={rockPath} fill={`url(#${gradId})`} />

                <g clipPath={`url(#${rockClipId})`}>
                    <rect x="0" y="0" width="40" height="42" fill="#000000" filter={`url(#${noiseId})`} style={{ mixBlendMode: "multiply" }} />
                    <ellipse cx="13" cy="10" rx="6.5" ry="4.5" fill="#ffffff" opacity="0.28" />

                    {CRATERS.map((c, i) => (
                        <circle key={i} cx={20 + c.x} cy={20 + c.y} r={c.r} fill={`url(#${craterGradId})`} />
                    ))}
                    {CRATERS.slice(0, 3).map((c, i) => (
                        <circle key={`ring${i}`} cx={20 + c.x} cy={20 + c.y} r={c.r} fill="none" stroke="var(--color-accent2)" strokeWidth="0.5" opacity="0.28" />
                    ))}
                    <rect x="0" y="0" width="40" height="42" fill={`url(#${shadeGradId})`} />
                </g>

                <path d={rockPath} fill="none" stroke="var(--color-accent-soft)" strokeWidth="0.8" opacity="0.4" />
            </g>
        </svg>
    );
}

// شمس-سبارك النهار
function SunSparkSVG({ gradId, size = 130 }) {
    const rays = Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 360) / 12;
        const rad = (angle * Math.PI) / 180;
        const long = i % 2 === 0;
        const innerR = 40;
        const outerR = long ? 60 : 50;
        const x1 = roundCoord(65 + Math.cos(rad) * innerR);
        const y1 = roundCoord(65 + Math.sin(rad) * innerR);
        const x2 = roundCoord(65 + Math.cos(rad) * outerR);
        const y2 = roundCoord(65 + Math.sin(rad) * outerR);
        return { x1, y1, x2, y2, key: i, long };
    });
    return (
        <svg viewBox="0 0 130 130" width={size} height={size} style={{ overflow: "visible", display: "block" }}>
            <defs>
                <radialGradient id={gradId} cx="38%" cy="34%" r="68%">
                    <stop offset="0%" stopColor="var(--color-accent-soft)" />
                    <stop offset="100%" stopColor="var(--color-accent2)" />
                </radialGradient>
            </defs>
            <circle cx="65" cy="65" r="28" fill={`url(#${gradId})`} opacity="0.9" />
            <circle cx="56" cy="56" r="9" fill="#ffffff" opacity="0.22" />
            {rays.map((r) => (
                <line
                    key={r.key}
                    x1={r.x1}
                    y1={r.y1}
                    x2={r.x2}
                    y2={r.y2}
                    stroke={`url(#${gradId})`}
                    strokeWidth={r.long ? "3" : "2"}
                    strokeLinecap="round"
                    opacity={r.long ? "0.55" : "0.4"}
                />
            ))}
        </svg>
    );
}

// أيقونات "رحلة الشركة"
function StageIconPath({ type, gradId }) {
    switch (type) {
        case "idea":
            return (
                <g>
                    <path
                        d="M50,20 C61,20 68,29 68,40 C68,48 64,53 60,58 C58,60.5 57,63 57,66 L43,66 C43,63 42,60.5 40,58 C36,53 32,48 32,40 C32,29 39,20 50,20 Z"
                        fill="none"
                        stroke={`url(#${gradId})`}
                        strokeWidth="3.2"
                    />
                    <path
                        d="M43,36 L57,50 M57,36 L43,50"
                        stroke={`url(#${gradId})`}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        opacity="0.7"
                    />
                    <circle cx="50" cy="43" r="3.2" fill={`url(#${gradId})`} opacity="0.55" />
                    <path d="M43,66 L57,66" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" />
                    {[70, 74.5, 79].map((y, i) => (
                        <line key={i} x1={44 - i * 0.6} y1={y} x2={56 + i * 0.6} y2={y} stroke={`url(#${gradId})`} strokeWidth="2.4" strokeLinecap="round" />
                    ))}
                    <path d="M46,82 L54,82" stroke={`url(#${gradId})`} strokeWidth="2.6" strokeLinecap="round" />
                    {[
                        [50, 6, 50, 15],
                        [30, 12, 35.5, 19],
                        [70, 12, 64.5, 19],
                        [20, 30, 27.5, 33.5],
                        [80, 30, 72.5, 33.5],
                    ].map((p, i) => (
                        <line key={i} x1={p[0]} y1={p[1]} x2={p[2]} y2={p[3]} stroke={`url(#${gradId})`} strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
                    ))}
                </g>
            );
        case "build":
            return (
                <g>
                    <g opacity="0.85">
                        <circle cx="74" cy="30" r="10" fill="none" stroke={`url(#${gradId})`} strokeWidth="2.4" />
                        <circle cx="74" cy="30" r="3.2" fill={`url(#${gradId})`} opacity="0.8" />
                        {Array.from({ length: 6 }).map((_, i) => {
                            const angle = (i * 360) / 6;
                            const rad = (angle * Math.PI) / 180;
                            const r1 = 10;
                            const r2 = 14.5;
                            const half = 11;
                            const cx = roundCoord(74 + Math.cos(rad) * ((r1 + r2) / 2));
                            const cy = roundCoord(30 + Math.sin(rad) * ((r1 + r2) / 2));
                            return (
                                <rect
                                    key={i}
                                    x={cx - 2.4}
                                    y={cy - 2.4}
                                    width="4.8"
                                    height="4.8"
                                    fill={`url(#${gradId})`}
                                    opacity="0.75"
                                    transform={`rotate(${angle + half} ${cx} ${cy})`}
                                />
                            );
                        })}
                    </g>
                    <path
                        d={(() => {
                            const teeth = 10;
                            const rOuter = 30;
                            const rBase = 21;
                            const toothHalfDeg = 10;
                            let d = "";
                            for (let i = 0; i < teeth; i++) {
                                const centerDeg = (i * 360) / teeth;
                                const a0 = centerDeg - toothHalfDeg;
                                const a1 = centerDeg - toothHalfDeg * 0.45;
                                const a2 = centerDeg + toothHalfDeg * 0.45;
                                const a3 = centerDeg + toothHalfDeg;
                                const pt = (deg, radius) => {
                                    const rad = (deg * Math.PI) / 180;
                                    return [roundCoord(46 + Math.cos(rad) * radius), roundCoord(46 + Math.sin(rad) * radius)];
                                };
                                const [x0, y0] = pt(a0, rBase);
                                const [x1, y1] = pt(a1, rOuter);
                                const [x2, y2] = pt(a2, rOuter);
                                const [x3, y3] = pt(a3, rBase);
                                d += `${i === 0 ? "M" : "L"}${x0},${y0} L${x1},${y1} L${x2},${y2} L${x3},${y3} `;
                            }
                            return d + "Z";
                        })()}
                        fill="none"
                        stroke={`url(#${gradId})`}
                        strokeWidth="2.6"
                        strokeLinejoin="round"
                    />
                    <circle cx="46" cy="46" r="17" fill="none" stroke={`url(#${gradId})`} strokeWidth="2.2" opacity="0.5" />
                    <circle cx="46" cy="46" r="6" fill={`url(#${gradId})`} opacity="0.85" />
                </g>
            );
        case "launch":
            return (
                <g>
                    <path d="M50,12 C64,25 63,50 57,66 L43,66 C37,50 36,25 50,12 Z" fill="none" stroke={`url(#${gradId})`} strokeWidth="3" />
                    <path d="M50,14 C58,24 59,38 57,50 L43,50 C41,38 42,24 50,14 Z" fill={`url(#${gradId})`} opacity="0.12" />
                    <circle cx="50" cy="33" r="7" fill="none" stroke={`url(#${gradId})`} strokeWidth="2.4" />
                    <circle cx="50" cy="33" r="7" fill={`url(#${gradId})`} opacity="0.18" />
                    <ellipse cx="47.5" cy="30.5" rx="2.4" ry="1.6" fill="#ffffff" opacity="0.55" transform="rotate(-30 47.5 30.5)" />
                    <path d="M43,50 L28,63 L42,60 Z" fill={`url(#${gradId})`} opacity="0.85" />
                    <path d="M57,50 L72,63 L58,60 Z" fill={`url(#${gradId})`} opacity="0.85" />
                    <line x1="44" y1="58" x2="44" y2="66" stroke={`url(#${gradId})`} strokeWidth="1.6" opacity="0.5" />
                    <line x1="56" y1="58" x2="56" y2="66" stroke={`url(#${gradId})`} strokeWidth="1.6" opacity="0.5" />
                    <path className="about-stage-flame" d="M44,66 Q50,80 56,66 Q50,74 44,66 Z" fill={`url(#${gradId})`} opacity="0.4" />
                    <path className="about-stage-flame" d="M46.5,66 Q50,76 53.5,66 Q50,71.5 46.5,66 Z" fill={`url(#${gradId})`} opacity="0.85" />
                </g>
            );
        case "clients":
            return (
                <g>
                    <path
                        d="M14,18 h50 a7,7 0 0 1 7,7 v20 a7,7 0 0 1 -7,7 h-32 l-10,9 v-9 h-8 a7,7 0 0 1 -7,-7 v-20 a7,7 0 0 1 7,-7 Z"
                        fill="var(--color-panel)"
                        fillOpacity="0.5"
                        stroke={`url(#${gradId})`}
                        strokeWidth="2.6"
                    />
                    {[24, 34, 44].map((cx, i) => (
                        <circle
                            key={i}
                            className="about-stage-dot"
                            style={{ animationDelay: `${i * 0.2}s` }}
                            cx={cx}
                            cy="34"
                            r={i === 1 ? "3" : "2.4"}
                            fill={`url(#${gradId})`}
                        />
                    ))}
                    <path
                        d="M52,44 h30 a6,6 0 0 1 6,6 v14 a6,6 0 0 1 -6,6 h-18 l-8,7 v-7 h-4 a6,6 0 0 1 -6,-6 v-14 a6,6 0 0 1 6,-6 Z"
                        fill={`url(#${gradId})`}
                        opacity="0.9"
                    />
                    <path d="M62,55 l4,4 l8,-8" stroke="var(--color-bg)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
                </g>
            );
        default:
            return null;
    }
}

function StageChipSVG({ gradId, type, label, width = 78, height = 78 }) {
    return (
        <svg viewBox="0 0 100 100" width={width} height={height} style={{ overflow: "visible", display: "block" }}>
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="var(--color-accent-soft)" />
                    <stop offset="100%" stopColor="var(--color-accent2)" />
                </linearGradient>
            </defs>
            <rect x="4" y="4" width="92" height="92" rx="22" fill="var(--color-panel)" fillOpacity="0.6" stroke={`url(#${gradId})`} strokeWidth="2" />
            <StageIconPath type={type} gradId={gradId} />
            {label ? (
                <text x="50" y="93" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700" fill={`url(#${gradId})`} opacity="0.85">
                    {label}
                </text>
            ) : null}
        </svg>
    );
}

export default function AboutSky() {
    const { isDark } = useTheme();
    const { t } = useLanguage();
    const sceneRef = useRef(null);
    const [active, setActive] = useState(false);
    const rawId = useId();
    const uid = rawId.replace(/:/g, "");

    useEffect(() => {
        const el = sceneRef.current;
        if (!el) return;
        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
            setActive(true);
            return;
        }
        const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.1 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div ref={sceneRef} className={`about-sky ${active ? "is-active" : ""}`} aria-hidden="true">
            {isDark ? (
                <>
                    {SATELLITES.map((s, i) => (
                        <div
                            key={i}
                            className="about-satellite"
                            style={{ top: `${s.top}%`, left: "6%", "--dy": `${s.driftY}px`, animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }}
                        >
                            <SpaceProbeSVG  gradId={`about-sat-grad-${uid}-${i}`} glowId={`about-sat-glow-${uid}-${i}`} size={s.size} />
                        </div>
                    ))}

                    {MINI_PLANETS.map((p, i) => (
                        <div
                            key={i}
                            className="about-mini-planet"
                            style={{ top: `${p.top}%`, left: `${p.left}%`, animationDuration: `${p.floatDuration}s`, animationDelay: `${p.delay}s` }}
                        >
                            <AsteroidSVG  gradId={`about-mp-grad-${uid}-${i}`} glowId={`about-mp-glow-${uid}-${i}`} size={p.size} craterSide={p.craterSide} />
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <div className="about-sun" style={{ top: "6%", insetInlineEnd: "9%" }}>
                        <SunSparkSVG gradId={`about-sun-grad-${uid}`} size={128} />
                    </div>

                    {JOURNEY_STAGES.map((c, i) => (
                        <div
                            key={i}
                            className="about-chip"
                            style={{ top: `${c.top}%`, left: `${c.left}%`, "--rot": `${c.rotate}deg`, animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s` }}
                        >
                            <StageChipSVG gradId={`about-stage-grad-${uid}-${i}`} type={c.type} label={t(c.labelKey)} width={c.w} height={c.h} />
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}