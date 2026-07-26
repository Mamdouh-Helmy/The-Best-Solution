import { memo, useMemo, useState } from "react";
import { NODES, CHART_WIDTH, CHART_HEIGHT } from "./data";
import { tr, buildSegment } from "./utils";

// المسار الصاعد من "الفكرة" لحد "لنبدأ". مش محتاج prop اسمه active
// لأن التفعيل بتاعه بيحصل بـ CSS ancestor selector (.ftr-section.is-active)
// جوه footer.css — فلما active يتغيّر في الأب، الكومبوننت ده (memo)
// بيتقفل من إعادة الرندر تلقائيًا.
function JourneyChart({ uid, isRTL, t }) {
    const [hovered, setHovered] = useState(null);

    const points = useMemo(
        () =>
            NODES.map((n) => ({
                ...n,
                x: isRTL ? (1 - n.frac) * CHART_WIDTH : n.frac * CHART_WIDTH,
                y: n.yFrac * CHART_HEIGHT,
            })),
        [isRTL]
    );

    const segments = useMemo(
        () => points.slice(0, -1).map((p, i) => buildSegment(p, points[i + 1])),
        [points]
    );

    // نقطة الاستقبال — خط قصير + دائرة متوهجة فوق أول نقطة ("لنبدأ")
    // مباشرة، بتمثل استمرار الإشارة القادمة من سيكشن Contact اللي
    // فوقها. بتبدأ من y=0 (أعلى الـ SVG بتاع الفوتر) لحد أول نقطة —
    // يعني بالكامل جوه ارتفاع الشارت نفسه، مفيش أي overflow برّه
    // الفوتر خالص، فمفيش أي تأثير على طول السكرول. وبما إنها بتتفعّل
    // بـ .ftr-section.is-active (نفس آلية باقي عناصر الشارت)، فهي
    // بتظهر فعليًا بس لما السكرول يوصل للفوتر — مش ظاهرة طول الوقت.
    const entryNode = points[0];

    return (
        <div className="ftr-chart-wrap">
            <p className="ftr-eyebrow">// {tr(t, "footer.eyebrow", "من الفكرة للإطلاق")}</p>

            <svg
                className="ftr-chart-svg"
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                preserveAspectRatio="xMidYMax meet"
                role="img"
                aria-label={tr(t, "footer.navTitle", "روابط الموقع")}
            >
                <defs>
                    <linearGradient id={`ftr-line-grad-${uid}`} x1="0" y1={CHART_HEIGHT} x2="0" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--color-accent-soft)" />
                        <stop offset="100%" stopColor="var(--color-accent2)" />
                    </linearGradient>
                </defs>

                {entryNode && (
                    <g>
                        <path
                            d={`M${entryNode.x},0 L${entryNode.x},${entryNode.y}`}
                            pathLength="1"
                            className="ftr-entry-stub"
                        />
                        <circle className="ftr-entry-glow" cx={entryNode.x} cy="0" r="9" />
                        <circle className="ftr-entry-dot" cx={entryNode.x} cy="0" r="4" />
                    </g>
                )}

                {segments.map((d, i) => (
                    <g key={i}>
                        <path d={d} className="ftr-seg" />
                        {/* stroke بيتحط inline لأنه لازم يشاور على gradient فريد
                            لكل نسخة من الفوتر (uid) — قيمة ديناميكية مش تقدر
                            تتحط في ملف CSS ستاتيك */}
                        <path
                            d={d}
                            pathLength="1"
                            className={`ftr-seg-progress ${hovered === i || hovered === i + 1 ? "is-lit" : ""}`}
                            style={{ stroke: `url(#ftr-line-grad-${uid})`, transitionDelay: `${0.15 + i * 0.28}s` }}
                        />
                    </g>
                ))}

                {points.map((p, i) => {
                    const label = tr(t, p.key, p.fallback);
                    const labelY = p.y - p.size - 10;
                    const content = (
                        <g
                            className={`ftr-node-group ${p.deco ? "ftr-node-deco" : ""} ${p.big ? "ftr-node-big" : ""}`}
                            style={{ transitionDelay: `${0.25 + i * 0.16}s` }}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                        >
                            {p.big && <circle className="ftr-node-big-glow" cx={p.x} cy={p.y} r={p.size + 8} />}
                            <circle className="ftr-node-dot" cx={p.x} cy={p.y} r={p.size} />
                            <text x={p.x} y={labelY} textAnchor="middle" className="ftr-node-label">
                                {label}
                            </text>
                        </g>
                    );
                    return p.href ? (
                        <a key={p.id} href={p.href} className="ftr-node-link" aria-label={label}>
                            {content}
                        </a>
                    ) : (
                        <g key={p.id}>{content}</g>
                    );
                })}
            </svg>
        </div>
    );
}

export default memo(JourneyChart);