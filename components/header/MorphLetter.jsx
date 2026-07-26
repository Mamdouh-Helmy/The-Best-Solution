"use client";

import { memo, useEffect, useRef } from "react";
import { gsap } from "gsap";

// الحرف المتحول — بيدير التبديل بين الحرف والشكل بتاعه. ده لسه
// محتاج JS (مش CSS بحت) لأن progress واحد بيتحكم في عنصرين مع بعض
// بالتزامن (الحرف بيختفي والشكل بيظهر في نفس اللحظة).
function MorphLetter({ letter, Shape, delay = 0 }) {
    const letterRef = useRef(null);
    const shapeRef = useRef(null);

    useEffect(() => {
        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) return;

        const proxy = { p: 0 };
        const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 2.4, delay });

        tl.to(proxy, {
            p: 1,
            duration: 0.75,
            ease: "power3.inOut",
            onUpdate: () => {
                const p = proxy.p;
                gsap.set(letterRef.current, { opacity: 1 - p, scale: 1 - p * 0.55, rotateY: p * 160 });
                gsap.set(shapeRef.current, { opacity: p, scale: 0.35 + p * 0.65, rotateY: (1 - p) * -160 });
            },
        });

        return () => tl.kill();
    }, [delay]);

    return (
        <span className="relative inline-block align-middle" style={{ width: "0.62em", height: "1em" }}>
            <span ref={letterRef} className="absolute inset-0 flex items-center justify-center" style={{ backfaceVisibility: "hidden" }}>
                {letter}
            </span>
            <span ref={shapeRef} className="absolute inset-0 flex items-center justify-center opacity-0" style={{ backfaceVisibility: "hidden" }}>
                <Shape />
            </span>
        </span>
    );
}

export default memo(MorphLetter);