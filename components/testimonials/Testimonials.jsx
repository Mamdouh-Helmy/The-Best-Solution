"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HighlightMark, PointerArrow, UnderlineLastWord } from "@/components/ui/TextMarks";
import { useLanguage } from "@/context/LanguageContext";

import "./testimonials.css";
import { buildSlides, mapApiTestimonials } from "./data";
import { tr } from "./utils";
import { DECOR_COMPONENTS } from "./decor";
import { watchLayoutShifts } from "@/lib/scrollTriggerRefresh";
import BestStarDecor from "./BestStarDecor";
import TestimonialCard from "./TestimonialCard";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const MOUNT_WINDOW = 1;
const SCROLL_VH_PER_SLIDE = 160;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function DecorSlide({ decorType, uid, index }) {
    const DecorComponent = DECOR_COMPONENTS[decorType];
    return (
        <div className="flex justify-center py-8">
            <div>
                <DecorComponent uid={uid} index={index} />
            </div>
        </div>
    );
}

export default function Testimonials() {
    const { t, isRTL, lang } = useLanguage();
    const rawId = useId();
    const uid = rawId.replace(/:/g, "");

    const sectionRef = useRef(null);
    const bestBadgeRef = useRef(null);
    const wrapRef = useRef(null);
    const stageRef = useRef(null);
    const slideRefs = useRef([]);
    const activeIndexRef = useRef(-1);
    const pinInitedRef = useRef(false);
    const [active, setActive] = useState(false);
    const [readyToPin, setReadyToPin] = useState(false);
    const [staticMode, setStaticMode] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);

    // ===== NEW: نفس نمط الجلب الموجود في Projects.jsx =====
    const [rawTestimonials, setRawTestimonials] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetch("/api/testimonials", { cache: "no-store" })
            .then((res) => (res.ok ? res.json() : { items: [] }))
            .then((data) => {
                if (!cancelled) setRawTestimonials(data.items || []);
            })
            .catch(() => {})
            .finally(() => {
                if (!cancelled) setLoaded(true);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const TESTIMONIALS = useMemo(
        () => mapApiTestimonials(rawTestimonials, lang),
        [rawTestimonials, lang]
    );
    const SLIDES = useMemo(() => buildSlides(TESTIMONIALS), [TESTIMONIALS]);

    slideRefs.current = [];
    const registerSlide = (el) => {
        if (el && !slideRefs.current.includes(el)) slideRefs.current.push(el);
    };

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
            setActive(true);
            return;
        }
        const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
            threshold: 0,
            rootMargin: "30% 0px 30% 0px",
        });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // ===== NEW: readyToPin دلوقتي بيستنى الداتا الحقيقية توصل (loaded)
    // *و* يكون فيه سلايدات فعلاً (SLIDES.length > 0)، مش بس "active".
    // ده بيمنع أي محاولة لعمل pin بينما الـ DOM لسه في حالة loading/empty
    // (ومفيش refs أصلاً)، وبيضمن إن أول مرة الـ pin يتعمل فيها يكون على
    // المقاسات النهائية الصح. زي readyToPin القديم، هو بيتحول true مرة
    // واحدة بس وميرجعش false تاني. =====
    useEffect(() => {
        if (active && loaded && SLIDES.length > 0) setReadyToPin(true);
    }, [active, loaded, SLIDES.length]);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const ctx = gsap.context(() => {
            if (reduceMotion) {
                gsap.set([bestBadgeRef.current].filter(Boolean), { opacity: 1, scale: 1, y: 0 });
                return;
            }
            if (bestBadgeRef.current) {
                gsap.fromTo(
                    bestBadgeRef.current,
                    { opacity: 0, scale: 0.6, y: 10 },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 0.8,
                        delay: 0.3,
                        ease: "back.out(1.6)",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 75%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // ===== إصلاح "الخط بيتلخبط عند السكرول" =====
    // كان فيه ScrollTrigger.refresh() يدوي هنا (قبل إنشاء الـ pin
    // مباشرة) بيتنفذ لوحده من غير تنسيق مع أي سيكشن تاني (زي Contact)
    // بيراقب طول الصفحة كمان. الاتنين مع بعض كانوا بيعملوا refresh في
    // لحظات قريبة من بعض بس مش منسقين، وده كان بيسيب حسابات الـ
    // ScrollTrigger في حالة غير متسقة أحيانًا حسب توقيت التحميل بالظبط.
    // watchLayoutShifts() بيستبدل الاستدعاء اليدوي ده بمراقب مشترك —
    // أي تغيير في طول الصفحة (من هنا أو من أي سيكشن تاني) بيعمل
    // refresh واحد منسّق، مش استدعاءات متفرقة.
    useEffect(() => {
        if (!readyToPin || pinInitedRef.current) return;

        const wrapEl = wrapRef.current;
        const stageEl = stageRef.current;
        // لو لسه في حالة loading/empty، الـ refs دول مش موجودين في الـ
        // DOM أصلاً (الـ JSX بتاعهم مش متركب). الـ effect بيرجع من غير
        // ما يعلّم pinInitedRef، فلما SLIDES تتغيّر تاني (لما الداتا
        // توصل فعليًا) الـ effect هيتنفذ تاني ويلاقي الـ refs موجودة.
        if (!wrapEl || !stageEl) return;

        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const slides = slideRefs.current;
        if (!slides.length) return;

        pinInitedRef.current = true;

        if (reduceMotion) {
            setStaticMode(true);
            gsap.set(slides, { clearProps: "all" });
            return;
        }

        setStaticMode(false);

        const setInitial = (slide, meta) => {
            if (meta.type !== "card") return;
            const fromXPercent = meta.item.side === "left" ? -150 : 150;
            const fromRotate = meta.item.side === "left" ? -10 : 10;
            gsap.set(slide, { xPercent: fromXPercent, rotate: fromRotate, scale: 0.5, opacity: 0, filter: "blur(6px)" });
        };

        gsap.set(slides, { visibility: "hidden", pointerEvents: "none" });
        slides.forEach((slide, i) => setInitial(slide, SLIDES[i]));

        const cameraKick = () => {
            gsap.fromTo(
                stageEl,
                { scale: 1.035 },
                { scale: 1, duration: 0.7, ease: "power3.out" }
            );
        };

        const showSlide = (index) => {
            const slide = slides[index];
            const meta = SLIDES[index];
            if (!slide) return;
            cameraKick();
            if (meta.type !== "card") return;
            gsap.killTweensOf(slide);
            gsap.set(slide, { visibility: "visible", pointerEvents: "auto", zIndex: 2 });
            const fromXPercent = meta.item.side === "left" ? -150 : 150;
            const fromRotate = meta.item.side === "left" ? -10 : 10;
            const tl = gsap.timeline();
            tl.to(slide, {
                opacity: 1,
                xPercent: fromXPercent * 0.3,
                rotate: fromRotate * 0.3,
                scale: 0.8,
                filter: "blur(2px)",
                duration: 0.4,
                ease: "power2.out",
            })
                .to(slide, {
                    xPercent: 0,
                    rotate: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 0.7,
                    ease: "back.out(1.5)",
                }, "-=0.05");
        };

        const hideSlide = (index) => {
            const slide = slides[index];
            const meta = SLIDES[index];
            if (!slide || meta.type !== "card") return;
            gsap.killTweensOf(slide);
            gsap.to(slide, {
                opacity: 0,
                scale: 0.94,
                filter: "blur(5px)",
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => gsap.set(slide, { visibility: "hidden", pointerEvents: "none" }),
            });
        };

        const denom = SLIDES.length - 1 || 1;

        const updateDecorFrame = (progress) => {
            SLIDES.forEach((meta, i) => {
                if (meta.type !== "decor") return;
                const slide = slides[i];
                if (!slide) return;

                const prevPoint = (i - 1) / denom;
                const nextPoint = (i + 1) / denom;
                const span = nextPoint - prevPoint || 1;
                const t = clamp01((progress - prevPoint) / span);

                const closeness = Math.sin(t * Math.PI);
                const eased = closeness * closeness;

                const revealT = clamp01((t - 0.28) / (0.72 - 0.28));
                const reveal = Math.sin(revealT * Math.PI);

                if (meta.decorType === "rocket") {
                    const travel = 210;
                    const y = travel - t * travel * 2;
                    const jitter = Math.sin(progress * 260) * 0.6;
                    const tilt = -6 + t * 10 + jitter;
                    const scale = 0.86 + eased * 0.14;

                    gsap.set(slide, {
                        y,
                        rotate: tilt,
                        scale,
                        opacity: reveal,
                        visibility: reveal > 0.02 ? "visible" : "hidden",
                        pointerEvents: "none",
                        zIndex: 1,
                        force3D: false,
                    });
                } else {
                    const scale = 0.62 + eased * 0.38;
                    const yShift = (1 - eased) * 26 - 10;
                    const rotateZ = -4 + eased * 6;

                    gsap.set(slide, {
                        y: yShift,
                        scale,
                        rotate: rotateZ,
                        opacity: reveal,
                        visibility: reveal > 0.02 ? "visible" : "hidden",
                        pointerEvents: "none",
                        zIndex: 1,
                        force3D: false,
                    });
                }
            });
        };

        activeIndexRef.current = -1;

        const st = ScrollTrigger.create({
            trigger: wrapEl,
            start: "top top",
            end: "bottom bottom",
            pin: stageEl,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: false,
            snap: 1 / (slides.length - 1 || 1),
            onUpdate: (self) => {
                updateDecorFrame(self.progress);

                const idx = Math.min(
                    slides.length - 1,
                    Math.max(0, Math.round(self.progress * (slides.length - 1)))
                );
                if (idx !== activeIndexRef.current) {
                    hideSlide(activeIndexRef.current);
                    showSlide(idx);
                    activeIndexRef.current = idx;
                    setActiveIdx(idx);
                }
            },
        });

        updateDecorFrame(st.progress);
        const initialIdx = Math.min(
            slides.length - 1,
            Math.max(0, Math.round(st.progress * (slides.length - 1)))
        );
        showSlide(initialIdx);
        activeIndexRef.current = initialIdx;
        setActiveIdx(initialIdx);

        const stopWatching = watchLayoutShifts(ScrollTrigger);

        return () => {
            st.kill();
            stopWatching();
        };
    }, [readyToPin, SLIDES]);

    // ===== NEW: نفس دالة الترجمة الآمنة الموجودة في Projects.jsx =====
    const safeTr = (key, fallback) => {
        const result = tr(t, key, fallback);
        if (typeof result === "string") return result;
        if (typeof result === "object" && result !== null) {
            return result[lang] || result.ar || fallback || key;
        }
        return fallback || key;
    };

    const header = (
        <div className="test-header relative z-[2] flex flex-col items-center gap-[1.1rem] max-w-[42rem] mx-auto text-center px-6 mb-16">
            <div className="relative inline-block">
                <span className="eyebrow relative z-10">
                    <HighlightMark>{safeTr("testimonials.eyebrow", "آراء العملاء")}</HighlightMark>
                </span>
                <PointerArrow flip={!isRTL} />
            </div>

            <div className="relative inline-block">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
                    {safeTr("testimonials.title", "عملاء وثقوا فينا")}
                </h2>

                <div
                    className={`test-best-badge absolute top-[-5.8rem] flex items-end gap-[0.35rem] pointer-events-none max-[900px]:static max-[900px]:mt-[0.9rem] max-[900px]:justify-center ${isRTL ? "start-[10rem]" : "end-[-12.2rem]"}`}
                    ref={bestBadgeRef}
                >
                    <BestStarDecor uid={uid} />
                    <svg className="test-best-arrow flex-none mb-[0.6rem]" viewBox="0 0 130 84" width="104" height="68" style={{ overflow: "visible" }}>
                        <defs>
                            <linearGradient id={`test-arrow-grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="var(--color-accent-soft)" />
                                <stop offset="100%" stopColor="var(--color-accent2)" />
                            </linearGradient>
                            <marker id={`test-arrow-head-${uid}`} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse">
                                <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-accent2)" />
                            </marker>
                        </defs>
                        <path
                            className="test-arrow-draw"
                            d="M8,66 C42,74 66,30 118,12"
                            fill="none"
                            stroke={`url(#test-arrow-grad-${uid})`}
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            markerEnd={`url(#test-arrow-head-${uid})`}
                        />
                    </svg>
                    <span className="test-best-text font-mono text-[0.72rem] tracking-[0.05em] text-accent2 whitespace-nowrap [transform:rotate(-4deg)] mb-[4.9rem]">
                        {safeTr("testimonials.bestSolution", "The Best Solution")}
                    </span>
                </div>
            </div>

            <UnderlineLastWord
                text={safeTr("testimonials.body", "مش بنسمعها منا احنا — دي كلمة العملاء اللي شافوا الفرق بنفسهم")}
                className="font-body text-lg max-w-lg text-muted leading-8"
            />
        </div>
    );

    // ===== حالة التحميل =====
    if (!loaded) {
        return (
            <section id="testimonial" ref={sectionRef} className="test-section relative z-[1] py-24 overflow-hidden bg-transparent">
                {header}
                <div className="flex flex-col items-center justify-center gap-6 py-16">
                    <div className="h-10 w-10 rounded-full border-[3px] border-line border-t-accent animate-spin" />
                    <span className="font-mono text-sm text-muted">
                        {safeTr("testimonials.loading", "جاري تحميل آراء العملاء...")}
                    </span>
                </div>
            </section>
        );
    }

    // ===== حالة عدم وجود آراء =====
    if (SLIDES.length === 0) {
        return (
            <section id="testimonial" ref={sectionRef} className="test-section relative z-[1] py-24 overflow-hidden bg-transparent">
                {header}
                <div className="flex items-center justify-center px-6 py-16">
                    <div className="w-full max-w-md rounded-2xl border border-line bg-panel p-8 text-center">
                        <p className="font-mono text-sm text-muted">
                            // {safeTr("testimonials.empty", "آراء العملاء هتظهر هنا قريب")}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // ===== حالة وجود آراء =====
    return (
        <section id="testimonial" ref={sectionRef} className={`test-section relative z-[1] py-24 overflow-hidden bg-transparent ${active ? "is-active" : ""}`}>
            {header}

            <div
                className={`test-scroll-wrap relative z-[2] ${staticMode ? "h-auto" : ""}`}
                ref={wrapRef}
                style={!staticMode ? { height: `${SLIDES.length * SCROLL_VH_PER_SLIDE}vh` } : undefined}
            >
                <div
                    className={
                        staticMode
                            ? "static h-auto overflow-visible flex flex-col items-center justify-center"
                            : "relative h-screen w-full overflow-hidden flex items-center justify-center [transform-origin:50%_50%]"
                    }
                    ref={stageRef}
                    dir="ltr"
                >
                    {SLIDES.map((slide, i) => {
                        const withinMountWindow = staticMode || Math.abs(i - activeIdx) <= MOUNT_WINDOW;

                        return (
                            <div
                                key={slide.key}
                                ref={registerSlide}
                                className={
                                    staticMode
                                        ? "static opacity-100 visible pointer-events-auto flex items-center justify-center px-[max(4vw,1.5rem)] py-8"
                                        : "absolute inset-0 flex items-center justify-center px-[max(4vw,1.5rem)] py-8 opacity-0 invisible pointer-events-none first:opacity-100 first:visible first:pointer-events-auto [will-change:transform,opacity,filter]"
                                }
                            >
                                {slide.type === "card" ? (
                                    <div className="flex w-full justify-center">
                                        <TestimonialCard item={slide.item} t={t} />
                                    </div>
                                ) : withinMountWindow ? (
                                    <DecorSlide decorType={slide.decorType} uid={uid} index={slide.index} />
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}