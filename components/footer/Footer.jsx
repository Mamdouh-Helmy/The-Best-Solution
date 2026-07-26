"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import JourneyChart from "./JourneyChart";
import TicketSlider from "./TicketSlider";
import FooterStubBody from "./FooterStubBody";
import "./footer.css";

export default function Footer() {
    const { t, isRTL } = useLanguage();
    const rawId = useId();
    const uid = rawId.replace(/:/g, "");

    const sectionRef = useRef(null);
    const [active, setActive] = useState(false);
    const [socials, setSocials] = useState([]);

    useEffect(() => {
        let cancelled = false;
        fetch("/api/social", { cache: "no-store" })
            .then((res) => (res.ok ? res.json() : { items: [] }))
            .then((data) => {
                if (!cancelled) setSocials(data.items || []);
            })
            .catch(() => { });
        return () => {
            cancelled = true;
        };
    }, []);

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
            rootMargin: "0px 0px -10% 0px",
        });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const year = new Date().getFullYear();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    return (
        <footer id="footer" ref={sectionRef} className={`ftr-section ${active ? "is-active" : ""}`}>
            <JourneyChart uid={uid} isRTL={isRTL} t={t} />

            <div className="ftr-stub" dir={isRTL ? "rtl" : "ltr"}>
                <TicketSlider isRTL={isRTL} t={t} />
                <FooterStubBody active={active} t={t} year={year} socials={socials} siteUrl={siteUrl} />
            </div>
        </footer>
    );
}