import { TILT_DEG } from "../data";

// =====================================================================
// ===== ديكور 5: كوكب الأرض (ستايل كارتوني - أداء خفيف) =====
// =====================================================================
export default function EarthDecor({ uid, index }) {
    const oceanId = `earth-ocean-${uid}-${index}`;
    const clipId = `earth-clip-${uid}-${index}`;

    return (
        <div className="test-decor relative flex items-center justify-center [perspective:1100px]">
            <svg
                className="block max-w-[min(72vw,380px)] h-auto"
                viewBox="0 0 400 400"
                width="360"
                height="360"
            >
                <defs>
                    <linearGradient id={oceanId} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#7FE3FF" />
                        <stop offset="100%" stopColor="#1B8FD6" />
                    </linearGradient>
                    <clipPath id={clipId}>
                        <circle cx="200" cy="200" r="120" />
                    </clipPath>
                </defs>

                {/* هالة ثابتة حوالين الكوكب - flat opacity، من غير أي filter */}
                <circle cx="200" cy="200" r="132" fill="#8fd4ff" opacity="0.18" />

                <g transform={`rotate(${TILT_DEG} 200 200)`}>
                    {/* المحيط */}
                    <circle cx="200" cy="200" r="120" fill={`url(#${oceanId})`} />

                    {/* القارات - flat color + outline غامق، ستايل كارتوني */}
                    <g clipPath={`url(#${clipId})`} className="earth-spin">
                        <g fill="#5FD068" stroke="#2E7D32" strokeWidth="5" strokeLinejoin="round">
                            <path d="M120,150 Q140,120 175,130 Q205,138 200,170 Q195,200 165,205 Q130,208 118,180 Q110,163 120,150 Z" />
                            <path d="M235,160 Q265,150 285,175 Q298,198 278,215 Q255,225 238,205 Q225,185 235,160 Z" />
                            <path d="M150,225 Q175,218 195,235 Q205,255 185,268 Q160,275 145,258 Q135,240 150,225 Z" />
                            <path d="M270,235 Q290,232 295,252 Q292,268 275,265 Q260,260 262,245 Q264,238 270,235 Z" />
                        </g>
                        {/* نفس القارات في الجهة المقابلة عشان الدوران يحس بيه */}
                        <g fill="#5FD068" stroke="#2E7D32" strokeWidth="5" strokeLinejoin="round" transform="rotate(180 200 200)">
                            <path d="M120,150 Q140,120 175,130 Q205,138 200,170 Q195,200 165,205 Q130,208 118,180 Q110,163 120,150 Z" opacity="0.85" />
                            <path d="M235,160 Q265,150 285,175 Q298,198 278,215 Q255,225 238,205 Q225,185 235,160 Z" opacity="0.7" />
                        </g>
                    </g>

                    {/* لمعة كارتونية - بيضاوي شفاف من غير blur */}
                    <ellipse cx="160" cy="150" rx="45" ry="28" fill="#ffffff" opacity="0.35" transform="rotate(-25 160 150)" />

                    {/* سحب - دواير بسيطة فوق بعض، من غير filter */}
                    <g className="earth-cloud-1" fill="#ffffff" opacity="0.85">
                        <ellipse cx="150" cy="140" rx="22" ry="13" />
                        <ellipse cx="168" cy="132" rx="16" ry="10" />
                        <ellipse cx="132" cy="134" rx="14" ry="9" />
                    </g>
                    <g className="earth-cloud-2" fill="#ffffff" opacity="0.8">
                        <ellipse cx="250" cy="245" rx="20" ry="12" />
                        <ellipse cx="266" cy="238" rx="14" ry="9" />
                        <ellipse cx="234" cy="240" rx="13" ry="8" />
                    </g>

                    {/* حافة outline كارتونية حوالين الكوكب كله */}
                    <circle cx="200" cy="200" r="120" fill="none" stroke="#0B4F8A" strokeWidth="5" opacity="0.55" />
                </g>
            </svg>
        </div>
    );
}