import { useCallback, useEffect, useRef, useState } from "react";

// كل منطق سلايدر "اسحب للرجوع لفوق" (تتبّع السحب، القص، ودعم
// الكيبورد) معزول هنا لوحده، بعيد عن الـ JSX — وكل الدوال معمولة
// useCallback بديبندنسيز صح، فمحتجناش أي eslint-disable زي الأصل.
export function useTicketSlider(isRTL) {
    const trackRef = useRef(null);
    const progressRef = useRef(0);
    const [progress, setProgress] = useState(0); // 0..1
    const [trackWidth, setTrackWidth] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [tearing, setTearing] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        function measure() {
            if (trackRef.current) setTrackWidth(trackRef.current.getBoundingClientRect().width);
        }
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    const setProgressBoth = useCallback((p) => {
        progressRef.current = p;
        setProgress(p);
    }, []);

    const progressFromClientX = useCallback(
        (clientX) => {
            const el = trackRef.current;
            if (!el) return 0;
            const rect = el.getBoundingClientRect();
            const raw = isRTL ? (rect.right - clientX) / rect.width : (clientX - rect.left) / rect.width;
            return Math.min(1, Math.max(0, raw));
        },
        [isRTL]
    );

    const triggerTear = useCallback(() => {
        setProgressBoth(1);
        setTearing(true);
        const reduceMotion =
            typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        window.setTimeout(
            () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }),
            reduceMotion ? 0 : 220
        );
        window.setTimeout(
            () => {
                setTearing(false);
                setProgressBoth(0);
            },
            reduceMotion ? 60 : 850
        );
    }, [setProgressBoth]);

    const handlePointerDown = useCallback(
        (e) => {
            e.preventDefault();
            setHasInteracted(true);
            setDragging(true);
            setProgressBoth(progressFromClientX(e.clientX));
        },
        [progressFromClientX, setProgressBoth]
    );

    useEffect(() => {
        if (!dragging) return;

        function onMove(e) {
            setProgressBoth(progressFromClientX(e.clientX));
        }
        function onUp() {
            setDragging(false);
            if (progressRef.current >= 0.8) triggerTear();
            else setProgressBoth(0);
        }

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onUp);
        };
    }, [dragging, progressFromClientX, setProgressBoth, triggerTear]);

    const handleKeyDown = useCallback(
        (e) => {
            const forwardKey = isRTL ? "ArrowLeft" : "ArrowRight";
            const backwardKey = isRTL ? "ArrowRight" : "ArrowLeft";

            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setHasInteracted(true);
                triggerTear();
            } else if (e.key === forwardKey) {
                e.preventDefault();
                setHasInteracted(true);
                const next = Math.min(1, progressRef.current + 0.18);
                setProgressBoth(next);
                if (next >= 0.98) triggerTear();
            } else if (e.key === backwardKey) {
                e.preventDefault();
                setProgressBoth(Math.max(0, progressRef.current - 0.18));
            }
        },
        [isRTL, setProgressBoth, triggerTear]
    );

    return {
        trackRef,
        progress,
        trackWidth,
        dragging,
        tearing,
        hasInteracted,
        handlePointerDown,
        handleKeyDown,
    };
}