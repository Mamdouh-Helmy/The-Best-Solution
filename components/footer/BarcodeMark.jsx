import { memo, useMemo } from "react";

// شرطة الباركود الزخرفية — عرض ثابت (seeded) لكل شرطة، بيتحسب مرة
// واحدة بس عند أول رندر وميتغيّرش تاني.
function BarcodeMark({ className = "" }) {
    const bars = useMemo(() => {
        let seed = 42;
        const rand = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
        return Array.from({ length: 22 }, () => 0.6 + rand() * 1.8);
    }, []);

    return (
        <svg className={className} viewBox="0 0 88 18" width="88" height="18" aria-hidden="true">
            {bars.map((w, i) => {
                const x = bars.slice(0, i).reduce((a, b) => a + b + 1.1, 0);
                return <rect key={i} x={x} y="0" width={w} height="18" fill="currentColor" />;
            })}
        </svg>
    );
}

export default memo(BarcodeMark);