// components/admin/AdminTopbar.jsx
"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "./NotificationBell";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

function MenuIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
    );
}

function ChevronIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function AdminAvatar({ admin }) {
    const initial = admin?.username ? admin.username[0].toUpperCase() : "?";
    const imageUrl = admin?.image?.url;

    return (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-accent)] font-body text-xs font-bold text-white">
            {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={admin?.name || admin?.username || ""} className="h-full w-full object-cover" />
            ) : (
                initial
            )}
        </span>
    );
}

export default function AdminTopbar({ isRtl, admin, onMenuClick }) {
    const { t } = useLanguage();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const closeTimer = useRef(null);

    const scheduleClose = useCallback(() => {
        clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setMenuOpen(false), 150);
    }, []);

    async function handleLogout() {
        setLoggingOut(true);
        try {
            await fetch("/api/admin/logout", { method: "POST" });
        } finally {
            router.push("/admin/login");
            router.refresh();
        }
    }

    return (
        <header className="sticky top-0 z-[80] flex items-center justify-between gap-3 border-b border-[var(--color-line)] bg-[var(--color-panel)]/90 px-4 py-3.5 backdrop-blur-md md:px-8">
            <button
                onClick={onMenuClick}
                className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)] lg:hidden"
                aria-label={t("admin.topbar.toggleMenu")}
            >
                <MenuIcon className="h-5 w-5" />
            </button>

            <div className="hidden md:block" />

            <div className="flex items-center gap-2.5">
                <NotificationBell isRtl={isRtl} />
                <LanguageSwitcher />
                <ThemeSwitcher />

                <div
                    className="relative"
                    onMouseEnter={() => {
                        clearTimeout(closeTimer.current);
                        setMenuOpen(true);
                    }}
                    onMouseLeave={scheduleClose}
                >
                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)] py-1.5 ps-1.5 pe-2.5 transition-colors hover:border-[var(--color-accent)]/40"
                    >
                        <AdminAvatar admin={admin} />
                        <span className="max-w-[8rem] truncate font-body text-sm font-medium text-[var(--color-ink)]">
                            {admin?.name || admin?.username || "…"}
                        </span>
                        <ChevronIcon className="h-4 w-4 text-[var(--color-muted)]" />
                    </button>

                    {menuOpen && (
                        <div
                            dir={isRtl ? "rtl" : "ltr"}
                            className="absolute end-0 top-[calc(100%+8px)] w-48 rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] p-1.5 shadow-2xl"
                        >
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="flex cursor-pointer w-full items-center rounded-lg px-3 py-2 text-start font-body text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                            >
                                {loggingOut ? t("admin.topbar.loggingOut") : t("admin.topbar.logout")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}