import PlanetDepthLayers from "../PlanetDepthLayers";
import { TILT_DEG } from "../data";

// =====================================================================
// ===== ديكور 2: قمر =====
// =====================================================================
export default function MoonDecor({ uid, index }) {
    const sphereId = `test-moon-sphere-${uid}-${index}`;
    const shadeId = `test-moon-shade-${uid}-${index}`;
    const rimId = `test-moon-rim-${uid}-${index}`;
    const glowId = `test-moon-glow-${uid}-${index}`;
    const craterId = `test-moon-crater-${uid}-${index}`;

    const craters = [
        { cx: 150, cy: 118, r: 26 }, { cx: 232, cy: 92, r: 15 },
        { cx: 262, cy: 172, r: 30 }, { cx: 168, cy: 210, r: 19 },
        { cx: 104, cy: 190, r: 13 }, { cx: 198, cy: 150, r: 10 },
        { cx: 122, cy: 160, r: 7 }, { cx: 246, cy: 128, r: 8 },
    ];

    return (
        <div className="test-decor relative flex items-center justify-center [perspective:1100px]">
            <svg className="block max-w-[min(72vw,420px)] h-auto" viewBox="0 0 360 360" width="330" height="330" style={{ overflow: "visible" }}>
                <defs>
                    <radialGradient id={sphereId} cx="30%" cy="24%" r="88%">
                        <stop offset="0%" stopColor="var(--color-panel)" />
                        <stop offset="42%" stopColor="var(--color-panel2)" />
                        <stop offset="100%" stopColor="var(--color-line)" />
                    </radialGradient>
                    <radialGradient id={shadeId} cx="30%" cy="26%" r="92%">
                        <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                        <stop offset="48%" stopColor="#000000" stopOpacity="0" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
                    </radialGradient>
                    <linearGradient id={rimId} x1="0" y1="360" x2="360" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
                        <stop offset="55%" stopColor="var(--color-accent-soft)" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
                    </linearGradient>
                    <radialGradient id={craterId} cx="38%" cy="34%" r="70%">
                        <stop offset="0%" stopColor="#000000" stopOpacity="0.42" />
                        <stop offset="70%" stopColor="#000000" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </radialGradient>
                    <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur stdDeviation="12" />
                    </filter>
                </defs>

                <g className="test-twinkle-group">
                    <circle cx="30" cy="46" r="2.1" fill="var(--color-accent-soft)" className="test-twinkle" style={{ animationDelay: "0s" }} />
                    <circle cx="320" cy="68" r="1.7" fill="var(--color-accent2)" className="test-twinkle" style={{ animationDelay: "0.6s" }} />
                    <circle cx="298" cy="272" r="2.3" fill="var(--color-accent-soft)" className="test-twinkle" style={{ animationDelay: "1.1s" }} />
                    <circle cx="40" cy="270" r="1.8" fill="var(--color-accent2)" className="test-twinkle" style={{ animationDelay: "1.6s" }} />
                    <circle cx="180" cy="22" r="1.5" fill="var(--color-accent-soft)" className="test-twinkle" style={{ animationDelay: "2s" }} />
                </g>

                <circle cx="180" cy="180" r="128" fill="var(--color-accent-soft)" opacity="0.14" filter={`url(#${glowId})`} />

                <g transform={`rotate(${TILT_DEG - 4} 180 180)`}>
                    <circle cx="180" cy="180" r="112" fill={`url(#${sphereId})`} stroke="var(--color-line)" strokeWidth="1.5" />
                    {craters.map((c, i) => (
                        <g key={i}>
                            <circle cx={c.cx} cy={c.cy} r={c.r} fill={`url(#${craterId})`} />
                            <path
                                d={`M${c.cx - c.r * 0.72},${c.cy - c.r * 0.18} A${c.r},${c.r} 0 0 1 ${c.cx + c.r * 0.18},${c.cy - c.r * 0.72}`}
                                fill="none"
                                stroke="#ffffff"
                                strokeOpacity="0.28"
                                strokeWidth={Math.max(1, c.r * 0.12)}
                            />
                            <circle cx={c.cx + c.r * 0.3} cy={c.cy + c.r * 0.3} r={c.r * 0.26} fill="#ffffff" opacity="0.14" />
                        </g>
                    ))}
                    <circle cx="180" cy="180" r="112" fill={`url(#${shadeId})`} />
                    <PlanetDepthLayers cx={180} cy={180} r={112} hotspotCx={128} hotspotCy={124} hotspotR={9} shadowRx={78} />
                    <circle cx="180" cy="180" r="110" fill="none" stroke={`url(#${rimId})`} strokeWidth="2" opacity="0.5" />
                </g>
            </svg>
        </div>
    );
}
