// عناصر ثلاثية الأبعاد مشتركة بتتضاف فوق أي كوكب: ظل تحته (grounding)،
// specular hotspot حاد فوق الانعكاس الناعم الموجود، وrim ثانوي بلون بارد
// يحاكي مصدر إضاءة تاني (إحساس استوديو تصوير مش لمبة واحدة).
export default function PlanetDepthLayers({ cx, cy, r, hotspotCx, hotspotCy, hotspotR, shadowRx }) {
    return (
        <>
            <ellipse
                cx={cx}
                cy={cy + r * 0.96}
                rx={shadowRx ?? r * 0.72}
                ry={r * 0.16}
                fill="#000000"
                opacity="0.22"
                style={{ filter: "blur(10px)" }}
            />
            <ellipse
                className="test-specular-pulse"
                cx={hotspotCx}
                cy={hotspotCy}
                rx={hotspotR}
                ry={hotspotR * 0.7}
                fill="#ffffff"
                opacity="0.9"
                style={{ filter: "blur(0.5px)" }}
            />
            <circle
                cx={cx}
                cy={cy}
                r={r * 0.985}
                fill="none"
                stroke="#8fb8ff"
                strokeWidth={r * 0.02}
                opacity="0.28"
                style={{ mixBlendMode: "screen" }}
            />
        </>
    );
}
