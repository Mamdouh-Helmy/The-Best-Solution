// =====================================================================
// ===== ديكور 4: الشمس =====
// =====================================================================
export default function SunDecor({ uid, index }) {
    const diskId = `test-sun-disk-${uid}-${index}`;
    const shadeId = `test-sun-shade-${uid}-${index}`;
    const specId = `test-sun-spec-${uid}-${index}`;
    const rimId = `test-sun-rim-${uid}-${index}`;
    const coronaId = `test-sun-corona-${uid}-${index}`;
    const promId = `test-sun-prom-${uid}-${index}`;
    const spotId = `test-sun-spot-${uid}-${index}`;
    const glowId = `test-sun-glow-${uid}-${index}`;
    const softGlowId = `test-sun-softglow-${uid}-${index}`;
    const plasmaId = `test-sun-plasma-${uid}-${index}`;
    const plasmaClipId = `test-sun-plasmaclip-${uid}-${index}`;

    const rays = [
        { angle: 10, len: 30 }, { angle: 40, len: 46 }, { angle: 72, len: 22 },
        { angle: 100, len: 38 }, { angle: 132, len: 24 }, { angle: 162, len: 40 },
        { angle: 194, len: 26 }, { angle: 222, len: 44 }, { angle: 252, len: 22 },
        { angle: 284, len: 36 }, { angle: 312, len: 26 }, { angle: 340, len: 40 },
    ];
    const prominences = [
        { rot: -35, scale: 1.15 }, { rot: 96, scale: 0.9 }, { rot: 205, scale: 1.02 },
    ];
    const spots = [
        { cx: 174, cy: 200, r: 20 }, { cx: 246, cy: 244, r: 12 }, { cx: 200, cy: 264, r: 7 },
    ];
    const flareRings = [
        { d: 40, r: 5, o: 0.5 }, { d: 78, r: 9, o: 0.35 }, { d: 118, r: 4, o: 0.55 },
        { d: 156, r: 14, o: 0.25 }, { d: 190, r: 3, o: 0.6 }, { d: 224, r: 7, o: 0.3 },
    ];

    return (
        <div className="test-decor relative flex items-center justify-center [perspective:1100px]">
            <svg className="block max-w-[min(72vw,420px)] h-auto" viewBox="0 0 420 420" width="380" height="380" style={{ overflow: "visible" }}>
                <defs>
                    <radialGradient id={diskId} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fff6d6" />
                        <stop offset="22%" stopColor="#ffe27a" />
                        <stop offset="48%" stopColor="#ffb444" />
                        <stop offset="74%" stopColor="#ff7a1f" />
                        <stop offset="92%" stopColor="#e3490f" />
                        <stop offset="100%" stopColor="#a92c0a" />
                    </radialGradient>
                    <radialGradient id={shadeId} cx="30%" cy="26%" r="92%">
                        <stop offset="0%" stopColor="#1a0800" stopOpacity="0" />
                        <stop offset="50%" stopColor="#1a0800" stopOpacity="0" />
                        <stop offset="82%" stopColor="#1a0800" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#1a0800" stopOpacity="0.5" />
                    </radialGradient>
                    <radialGradient id={specId} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id={rimId} x1="0" y1="420" x2="420" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#ffcf8a" stopOpacity="0" />
                        <stop offset="55%" stopColor="#ffcf8a" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ffcf8a" stopOpacity="0" />
                    </linearGradient>
                    <radialGradient id={coronaId} cx="50%" cy="50%" r="50%">
                        <stop offset="55%" stopColor="#ffd27a" stopOpacity="0" />
                        <stop offset="78%" stopColor="#ffb35e" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#ff8a3d" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id={spotId} cx="42%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="#2a0d02" />
                        <stop offset="55%" stopColor="#5a1e06" />
                        <stop offset="100%" stopColor="#9a4212" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id={promId} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fff3c4" />
                        <stop offset="45%" stopColor="#ffa23a" />
                        <stop offset="100%" stopColor="#e0430f" />
                    </linearGradient>
                    <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="10" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id={softGlowId} x="-150%" y="-150%" width="400%" height="400%">
                        <feGaussianBlur stdDeviation="24" />
                    </filter>
                    <clipPath id={plasmaClipId}>
                        <circle cx="210" cy="210" r="102" />
                    </clipPath>
                    <filter id={plasmaId} x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves="3" seed="11" result="plasmaNoise">
                            <animate attributeName="seed" values="11;24;11" dur="6s" repeatCount="indefinite" />
                            <animate attributeName="baseFrequency" values="0.018 0.05;0.026 0.07;0.018 0.05" dur="9s" repeatCount="indefinite" />
                        </feTurbulence>
                        <feColorMatrix in="plasmaNoise" type="matrix" values="
                            0 0 0 0 1
                            0 0 0 0 0.72
                            0 0 0 0 0.15
                            0 0 0 0.9 0" />
                    </filter>
                </defs>

                <circle cx="210" cy="210" r="196" fill="#ff9a45" opacity="0.16" filter={`url(#${softGlowId})`} />
                <circle className="test-corona-pulse" cx="210" cy="210" r="160" fill={`url(#${coronaId})`} />
                <circle className="test-corona-pulse test-corona-pulse-2" cx="210" cy="210" r="128" fill={`url(#${coronaId})`} opacity="0.6" />

                <g className="test-flare-spin" style={{ transformOrigin: "210px 210px" }}>
                    {rays.map((r, i) => (
                        <line
                            key={i}
                            x1="210" y1={210 - 104}
                            x2="210" y2={210 - 104 - r.len}
                            stroke="#ffcf8a"
                            strokeWidth={i % 3 === 0 ? 2 : 1.2}
                            strokeLinecap="round"
                            opacity={i % 3 === 0 ? 0.6 : 0.35}
                            transform={`rotate(${r.angle} 210 210)`}
                        />
                    ))}
                </g>

                {prominences.map((p, i) => (
                    <g key={i} className="test-prominence-flicker" style={{ animationDelay: `${i * 0.6}s`, transformOrigin: "210px 210px" }} transform={`rotate(${p.rot} 210 210)`}>
                        <path
                            d={`M210,${210 - 102} C${226 * p.scale + 52},${210 - 130 * p.scale} ${226 * p.scale + 60},${210 - 52 * p.scale} 210,${210 - 102}`}
                            fill="none"
                            stroke={`url(#${promId})`}
                            strokeWidth={9 * p.scale}
                            strokeLinecap="round"
                            filter={`url(#${glowId})`}
                            opacity="0.92"
                        />
                        <path
                            d={`M210,${210 - 102} C${226 * p.scale + 52},${210 - 130 * p.scale} ${226 * p.scale + 60},${210 - 52 * p.scale} 210,${210 - 102}`}
                            fill="none"
                            stroke="#fff8dc"
                            strokeWidth={3 * p.scale}
                            strokeLinecap="round"
                            opacity="0.7"
                        />
                    </g>
                ))}

                <g filter={`url(#${glowId})`}>
                    <circle cx="210" cy="210" r="102" fill={`url(#${diskId})`} />
                    <g clipPath={`url(#${plasmaClipId})`} style={{ mixBlendMode: "overlay" }}>
                        <rect x="108" y="108" width="204" height="204" filter={`url(#${plasmaId})`} opacity="0.55" />
                    </g>
                    {spots.map((s, i) => (
                        <g key={i} className="test-sun-spot" style={{ animationDelay: `${i * 0.8}s` }}>
                            <circle cx={s.cx} cy={s.cy} r={s.r} fill={`url(#${spotId})`} opacity="0.82" />
                            <circle cx={s.cx} cy={s.cy} r={s.r * 0.42} fill="#1a0800" opacity="0.85" />
                        </g>
                    ))}
                    <circle cx="210" cy="210" r="102" fill={`url(#${shadeId})`} />
                    <ellipse className="test-specular-pulse" cx="168" cy="164" rx="36" ry="24" fill={`url(#${specId})`} />
                    <ellipse cx="176" cy="170" rx="10" ry="7" fill="#ffffff" opacity="0.85" style={{ filter: "blur(0.5px)" }} />
                    <circle
                        cx="210" cy="210" r="90"
                        fill="none"
                        stroke="#ff5f7a"
                        strokeWidth="1.6"
                        opacity="0.16"
                        style={{ mixBlendMode: "screen" }}
                    />
                    <circle cx="210" cy="210" r="100" fill="none" stroke={`url(#${rimId})`} strokeWidth="2.4" opacity="0.6" />
                </g>

                <g className="test-lensflare" opacity="0.8">
                    {flareRings.map((f, i) => (
                        <circle
                            key={i}
                            cx={210 + Math.cos(0.62) * f.d}
                            cy={210 + Math.sin(0.62) * f.d}
                            r={f.r}
                            fill="none"
                            stroke="#ffe8b8"
                            strokeWidth="1.4"
                            opacity={f.o}
                        />
                    ))}
                </g>
            </svg>
        </div>
    );
}
