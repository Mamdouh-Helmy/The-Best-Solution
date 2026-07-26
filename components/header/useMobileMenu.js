import { useEffect, useRef, useState } from "react";

// حالة قايمة الموبايل: فتح/قفل، قفل سكرول الصفحة تحتها، قفلها بـ
// Escape (ورجوع الفوكس لزرار الفتح)، وقفلها تلقائيًا لو الشاشة كبرت
// لحجم md وهي لسه فاتحة.
export function useMobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleBtnRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        function onKeyDown(e) {
            if (e.key === "Escape") {
                setIsOpen(false);
                toggleBtnRef.current?.focus();
            }
        }
        const mq = window.matchMedia("(min-width: 768px)");
        function onBreakpointChange(e) {
            if (e.matches) setIsOpen(false);
        }

        window.addEventListener("keydown", onKeyDown);
        mq.addEventListener("change", onBreakpointChange);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
            mq.removeEventListener("change", onBreakpointChange);
        };
    }, [isOpen]);

    return {
        isOpen,
        toggleBtnRef,
        toggle: () => setIsOpen((v) => !v),
        close: () => setIsOpen(false),
    };
}