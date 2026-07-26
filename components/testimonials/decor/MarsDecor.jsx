import PlanetDepthLayers from "../PlanetDepthLayers";
import { TILT_DEG } from "../data";

// =====================================================================
// ===== ديكور 6: كوكب المريخ =====
// =====================================================================
export default function MarsDecor({ uid, index }) {
    const bodyId = `test-mars-body-${uid}-${index}`;
    const clipId = `test-mars-clip-${uid}-${index}`;
    const shadeId = `test-mars-shade-${uid}-${index}`;
    const rimId = `test-mars-rim-${uid}-${index}`;
    const volcanoId = `test-mars-volcano-${uid}-${index}`;
    const craterId = `test-mars-crater-${uid}-${index}`;
    const dustId = `test-mars-dust-${uid}-${index}`;
    const glowId = `test-mars-glow-${uid}-${index}`;
    const atmoId = `test-mars-atmo-${uid}-${index}`;

    const craters = [
        { cx: 148, cy: 128, r: 15 }, { cx: 208, cy: 100, r: 9 },
        { cx: 244, cy: 156, r: 12 }, { cx: 164, cy: 190, r: 10 },
        { cx: 122, cy: 178, r: 7 }, { cx: 230, cy: 204, r: 6 },
        { cx: 190, cy: 148, r: 5 }, { cx: 134, cy: 148, r: 4.2 },
        { cx: 212, cy: 182, r: 4.5 }, { cx: 244, cy: 124, r: 3.6 },
    ];
    const canyons = [
        "M100,152 C126,160 144,158 162,168 C180,178 196,176 214,184 C232,190 240,196 254,202",
        "M136,168 C146,180 150,190 144,200",
        "M204,180 C212,190 212,200 204,208",
    ];

    return (
        <div className="test-decor relative flex items-center justify-center [perspective:1100px]">
            <svg className="block max-w-[min(72vw,420px)] h-auto" viewBox="0 0 350 350" width="290" height="290" style={{ overflow: "visible" }}>
                <defs>
                    <radialGradient id={bodyId} cx="34%" cy="28%" r="80%">
                        <stop offset="0%" stopColor="#f4b48c" />
                        <stop offset="40%" stopColor="#c96a3f" />
                        <stop offset="75%" stopColor="#9a4326" />
                        <stop offset="100%" stopColor="#5f2415" />
                    </radialGradient>
                    <radialGradient id={shadeId} cx="30%" cy="26%" r="92%">
                        <stop offset="0%" stopColor="#1a0803" stopOpacity="0" />
                        <stop offset="46%" stopColor="#1a0803" stopOpacity="0" />
                        <stop offset="80%" stopColor="#1a0803" stopOpacity="0.36" />
                        <stop offset="100%" stopColor="#1a0803" stopOpacity="0.8" />
                    </radialGradient>
                    <linearGradient id={rimId} x1="0" y1="350" x2="350" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#e0805a" stopOpacity="0" />
                        <stop offset="55%" stopColor="#e0805a" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#e0805a" stopOpacity="0" />
                    </linearGradient>
                    <radialGradient id={volcanoId} cx="50%" cy="42%" r="60%">
                        <stop offset="0%" stopColor="#7a3018" />
                        <stop offset="55%" stopColor="#5c2210" />
                        <stop offset="85%" stopColor="#3d150a" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#3d150a" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id={craterId} cx="38%" cy="34%" r="70%">
                        <stop offset="0%" stopColor="#2b0e06" stopOpacity="0.55" />
                        <stop offset="70%" stopColor="#2b0e06" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#2b0e06" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id={atmoId} cx="50%" cy="50%" r="52%">
                        <stop offset="80%" stopColor="#ffb98c" stopOpacity="0" />
                        <stop offset="95%" stopColor="#ffb98c" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#ffb98c" stopOpacity="0" />
                    </radialGradient>
                    <clipPath id={clipId}>
                        <circle cx="175" cy="175" r="90" />
                    </clipPath>
                    <filter id={glowId} x="-90%" y="-90%" width="280%" height="280%">
                        <feGaussianBlur stdDeviation="9" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id={dustId} x="-30%" y="-30%" width="160%" height="160%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="5" result="dn">
                            <animate attributeName="seed" values="5;18;5" dur="14s" repeatCount="indefinite" />
                        </feTurbulence>
                        <feColorMatrix in="dn" type="matrix" values="
                            0 0 0 0 0.85
                            0 0 0 0 0.5
                            0 0 0 0 0.28
                            0 0 0 0.35 0" />
                    </filter>
                </defs>

                <circle cx="175" cy="175" r="128" fill="#e0805a" opacity="0.16" filter={`url(#${glowId})`} />

                <g transform={`rotate(${TILT_DEG - 2} 175 175)`}>
                    <circle cx="175" cy="175" r="90" fill={`url(#${bodyId})`} filter={`url(#${glowId})`} />

                    <g clipPath={`url(#${clipId})`}>
                        <g className="test-mars-rotate">
                            <circle cx="150" cy="160" r="36" fill={`url(#${volcanoId})`} opacity="0.55" />
                            <circle cx="150" cy="160" r="8" fill="#2a0d05" opacity="0.6" />
                            <circle cx="150" cy="160" r="8" fill="none" stroke="#ff9c6b" strokeWidth="1" opacity="0.4" />

                            {craters.map((c, i) => (
                                <g key={i}>
                                    <circle cx={c.cx} cy={c.cy} r={c.r * 1.2} fill={`url(#${craterId})`} />
                                    <circle cx={c.cx + c.r * 0.34} cy={c.cy + c.r * 0.3} r={c.r * 0.3} fill="#ffb389" opacity="0.4" />
                                </g>
                            ))}

                            {canyons.map((d, i) => (
                                <g key={i}>
                                    <path d={d} fill="none" stroke="#3c160b" strokeWidth={i === 0 ? 5.5 : 3} strokeLinecap="round" opacity="0.55" />
                                    <path d={d} fill="none" stroke="#ff9c6b" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" transform="translate(0,-1.6)" />
                                </g>
                            ))}
                        </g>

                        <ellipse cx="175" cy="100" rx="36" ry="12" fill="#fbe9dc" opacity="0.92" />
                        <ellipse cx="175" cy="100" rx="36" ry="12" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.4" />

                        <rect x="85" y="85" width="180" height="180" filter={`url(#${dustId})`} className="test-dust-drift" opacity="0.5" />
                        <ellipse className="test-cloud-drift" cx="200" cy="200" rx="30" ry="10" fill="#ffd7bb" opacity="0.3" />
                    </g>

                    <circle cx="175" cy="175" r="90" fill={`url(#${shadeId})`} />
                    <PlanetDepthLayers cx={175} cy={175} r={90} hotspotCx={132} hotspotCy={128} hotspotR={7} shadowRx={64} />
                    <circle cx="175" cy="175" r="88" fill="none" stroke={`url(#${rimId})`} strokeWidth="2" opacity="0.5" />

                    {/* غلاف جوي غباري رفيع — المريخ كان الوحيد من غير هالة limb */}
                    <circle cx="175" cy="175" r="100" fill={`url(#${atmoId})`} />
                </g>
            </svg>
        </div>
    );
}
