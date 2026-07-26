"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { TITLE_TEXT, LAYER_COUNT, LAYER_DEPTH_STEP, DEGREES_PER_PIXEL, HOVER_LIFT_Z, COLOR_INDIGO, COLOR_PINK } from "./data";

function LetterLayer({ char, layerIndex, isFront, isRim, depthRatio }) {
    const color = isFront ? "var(--color-ink)" : isRim ? COLOR_PINK : COLOR_INDIGO;
    const glow = isFront ? "0 2px 10px rgba(0,0,0,0.35)" : isRim ? "0 0 8px rgba(244,114,182,0.6)" : "none";

    return (
        <span
            aria-hidden={!isFront}
            className="inline-block"
            style={{
                position: layerIndex === 0 ? "relative" : "absolute",
                inset: 0,
                fontFamily: "var(--font-display-en)",
                fontWeight: 700,
                fontSize: "clamp(1.9rem, 5.5vw, 4.2rem)",
                lineHeight: 1,
                whiteSpace: "nowrap",
                transform: `translateZ(${layerIndex * LAYER_DEPTH_STEP}px)`,
                color,
                filter: isFront ? "none" : `brightness(${0.4 + depthRatio * 0.6})`,
                textShadow: glow,
            }}
        >
            {char}
        </span>
    );
}

function Letter3D({ char, index, wrapRef, groupRef, onEnter, onLeave, onMove }) {
    const isSpace = char === " ";

    return (
        <div
            ref={wrapRef}
            onPointerEnter={() => onEnter(index)}
            onPointerLeave={() => onLeave(index)}
            onPointerMove={(e) => onMove(index, e)}
            style={{
                display: "inline-block",
                perspective: "700px",
                marginInline: "0.06em",
                width: isSpace ? "0.4em" : undefined,
                flexShrink: 0,
            }}
        >
            {!isSpace && (
                <div
                    ref={groupRef}
                    style={{ position: "relative", transformStyle: "preserve-3d", willChange: "transform", cursor: "grab" }}
                >
                    {Array.from({ length: LAYER_COUNT }).map((_, layerIndex) => {
                        const isFront = layerIndex === LAYER_COUNT - 1;
                        const isRim = layerIndex >= LAYER_COUNT - 3 && !isFront;
                        const depthRatio = layerIndex / (LAYER_COUNT - 1);
                        return (
                            <LetterLayer
                                key={layerIndex}
                                char={char}
                                layerIndex={layerIndex}
                                isFront={isFront}
                                isRim={isRim}
                                depthRatio={depthRatio}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// title: optional override. Defaults to the site-wide TITLE_TEXT so the
// main Hero keeps working exactly as before with zero changes at its
// call site. Pass e.g. title="Dashboard" for the admin area — that text
// is always rendered in English/Latin characters, since this component's
// layered 3D effect is designed around Latin glyph shapes.
export default function Hero3DTitle({ title = TITLE_TEXT }) {
    const wrapRefs = useRef([]);
    const groupRefs = useRef([]);
    const spinAnimations = useRef([]);
    const rotation = useRef([]);
    const [, forceHoverState] = useState(0);

    useEffect(() => {
        spinAnimations.current = groupRefs.current.map((el) => {
            if (!el) return null;
            return {
                rotateY: gsap.quickTo(el, "rotationY", { duration: 0.15, ease: "power2.out" }),
                rotateX: gsap.quickTo(el, "rotationX", { duration: 0.15, ease: "power2.out" }),
                pushForward: gsap.quickTo(el, "z", { duration: 0.4, ease: "power2.out" }),
            };
        });
        rotation.current = groupRefs.current.map(() => ({ y: 0, x: 0 }));
    }, [title]);

    function handlePointerMove(index, event) {
        const spin = spinAnimations.current[index];
        const current = rotation.current[index];
        if (!spin || !current) return;

        current.y += event.movementX * DEGREES_PER_PIXEL;
        current.x += -event.movementY * DEGREES_PER_PIXEL;

        spin.rotateY(current.y);
        spin.rotateX(current.x);
    }

    function handleLetterEnter(index) {
        forceHoverState((v) => v + 1);
        spinAnimations.current[index]?.pushForward(HOVER_LIFT_Z);
    }

    function handleLetterLeave(index) {
        forceHoverState((v) => v + 1);
        const spin = spinAnimations.current[index];
        const current = rotation.current[index];
        if (!spin || !current) return;

        current.y = Math.round(current.y / 360) * 360;
        current.x = 0;
        spin.rotateY(current.y);
        spin.rotateX(current.x);
        spin.pushForward(0);
    }

    return (
        <div dir="ltr" className="inline-flex justify-center select-none" style={{ flexWrap: "nowrap", whiteSpace: "nowrap" }}>
            {title.split("").map((char, i) => (
                <Letter3D
                    key={i}
                    char={char}
                    index={i}
                    wrapRef={(el) => (wrapRefs.current[i] = el)}
                    groupRef={(el) => (groupRefs.current[i] = el)}
                    onEnter={handleLetterEnter}
                    onLeave={handleLetterLeave}
                    onMove={handlePointerMove}
                />
            ))}
        </div>
    );
}
