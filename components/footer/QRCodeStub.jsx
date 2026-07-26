// components/sections/Footer/QRCodeStub.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

// QR صغير في الفوتر — بيفتح popup فيه نسخة كبيرة قابلة للمسح فعليًا
// (الـ QR الصغير غالبًا صعب المسح منه على الشاشة، فالفكرة إن المستخدم
// يدوس عليه يكبر). الإغلاق: بالضغط برّه، بزرار X، أو بـ Escape.
export default function QRCodeStub({ url, label }) {
    const [open, setOpen] = useState(false);
    const closeBtnRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        function onKey(e) {
            if (e.key === "Escape") setOpen(false);
        }
        window.addEventListener("keydown", onKey);
        closeBtnRef.current?.focus();
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    if (!url) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="ftr-qr-trigger"
                aria-label={label || "Scan QR code"}
            >
                <QRCodeSVG value={url} size={30} bgColor="transparent" fgColor="currentColor" level="M" />
            </button>

            {open && (
                <div className="ftr-qr-overlay" onClick={() => setOpen(false)}>
                    <div className="ftr-qr-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            ref={closeBtnRef}
                            type="button"
                            className="ftr-qr-close"
                            onClick={() => setOpen(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <div className="ftr-qr-modal-code">
                            <QRCodeSVG value={url} size={220} bgColor="#ffffff" fgColor="#0f1115" level="M" includeMargin />
                        </div>

                        <p className="ftr-qr-modal-label">{label || "امسح الكود لزيارة الموقع"}</p>
                        <p className="ftr-qr-modal-url" dir="ltr">
                            {url}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}