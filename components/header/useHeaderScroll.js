import { useEffect, useState } from "react";

// ظل/بوردر الهيدر لما الصفحة تتسكرول. passive listener + throttle
// بـ rAF عشان منعملش setState على كل px سكرول.
export function useHeaderScroll() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        let ticking = false;
        function update() {
            setIsScrolled(window.scrollY > 8);
            ticking = false;
        }
        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return isScrolled;
}