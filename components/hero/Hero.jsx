"use client";

import { useEffect, useState } from "react";
import "./hero.css";
import HeroSky from "./HeroSky";
import Hero3DTitle from "./Hero3DTitle";
import CodeCube from "./CodeCube";
import BlobButton from "@/components/ui/BlobButton";
import { HighlightMark, PointerArrow, UnderlineLastWord } from "@/components/ui/TextMarks";
import { useLanguage } from "@/context/LanguageContext";

function Subtitle({ text }) {
    return <UnderlineLastWord text={text} className="font-body text-lg max-w-xl text-muted leading-8" />;
}

export default function Hero() {
    const { t, lang } = useLanguage();
    const isRtl = lang !== "en";

    // null until the fetch resolves — the translation strings below act
    // as the fallback both while loading and if the admin never set an
    // active hero entry, so there's no flash of empty content.
    const [content, setContent] = useState(null);

    useEffect(() => {
        let cancelled = false;

        fetch("/api/hero")
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
    const eyebrow = content ? content.eyebrow[activeLang] : t("hero.eyebrow");
    const subtitle = content ? content.subtitle[activeLang] : t("hero.subtitle");
    // undefined when there's no admin content yet — Hero3DTitle falls
    // back to its own default TITLE_TEXT in that case.
    const title = content?.title;

    return (
        <section className="relative min-h-[94vh] flex items-center">
            <div className="absolute inset-0 overflow-hidden">
                <HeroSky />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 w-full">
                <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
                    <div className="flex flex-col items-center md:items-start text-center md:text-right gap-5">
                        <div className="relative inline-block hero-in hero-in-1">
                            <span className="eyebrow relative z-10">
                                <HighlightMark>{eyebrow}</HighlightMark>
                            </span>
                            <PointerArrow flip={!isRtl} />
                        </div>

                        <div className="hero-in hero-in-2">
                            <Hero3DTitle title={title} />
                        </div>

                        <div className="hero-in hero-in-3">
                            <Subtitle text={subtitle} />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-5 mt-3 hero-in hero-in-4">
                            <BlobButton variant="solid">{t("hero.cta")}</BlobButton>
                            <BlobButton variant="outline">{t("hero.testimonial")}</BlobButton>
                        </div>
                    </div>

                    <div className="flex items-start justify-center pt-2 hero-card-in">
                        <CodeCube />
                    </div>
                </div>
            </div>
        </section>
    );
}
