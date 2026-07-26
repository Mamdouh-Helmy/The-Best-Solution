// =====================================================================
// ===== ديكور: نجمة ثلاثية الأبعاد (شارة "The Best Solution") =====
// =====================================================================
export default function BestStarDecor({ uid }) {
    const glowId = `test-star-glow-${uid}`;
    const faceLightId = `test-star-facelight-${uid}`;
    const faceDarkId = `test-star-facedark-${uid}`;
    const shineId = `test-star-shine-${uid}`;

    const outerPts = Array.from({ length: 5 }, (_, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        return [50 + 34 * Math.cos(a), 50 + 34 * Math.sin(a)];
    });
    const innerPts = Array.from({ length: 5 }, (_, i) => {
        const a = -Math.PI / 2 + Math.PI / 5 + (i * 2 * Math.PI) / 5;
        return [50 + 13.5 * Math.cos(a), 50 + 13.5 * Math.sin(a)];
    });

    const facets = outerPts.map((p, i) => {
        const innerA = innerPts[i];
        const innerB = innerPts[(i + 4) % 5];
        return { d: `M50,50 L${innerB[0]},${innerB[1]} L${p[0]},${p[1]} L${innerA[0]},${innerA[1]} Z`, lit: i % 2 === 0 };
    });

    return (
        <div className="flex-none" style={{ transform: "translateY(-6px)" }}>
            <svg viewBox="0 0 100 100" width="76" height="76" style={{ overflow: "visible", display: "block" }}>
                <defs>
                    <linearGradient id={faceLightId} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fff9e0" />
                        <stop offset="55%" stopColor="var(--color-accent-soft)" />
                        <stop offset="100%" stopColor="var(--color-accent)" />
                    </linearGradient>
                    <linearGradient id={faceDarkId} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="var(--color-accent)" />
                        <stop offset="100%" stopColor="var(--color-accent2)" />
                    </linearGradient>
                    <filter id={glowId} x="-120%" y="-120%" width="340%" height="340%">
                        <feGaussianBlur stdDeviation="4.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id={shineId} x="-60%" y="-60%" width="220%" height="220%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="4" result="n" />
                        <feSpecularLighting in="n" surfaceScale="2.4" specularConstant="1.3" specularExponent="20" lightingColor="#ffffff" result="spec">
                            <fePointLight x="30" y="15" z="60" />
                        </feSpecularLighting>
                        <feComposite in="spec" in2="SourceAlpha" operator="in" />
                    </filter>
                </defs>

                <g className="test-star-spin" style={{ transformOrigin: "50px 50px" }}>
                    <circle cx="50" cy="50" r="30" fill="var(--color-accent-soft)" opacity="0.22" filter={`url(#${glowId})`} />
                    {facets.map((f, i) => (
                        <path key={i} d={f.d} fill={`url(#${f.lit ? faceLightId : faceDarkId})`} stroke="#050510" strokeOpacity="0.12" strokeWidth="0.6" />
                    ))}
                    <path
                        d={facets[0].d}
                        fill="#fff"
                        opacity="0.5"
                        filter={`url(#${shineId})`}
                        style={{ mixBlendMode: "screen" }}
                    />
                    <g className="test-star-sparkle">
                        <path d="M14,20 L16,26 L22,28 L16,30 L14,36 L12,30 L6,28 L12,26 Z" fill="#fff" opacity="0.85" />
                    </g>
                    <g className="test-star-sparkle test-star-sparkle-2">
                        <path d="M84,66 L85.5,70 L89.5,71.5 L85.5,73 L84,77 L82.5,73 L78.5,71.5 L82.5,70 Z" fill="#fff" opacity="0.75" />
                    </g>
                </g>
            </svg>
        </div>
    );
}
