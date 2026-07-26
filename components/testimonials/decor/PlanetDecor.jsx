import PlanetDepthLayers from "../PlanetDepthLayers";
import { TILT_DEG } from "../data";

// =====================================================================
// ===== ديكور 1: كوكب غازي بحلقة =====
// =====================================================================
export default function PlanetDecor({ uid, index }) {
    const sphereId = `test-planet-sphere-${uid}-${index}`;
    const clipId = `test-planet-clip-${uid}-${index}`;
    const shadeId = `test-planet-shade-${uid}-${index}`;
    const rimId = `test-planet-rim-${uid}-${index}`;
    const bandId = `test-planet-band-${uid}-${index}`;
    const ringId = `test-planet-ring-${uid}-${index}`;
    const ringClipId = `test-planet-ringclip-${uid}-${index}`;
    const glowId = `test-planet-glow-${uid}-${index}`;

    return (
        <div className="test-decor relative flex items-center justify-center [perspective:1100px]">
            <svg className="block max-w-[min(72vw,420px)] h-auto" viewBox="0 0 400 400" width="380" height="380" style={{ overflow: "visible" }}>
                <defs>
                    <radialGradient id={sphereId} cx="34%" cy="28%" r="80%">
                        <stop offset="0%" stopColor="var(--color-accent-soft)" />
                        <stop offset="52%" stopColor="var(--color-accent)" />
                        <stop offset="100%" stopColor="var(--color-accent2)" />
                    </radialGradient>
                    <clipPath id={clipId}>
                        <circle cx="200" cy="200" r="98" />
                    </clipPath>
                    <radialGradient id={shadeId} cx="30%" cy="26%" r="92%">
                        <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                        <stop offset="42%" stopColor="#000000" stopOpacity="0" />
                        <stop offset="78%" stopColor="#000000" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0.72" />
                    </radialGradient>
                    <linearGradient id={rimId} x1="0" y1="400" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
                        <stop offset="55%" stopColor="var(--color-accent-soft)" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id={bandId} x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--color-panel2)" stopOpacity="0" />
                        <stop offset="50%" stopColor="var(--color-panel2)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="var(--color-panel2)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id={ringId} x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--color-accent-soft)" />
                        <stop offset="50%" stopColor="var(--color-accent2)" />
                        <stop offset="100%" stopColor="var(--color-accent-soft)" />
                    </linearGradient>
                    <clipPath id={ringClipId}>
                        <rect x="0" y="200" width="400" height="200" />
                    </clipPath>
                    <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur stdDeviation="14" />
                    </filter>
                </defs>

                <circle className="test-planet-halo" cx="200" cy="200" r="150" fill="var(--color-accent-soft)" opacity="0.16" filter={`url(#${glowId})`} />

                <g transform={`rotate(${TILT_DEG} 200 200)`}>
                    <ellipse cx="200" cy="200" rx="192" ry="66" fill="none" stroke={`url(#${ringId})`} strokeWidth="7" opacity="0.35" />
                    <ellipse cx="200" cy="200" rx="182" ry="61" fill="none" stroke="var(--color-bg)" strokeWidth="2" opacity="0.5" />
                    <ellipse cx="200" cy="200" rx="172" ry="56" fill="none" stroke={`url(#${ringId})`} strokeWidth="13" opacity="0.9" />
                    <ellipse cx="200" cy="200" rx="150" ry="45" fill="none" stroke="var(--color-bg)" strokeWidth="1.4" opacity="0.4" />
                    <ellipse cx="200" cy="200" rx="138" ry="38" fill="none" stroke={`url(#${ringId})`} strokeWidth="8" opacity="0.6" />

                    <circle cx="200" cy="200" r="98" fill={`url(#${sphereId})`} />

                    <g className="test-band-spin" clipPath={`url(#${clipId})`}>
                        <ellipse cx="200" cy="158" rx="102" ry="11" fill={`url(#${bandId})`} opacity="0.55" />
                        <ellipse cx="200" cy="186" rx="102" ry="15" fill={`url(#${bandId})`} opacity="0.38" />
                        <ellipse cx="200" cy="216" rx="102" ry="10" fill={`url(#${bandId})`} opacity="0.48" />
                        <ellipse cx="200" cy="244" rx="102" ry="8" fill={`url(#${bandId})`} opacity="0.32" />
                        <ellipse cx="150" cy="200" rx="20" ry="12" fill="var(--color-accent2)" opacity="0.4" />
                        <ellipse cx="150" cy="200" rx="12" ry="7" fill="#ffffff" opacity="0.2" />
                    </g>

                    <circle cx="200" cy="200" r="98" fill={`url(#${shadeId})`} />
                    <PlanetDepthLayers cx={200} cy={200} r={98} hotspotCx={148} hotspotCy={146} hotspotR={9} shadowRx={70} />
                    <circle cx="200" cy="200" r="96" fill="none" stroke={`url(#${rimId})`} strokeWidth="2.5" opacity="0.55" />

                    <g clipPath={`url(#${ringClipId})`}>
                        <ellipse cx="200" cy="200" rx="192" ry="66" fill="none" stroke={`url(#${ringId})`} strokeWidth="7" opacity="0.4" />
                        <ellipse cx="200" cy="200" rx="182" ry="61" fill="none" stroke="var(--color-bg)" strokeWidth="2" opacity="0.55" />
                        <ellipse cx="200" cy="200" rx="172" ry="56" fill="none" stroke={`url(#${ringId})`} strokeWidth="13" opacity="0.95" />
                        <ellipse cx="200" cy="200" rx="150" ry="45" fill="none" stroke="var(--color-bg)" strokeWidth="1.4" opacity="0.45" />
                        <ellipse cx="200" cy="200" rx="138" ry="38" fill="none" stroke={`url(#${ringId})`} strokeWidth="8" opacity="0.65" />
                    </g>
                </g>
            </svg>
        </div>
    );
}
