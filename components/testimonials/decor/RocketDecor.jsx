import { useEffect, useRef } from "react";
import gsap from "gsap";

// =====================================================================
// ===== ديكور 3: الصاروخ =====
//
// ملحوظة إصلاح 1 (قديمة، لسه لازمة):
// اللهب (flameRef) فلتره مستقل بمنطقة ثابتة (filterUnits="userSpaceOnUse")
// بدل ما تتحسب من bounding box اللهب المتغير الحجم باستمرار. ده بيمنع
// إعادة حساب غلط لمنطقة الفلتر وقت أي reflow قسري (زي ScrollTrigger.pin).
//
// ملحوظة إصلاح 2 (السبب الحقيقي لقفزة اللهب/الصاروخ وقت السكرول):
// كان فيه مصدرين بيتحكموا في transform العنصر الـ <svg> نفسه في نفس
// الوقت:
//   1) GSAP بيحرّك نفس الـ <svg> (idle bob + boost) عن طريق inline style
//   2) CSS keyframe (testTilt3d من testimonials.css، مطبّق عن طريق
//      svg.test-rocket-svg) بيحرّك نفس العنصر بنفس الخاصية (transform)
//
// CSS Animations بتكسب على أي transform متحط بـ JS/inline style على
// نفس العنصر، فكل فريم كانت الـ CSS keyframe بتلغي قيمة GSAP، وده
// كان بيبان كقفزة مفاجئة — بالذات وقت السكرول، لأن الأنيميشن CSS ده
// بيتفعّل (animation-play-state: running) بالظبط لما السيكشن يبقى
// .is-active عن طريق IntersectionObserver.
//
// الحل: فصلنا الاتنين على عنصرين مختلفين. الـ <div> الغلاف (wrapperRef)
// بقى هو اللي GSAP بيحرّكه (idle bob + boost tween)، والـ <svg> الداخلي
// (بكلاس test-rocket-svg) فضل لوحده ياخد الـ CSS tilt animation. كل
// عنصر بقى مسؤول عن transform خاصة بيه، فمفيش تعارض، والاتنين بيتراكموا
// بصريًا بشكل طبيعي (nested transforms).
// =====================================================================
export default function RocketDecor({ uid, index }) {
    const bodyGradId = `test-rocket-body-${uid}-${index}`;
    const brushId = `test-rocket-brush-${uid}-${index}`;
    const shadeId = `test-rocket-shade-${uid}-${index}`;
    const specId = `test-rocket-spec-${uid}-${index}`;
    const rimId = `test-rocket-rim-${uid}-${index}`;
    const glassId = `test-rocket-glass-${uid}-${index}`;
    const finId = `test-rocket-fin-${uid}-${index}`;
    const nozzleId = `test-rocket-nozzle-${uid}-${index}`;
    const flameId = `test-rocket-flame-${uid}-${index}`;
    const flameCoreId = `test-rocket-flamecore-${uid}-${index}`;
    const glowId = `test-rocket-glow-${uid}-${index}`;
    const flameGlowId = `test-rocket-flameglow-${uid}-${index}`;
    const engineGlowId = `test-rocket-engineglow-${uid}-${index}`;
    const heatId = `test-rocket-heat-${uid}-${index}`;
    const smokeTurbId = `test-rocket-smoketurb-${uid}-${index}`;

    // wrapperRef: العنصر اللي GSAP بيحرّكه (idle bob + boost).
    // rocketRef: بقى بس reference للـ <svg> نفسه (مش بيتحرك بـ GSAP تاني).
    const wrapperRef = useRef(null);
    const rocketRef = useRef(null);
    const flameRef = useRef(null);
    const nozzleGlowRef = useRef(null);

    useEffect(() => {
        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const node = wrapperRef.current;
        if (!node || reduceMotion) return;

        const idle = gsap.to(node, {
            y: -8,
            rotation: 1.1,
            duration: 2.6,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            transformOrigin: "50% 100%",
        });

        const boost = gsap.timeline({ paused: true });
        boost
            .to(node, { rotation: -3.5, duration: 0.25, ease: "power1.out" }, 0)
            .to(node, { y: -26, scale: 1.03, duration: 0.6, ease: "power2.out" }, 0)
            .to(node, { rotation: 2.4, duration: 1.3, ease: "sine.inOut", repeat: -1, yoyo: true }, 0.25)
            .to(node, { y: -16, duration: 1.1, ease: "sine.inOut", repeat: -1, yoyo: true }, 0.6)
            .to(node, { x: "+=1.4", duration: 0.05, ease: "none", repeat: 7, yoyo: true }, 0.05)
            .to(flameRef.current, { scaleY: 1.4, opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
            .to(nozzleGlowRef.current, { opacity: 1, scale: 1.15, duration: 0.4, ease: "power2.out" }, 0);

        const onEnter = () => { idle.pause(); boost.play(); };
        const onLeave = () => {
            boost.pause(0);
            gsap.to(node, { rotation: 0, x: 0, scale: 1, duration: 0.6, ease: "power3.out", onComplete: () => idle.restart() });
            gsap.to(flameRef.current, { scaleY: 1, opacity: 1, duration: 0.5, ease: "power2.out" });
            gsap.to(nozzleGlowRef.current, { opacity: 0.6, scale: 1, duration: 0.5, ease: "power2.out" });
        };

        node.addEventListener("mouseenter", onEnter);
        node.addEventListener("mouseleave", onLeave);
        return () => {
            idle.kill();
            boost.kill();
            node.removeEventListener("mouseenter", onEnter);
            node.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    return (
        <div className="test-decor relative flex items-center justify-center [perspective:1100px]">
            {/* wrapperRef: بياخد حركة GSAP بس (translate/rotate/scale).
                الـ <svg> جواه فاضل لوحده ياخد CSS tilt animation (testTilt3d)
                من غير أي تعارض على خاصية transform. */}
            <div ref={wrapperRef} className="will-change-transform">
                <svg
                    ref={rocketRef}
                    className="test-rocket-svg block max-w-[min(72vw,420px)] h-auto"
                    viewBox="0 0 260 460"
                    width="230"
                    height="406"
                    style={{ overflow: "visible" }}
                >
                    <defs>
                        <linearGradient id={bodyGradId} x1="60" y1="0" x2="220" y2="420" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#f4f6f9" />
                            <stop offset="22%" stopColor="var(--color-accent-soft)" />
                            <stop offset="55%" stopColor="var(--color-accent)" />
                            <stop offset="100%" stopColor="var(--color-accent2)" />
                        </linearGradient>
                        <linearGradient id={brushId} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                            <stop offset="8%" stopColor="#ffffff" stopOpacity="0.5" />
                            <stop offset="16%" stopColor="#ffffff" stopOpacity="0" />
                            <stop offset="30%" stopColor="#050510" stopOpacity="0.12" />
                            <stop offset="38%" stopColor="#ffffff" stopOpacity="0" />
                            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.35" />
                            <stop offset="63%" stopColor="#ffffff" stopOpacity="0" />
                            <stop offset="80%" stopColor="#050510" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                        <radialGradient id={shadeId} cx="30%" cy="20%" r="95%">
                            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                            <stop offset="55%" stopColor="#000000" stopOpacity="0" />
                            <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
                        </radialGradient>
                        <radialGradient id={specId} cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id={rimId} x1="60" y1="420" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
                            <stop offset="55%" stopColor="var(--color-accent-soft)" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
                        </linearGradient>
                        <radialGradient id={glassId} cx="34%" cy="30%" r="75%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                            <stop offset="35%" stopColor="var(--color-accent-soft)" stopOpacity="0.55" />
                            <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="0.9" />
                        </radialGradient>
                        <linearGradient id={finId} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="var(--color-accent2)" />
                            <stop offset="100%" stopColor="var(--color-accent)" />
                        </linearGradient>
                        <linearGradient id={nozzleId} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#1c1c26" />
                            <stop offset="18%" stopColor="#4a4a58" />
                            <stop offset="38%" stopColor="#8a8a9a" />
                            <stop offset="52%" stopColor="#c9c9d6" />
                            <stop offset="65%" stopColor="#6c6c7c" />
                            <stop offset="100%" stopColor="#15151d" />
                        </linearGradient>
                        <radialGradient id={flameId} cx="50%" cy="0%" r="100%">
                            <stop offset="0%" stopColor="#fff8dc" />
                            <stop offset="35%" stopColor="var(--color-accent-soft)" />
                            <stop offset="70%" stopColor="var(--color-accent2)" />
                            <stop offset="100%" stopColor="var(--color-accent2)" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id={flameCoreId} cx="50%" cy="0%" r="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="60%" stopColor="#fff3c4" />
                            <stop offset="100%" stopColor="#fff3c4" stopOpacity="0" />
                        </radialGradient>
                        <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation="7" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        {/* فلتر مستقل للهب — منطقة ثابتة بالـ userSpaceOnUse بدل ما تتحسب
                            من bounding box اللهب المتغير الحجم باستمرار */}
                        <filter id={flameGlowId} filterUnits="userSpaceOnUse" x="70" y="280" width="120" height="180">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id={engineGlowId} x="-150%" y="-100%" width="400%" height="320%">
                            <feGaussianBlur stdDeviation="16" />
                        </filter>
                        <filter id={heatId} x="-60%" y="-140%" width="220%" height="380%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.09" numOctaves="2" seed="7" result="heatTurb">
                                <animate attributeName="baseFrequency" values="0.012 0.07;0.02 0.11;0.012 0.07" dur="1.4s" repeatCount="indefinite" />
                            </feTurbulence>
                            <feDisplacementMap in="SourceGraphic" in2="heatTurb" scale="10" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                        <filter id={smokeTurbId} x="-100%" y="-100%" width="300%" height="300%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="3" result="n" />
                            <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0" result="cloud" />
                            <feComposite in="cloud" in2="SourceAlpha" operator="in" />
                            <feGaussianBlur stdDeviation="1.4" />
                        </filter>
                    </defs>

                    <ellipse cx="130" cy="330" rx="60" ry="70" fill="var(--color-accent2)" opacity="0.35" filter={`url(#${engineGlowId})`} />
                    <ellipse ref={nozzleGlowRef} cx="130" cy="316" rx="34" ry="22" fill="#ffedb0" opacity="0.6" filter={`url(#${engineGlowId})`} style={{ transformBox: "fill-box", transformOrigin: "center" }} />

                    <g filter={`url(#${glowId})`}>
                        <line x1="130" y1="18" x2="130" y2="-18" stroke={`url(#${bodyGradId})`} strokeWidth="4" strokeLinecap="round" />
                        <circle className="test-blink" cx="130" cy="-22" r="6" fill="var(--color-accent2)" />
                        <circle cx="130" cy="-22" r="6" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.4" />

                        <path d="M130,18 C176,66 172,190 156,278 L104,278 C88,190 84,66 130,18 Z" fill={`url(#${bodyGradId})`} />
                        <path d="M130,18 C176,66 172,190 156,278 L104,278 C88,190 84,66 130,18 Z" fill={`url(#${brushId})`} opacity="0.55" />
                        <path d="M130,20 C154,60 156,168 148,262 L130,262 L130,18 Z" fill="#050510" opacity="0.16" />
                        <path d="M112,26 C98,72 94,150 100,220 L110,220 C106,150 108,72 118,24 Z" fill="#ffffff" opacity="0.14" />

                        <path d="M96,150 L164,150" stroke="#050510" strokeOpacity="0.18" strokeWidth="2.4" />
                        <path d="M92,196 L168,196" stroke="#050510" strokeOpacity="0.18" strokeWidth="2.4" />
                        <path d="M90,236 L170,236" stroke="#050510" strokeOpacity="0.16" strokeWidth="2" />
                        <path d="M104,90 L156,90" stroke="#050510" strokeOpacity="0.14" strokeWidth="1.6" />
                        {[[100, 150], [160, 150], [98, 196], [162, 196], [102, 90], [158, 90], [96, 236], [164, 236]].map(([cx, cy], i) => (
                            <g key={i}>
                                <circle cx={cx} cy={cy} r="1.9" fill="#e8e8ee" opacity="0.9" />
                                <circle cx={cx} cy={cy} r="1.9" fill="none" stroke="#050510" strokeOpacity="0.4" strokeWidth="0.5" />
                                <circle cx={cx - 0.5} cy={cy - 0.5} r="0.7" fill="#ffffff" opacity="0.8" />
                            </g>
                        ))}

                        <circle cx="130" cy="118" r="30" fill="var(--color-bg)" opacity="0.9" />
                        <circle cx="130" cy="118" r="30" fill={`url(#${glassId})`} />
                        <circle cx="130" cy="118" r="30" fill="none" stroke={`url(#${bodyGradId})`} strokeWidth="6" />
                        <ellipse cx="120" cy="106" rx="9" ry="6" fill="#ffffff" opacity="0.7" transform="rotate(-30 120 106)" />
                        <circle cx="130" cy="118" r="18" fill="none" stroke="#050510" strokeOpacity="0.18" strokeWidth="1.6" />

                        <circle cx="130" cy="176" r="13" fill="var(--color-bg)" opacity="0.85" />
                        <circle cx="130" cy="176" r="13" fill={`url(#${glassId})`} opacity="0.9" />
                        <circle cx="130" cy="176" r="13" fill="none" stroke={`url(#${bodyGradId})`} strokeWidth="3.6" />

                        <path d="M104,232 L34,318 L96,296 Z" fill={`url(#${finId})`} opacity="0.94" />
                        <path d="M156,232 L226,318 L164,296 Z" fill={`url(#${finId})`} opacity="0.94" />
                        <path d="M104,232 L34,318 L70,306 Z" fill="#050510" opacity="0.14" />
                        <path d="M156,232 L226,318 L190,306 Z" fill="#ffffff" opacity="0.1" />
                        <path d="M100,238 L60,300" stroke="#050510" strokeOpacity="0.16" strokeWidth="1.6" />
                        <path d="M160,238 L200,300" stroke="#050510" strokeOpacity="0.16" strokeWidth="1.6" />

                        <rect x="58" y="252" width="17" height="52" rx="6" fill={`url(#${bodyGradId})`} opacity="0.9" />
                        <rect x="185" y="252" width="17" height="52" rx="6" fill={`url(#${bodyGradId})`} opacity="0.9" />
                        <rect x="58" y="252" width="17" height="10" rx="4" fill="#ffffff" opacity="0.25" />
                        <rect x="185" y="252" width="17" height="10" rx="4" fill="#ffffff" opacity="0.25" />

                        <path d="M104,278 L156,278 L146,312 L114,312 Z" fill={`url(#${bodyGradId})`} />
                        <path d="M108,282 L152,282 L145,304 L115,304 Z" fill="#050510" opacity="0.22" />
                        <path d="M112,304 L148,304 L142,326 L118,326 Z" fill={`url(#${nozzleId})`} />
                        <ellipse cx="130" cy="326" rx="15" ry="4.5" fill="#0a0a12" opacity="0.85" />
                        <ellipse cx="130" cy="296" rx="9" ry="9" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.6" />
                    </g>

                    {/* اللهب: برة جروب فلتر جسم الصاروخ تمامًا، وله فلتر مستقل بمنطقة
                        ثابتة (flameGlowId). */}
                    <g
                        ref={flameRef}
                        filter={`url(#${flameGlowId})`}
                        style={{ transformOrigin: "130px 320px", transformBox: "view-box" }}
                    >
                        <path className="test-flame test-flame-outer" d="M110,320 Q130,398 150,320 Q130,370 110,320 Z" fill={`url(#${flameId})`} opacity="0.85" filter={`url(#${heatId})`} />
                        <path className="test-flame test-flame-mid" d="M117,320 Q130,370 143,320 Q130,352 117,320 Z" fill="var(--color-accent2)" opacity="0.7" filter={`url(#${heatId})`} />
                        <path className="test-flame test-flame-inner" d="M122,320 Q130,344 138,320 Q130,334 122,320 Z" fill={`url(#${flameCoreId})`} opacity="0.95" />
                    </g>

                    <g filter={`url(#${smokeTurbId})`}>
                        <circle className="test-smoke test-smoke-1" cx="112" cy="308" r="9" />
                        <circle className="test-smoke test-smoke-2" cx="130" cy="312" r="10" />
                        <circle className="test-smoke test-smoke-3" cx="148" cy="308" r="9" />
                        <circle className="test-smoke test-smoke-4" cx="122" cy="314" r="7" />
                        <circle className="test-smoke test-smoke-5" cx="140" cy="316" r="7" />
                    </g>
                    <circle className="test-spark test-spark-1" cx="120" cy="306" r="2.2" fill="#fff8dc" />
                    <circle className="test-spark test-spark-2" cx="140" cy="306" r="1.9" fill="#ffd9a0" />
                    <circle className="test-spark test-spark-3" cx="130" cy="310" r="1.6" fill="#fff8dc" />
                </svg>
            </div>
        </div>
    );
}