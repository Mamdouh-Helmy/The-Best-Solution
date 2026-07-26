"use client";

import { useEffect, useState } from "react";
import AboutPlanet from "./AboutPlanet";
import AboutSky from "./AboutSky";
import { HighlightMark, PointerArrow, UnderlineLastWord } from "@/components/ui/TextMarks";
import { useLanguage } from "@/context/LanguageContext";
import { DEFAULT_STATS } from "./data";

export default function About() {
    const { t, lang, isRTL } = useLanguage();

    // null until the fetch resolves — the translation strings + DEFAULT_STATS
    // below act as the fallback both while loading and if the admin never
    // set an active About entry yet, so there's no flash of empty content.
    // Same pattern as the Hero section.
    const [content, setContent] = useState(null);

    useEffect(() => {
        let cancelled = false;

        fetch("/api/about")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!cancelled && data?.item) setContent(data.item);
            })
            .catch(() => {
                // silently keep the translation fallback on network/API errors
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const activeLang = lang === "ar" ? "ar" : "en";
    const eyebrow = content ? content.eyebrow[activeLang] : t("about.eyebrow");
    const title = content ? content.title[activeLang] : t("about.title");
    const body = content ? content.body[activeLang] : t("about.body");
    const stats = content?.stats?.length
        ? content.stats.map((s) => ({ value: s.value, label: s.label[activeLang] }))
        : DEFAULT_STATS;

    return (
        <section id="about" className="relative px-6 py-10 md:py-32 overflow-hidden">
            <AboutSky />

            <div className="relative mx-auto max-w-6xl">
                <div className="grid md:grid-cols-[1fr_1.1fr] gap-14 items-center">
                    <div className="order-1 md:order-2">
                        <AboutPlanet stats={stats} />
                    </div>

                    <div className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-start gap-5">
                        <div className="relative inline-block">
                            <span className="eyebrow relative z-10">
                                <HighlightMark>{eyebrow}</HighlightMark>
                            </span>
                            <PointerArrow flip={!isRTL} />
                        </div>

                        <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
                            {title}
                        </h2>

                        <UnderlineLastWord
                            text={body}
                            className="font-body text-lg max-w-lg text-muted leading-8"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}