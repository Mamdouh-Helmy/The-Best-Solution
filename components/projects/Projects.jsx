"use client";

import { useEffect, useId, useMemo, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HighlightMark, PointerArrow, UnderlineLastWord } from "@/components/ui/TextMarks";
import { useLanguage } from "@/context/LanguageContext";

import "./projects.css";
import { buildSlides, mapApiProjects } from "./data";
import { tr } from "./utils";
import { DECOR_COMPONENTS } from "./decor";
import EditorCard from "./EditorCard";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Projects() {
    const { t, isRTL, lang } = useLanguage();
    const rawId = useId();
    const uid = rawId.replace(/:/g, "");

    const sectionRef = useRef(null);
    const stageRef = useRef(null);
    const trackRef = useRef(null);
    const slideRefs = useRef([]);

    slideRefs.current = [];
    const registerSlide = (el) => {
        if (el && !slideRefs.current.includes(el)) slideRefs.current.push(el);
    };

    const [rawProjects, setRawProjects] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetch("/api/projects", { cache: "no-store" })
            .then((res) => (res.ok ? res.json() : { items: [] }))
            .then((data) => {
                if (!cancelled) setRawProjects(data.items || []);
            })
            .catch(() => {})
            .finally(() => {
                if (!cancelled) setLoaded(true);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const PROJECTS = useMemo(() => mapApiProjects(rawProjects, lang), [rawProjects, lang]);
    const SLIDES = useMemo(() => buildSlides(PROJECTS), [PROJECTS]);

    const handleCardMove = useCallback((e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;

        card.style.setProperty("--tilt-x", `${(px - 0.5) * 10}deg`);
        card.style.setProperty("--tilt-y", `${(0.5 - py) * 8}deg`);
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
    }, []);

    const handleCardLeave = useCallback((e) => {
        const card = e.currentTarget;
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
    }, []);

    useEffect(() => {
        const stage = stageRef.current;
        const track = trackRef.current;

        if (!stage || !track || SLIDES.length === 0) return;

        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion) {
            stage.classList.add("proj-stage-static");
            return;
        }

        const ctx = gsap.context(() => {
            let distance = 0;
            let stageWidth = 0;
            let slideMeta = [];

            const measure = () => {
                const firstEl = slideRefs.current[0];
                const lastEl = slideRefs.current[slideRefs.current.length - 1];
                stageWidth = stage.clientWidth;

                if (firstEl && lastEl) {
                    const firstPad = Math.max(0, (stageWidth - firstEl.offsetWidth) / 2);
                    const lastPad = Math.max(0, (stageWidth - lastEl.offsetWidth) / 2);
                    track.style.paddingInlineStart = `${firstPad}px`;
                    track.style.paddingInlineEnd = `${lastPad}px`;
                }

                slideMeta = slideRefs.current.map((el) => ({
                    el,
                    center: el.offsetLeft + el.offsetWidth / 2,
                }));

                distance = Math.max(0, track.scrollWidth - stage.clientWidth);
                return distance;
            };

            const applyCoverflow = (currentX) => {
                const stageHalf = stageWidth / 2;
                if (!stageHalf) return;
                slideMeta.forEach(({ el, center }) => {
                    const screenCenter = center + currentX;
                    let delta = (screenCenter - stageHalf) / stageHalf;
                    delta = Math.max(-1.4, Math.min(1.4, delta));
                    const absD = Math.abs(delta);
                    gsap.set(el, {
                        scale: 1 - absD * 0.22,
                        opacity: 1 - absD * 0.55,
                        filter: `blur(${absD * 3.5}px)`,
                        y: absD * 18,
                    });
                });
            };

            measure();
            applyCoverflow(0);

            const tween = gsap.to(track, {
                x: () => -distance,
                ease: "none",
                scrollTrigger: {
                    trigger: stage,
                    start: "top top",
                    end: () => `+=${measure()}`,
                    scrub: 0.6,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        applyCoverflow(-distance * self.progress);
                    },
                },
            });

            const ro = new ResizeObserver(() => {
                ScrollTrigger.refresh();
            });
            ro.observe(track);

            const onWindowResize = () => ScrollTrigger.refresh();
            window.addEventListener("resize", onWindowResize);

            return () => {
                ro.disconnect();
                window.removeEventListener("resize", onWindowResize);
                tween.scrollTrigger?.kill();
                tween.kill();
            };
        }, sectionRef);

        return () => ctx.revert();
    }, [SLIDES]);

    // ===== NEW: تحديث كل ScrollTriggers في الصفحة (بما فيها بتوع
    // Testimonials وأي سيكشن تاني بعدنا) بعد ما بيانات المشاريع توصل
    // ويتغير ارتفاع السيكشن فعليًا في الـ DOM. من غير الـ refresh ده،
    // أي سيكشن اتحسبت مقاساته وهو لسه في حالة loading/empty (ارتفاع
    // صغير) هتفضل حاسبة على أساس المقاس الغلط ده، وده اللي بيسبب
    // التراكب/الظهور المبكر بتاع Testimonials جوه مساحة Projects. =====
    useEffect(() => {
        if (!loaded) return;

        // فريمين رندر عشان نضمن إن الـ DOM اتحدّث فعليًا (الصور جوه
        // EditorCard كمان ممكن تغيّر الارتفاع لما تحمّل)، بعدين refresh.
        const raf1 = requestAnimationFrame(() => {
            const raf2 = requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
            return () => cancelAnimationFrame(raf2);
        });

        // تأمين إضافي: refresh تاني بعد شوية وقت (لو فيه صور لسه
        // بتحمّل وبتغيّر الارتفاع بعد الـ raf المبدئي).
        const t1 = setTimeout(() => ScrollTrigger.refresh(), 150);
        const t2 = setTimeout(() => ScrollTrigger.refresh(), 500);

        return () => {
            cancelAnimationFrame(raf1);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [loaded, SLIDES]);

    // ===== NEW: refresh عام بعد ما الصفحة كلها (فونتات/صور/خطوط)
    // تخلص تحميل — تأمين نهائي ضد أي اختلاف مقاسات بسبب الـ web fonts
    // اللي بتغيّر ارتفاع النصوص بعد ما تحمّل. =====
    useEffect(() => {
        if (typeof window === "undefined") return;

        const onLoad = () => ScrollTrigger.refresh();

        if (document.readyState === "complete") {
            onLoad();
        } else {
            window.addEventListener("load", onLoad);
        }

        return () => window.removeEventListener("load", onLoad);
    }, []);

    // ===== دالة مساعدة للترجمة الآمنة =====
    const safeTr = (key, fallback) => {
        const result = tr(t, key, fallback);
        // التأكد أن النتيجة نص وليس كائن
        if (typeof result === 'string') return result;
        if (typeof result === 'object' && result !== null) {
            // إذا كانت النتيجة كائن، حاول استخراج القيمة المناسبة
            return result[lang] || result.ar || fallback || key;
        }
        return fallback || key;
    };

    // ===== حالة التحميل =====
    if (!loaded) {
        return (
            <section id="projects" ref={sectionRef} className="proj-section">
                <div className="proj-header">
                    <div className="relative inline-block">
                        <span className="eyebrow relative z-10">
                            <HighlightMark>{safeTr("projects.eyebrow", "أعمالنا")}</HighlightMark>
                        </span>
                        <PointerArrow flip={!isRTL} />
                    </div>

                    <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
                        {safeTr("projects.title", "مشاريع اتبنت بعناية")}
                    </h2>

                    <UnderlineLastWord
                        text={safeTr("projects.body", "كل مشروع رحلة لوحده — من الفكرة لحد ما يشتغل بين إيدين العميل")}
                        className="font-body text-lg max-w-lg text-muted leading-8"
                    />
                </div>

                <div className="proj-loading-wrap">
                    <div className="proj-loading-spinner" />
                    <span className="proj-loading-text font-mono text-sm text-muted">
                        {safeTr("projects.loading", "جاري تحميل المشاريع...")}
                    </span>
                </div>
            </section>
        );
    }

    // ===== حالة عدم وجود مشاريع =====
    if (SLIDES.length === 0) {
        return (
            <section id="projects" ref={sectionRef} className="proj-section">
                <div className="proj-header">
                    <div className="relative inline-block">
                        <span className="eyebrow relative z-10">
                            <HighlightMark>{safeTr("projects.eyebrow", "أعمالنا")}</HighlightMark>
                        </span>
                        <PointerArrow flip={!isRTL} />
                    </div>

                    <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
                        {safeTr("projects.title", "مشاريع اتبنت بعناية")}
                    </h2>

                    <UnderlineLastWord
                        text={safeTr("projects.body", "كل مشروع رحلة لوحده — من الفكرة لحد ما يشتغل بين إيدين العميل")}
                        className="font-body text-lg max-w-lg text-muted leading-8"
                    />
                </div>

                <div className="proj-empty-wrap">
                    <div className="proj-empty-card">
                        <div className="proj-titlebar">
                            <div className="proj-traffic" aria-hidden="true">
                                <span className="proj-tf-dot proj-tf-red" />
                                <span className="proj-tf-dot proj-tf-yellow" />
                                <span className="proj-tf-dot proj-tf-green" />
                            </div>
                            <div className="proj-tab">
                                <span className="proj-tab-icon proj-empty-icon" />
                                <span className="proj-tab-name">coming-soon.tsx</span>
                                <span className="proj-tab-unsaved" />
                            </div>
                        </div>

                        <div className="proj-editor-body proj-empty-body">
                            <div className="proj-gutter" aria-hidden="true">
                                {[1, 2, 3].map((n) => (
                                    <span key={n}>{n}</span>
                                ))}
                            </div>
                            <div className="proj-editor-main proj-empty-main">
                                <p className="proj-comment proj-empty-comment">
                                    <span>// {safeTr("projects.empty", "المشاريع هتظهر هنا قريب")}</span>
                                    <span className="proj-empty-cursor" aria-hidden="true" />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // ===== حالة وجود مشاريع =====
    return (
        <section id="projects" ref={sectionRef} className="proj-section">
            <div className="proj-header">
                <div className="relative inline-block">
                    <span className="eyebrow relative z-10">
                        <HighlightMark>{safeTr("projects.eyebrow", "أعمالنا")}</HighlightMark>
                    </span>
                    <PointerArrow flip={!isRTL} />
                </div>

                <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
                    {safeTr("projects.title", "مشاريع اتبنت بعناية")}
                </h2>

                <UnderlineLastWord
                    text={safeTr("projects.body", "كل مشروع رحلة لوحده — من الفكرة لحد ما يشتغل بين إيدين العميل")}
                    className="font-body text-lg max-w-lg text-muted leading-8"
                />
            </div>

            <div className="proj-stage" ref={stageRef} dir="ltr">
                <div className="proj-track" ref={trackRef}>
                    {SLIDES.map((slide) => {
                        if (slide.type === "project") {
                            return (
                                <div className="proj-slide" key={slide.key} ref={registerSlide}>
                                    <div
                                        className="proj-tilt"
                                        onMouseMove={handleCardMove}
                                        onMouseLeave={handleCardLeave}
                                    >
                                        <EditorCard project={slide.data} index={slide.projectIndex} t={t} />
                                    </div>
                                </div>
                            );
                        }
                        const DecorComponent = DECOR_COMPONENTS[slide.type];
                        return (
                            <div className="proj-slide" key={slide.key} ref={registerSlide}>
                                <DecorComponent uid={uid} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}