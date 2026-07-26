// components/admin/NotificationBell.jsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

function BellIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const POLL_INTERVAL_MS = 30000;

export default function NotificationBell({ isRtl }) {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [recent, setRecent] = useState([]);
    const [loadingRecent, setLoadingRecent] = useState(false);
    const closeTimer = useRef(null);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/messages/unread-count", { cache: "no-store" });
            if (!res.ok) return;
            const data = await res.json();
            setUnreadCount(data.unreadCount || 0);
        } catch {
            // بولنج صامت — أي فشل مؤقت مش لازم يقاطع الأدمن
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    async function openDropdown() {
        clearTimeout(closeTimer.current);
        setOpen(true);
        setLoadingRecent(true);
        try {
            const res = await fetch("/api/admin/messages?limit=5", { cache: "no-store" });
            const data = await res.json();
            setRecent(data.items || []);
            setUnreadCount(data.unreadCount || 0);
        } catch {
            // نسيب recent فاضية، الدروب داون هيعرض حالة "مفيش رسائل"
        } finally {
            setLoadingRecent(false);
        }
    }

    function scheduleClose() {
        clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setOpen(false), 150);
    }

    return (
        <div className="relative" onMouseEnter={openDropdown} onMouseLeave={scheduleClose}>
            <button
                onClick={() => (open ? setOpen(false) : openDropdown())}
                aria-label={t("admin.topbar.notifications")}
                className="relative cursor-pointer rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)]"
            >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -end-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 font-mono text-[0.6rem] font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div
                    dir={isRtl ? "rtl" : "ltr"}
                    className="absolute end-0 top-[calc(100%+8px)] w-80 rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] shadow-2xl"
                >
                    <div className="flex items-center justify-between border-b border-[var(--color-line)] px-4 py-3">
                        <p className="font-display text-sm font-bold text-[var(--color-ink)]">{t("admin.topbar.notifications")}</p>
                        {unreadCount > 0 && (
                            <span className="rounded-full bg-[var(--color-accent)]/12 px-2 py-0.5 font-mono text-[0.65rem] text-[var(--color-accent)]">
                                {unreadCount} {t("admin.topbar.unread")}
                            </span>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {loadingRecent &&
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="m-3 h-14 animate-pulse rounded-lg bg-[var(--color-panel2)]" />
                            ))}

                        {!loadingRecent && recent.length === 0 && (
                            <p className="px-4 py-8 text-center font-body text-sm text-[var(--color-muted)]">
                                {t("admin.topbar.noMessages")}
                            </p>
                        )}

                        {!loadingRecent &&
                            recent.map((msg) => (
                                <Link
                                    key={msg._id}
                                    href={`/admin/messages?id=${msg._id}`}
                                    onClick={() => setOpen(false)}
                                    className="block border-b border-[var(--color-line)] px-4 py-3 last:border-b-0 hover:bg-[var(--color-panel2)]"
                                >
                                    <div className="flex items-center gap-2">
                                        {!msg.isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />}
                                        <p className="truncate font-body text-sm font-semibold text-[var(--color-ink)]">{msg.name}</p>
                                    </div>
                                    <p className="mt-0.5 truncate font-body text-xs text-[var(--color-muted)]">{msg.message}</p>
                                </Link>
                            ))}
                    </div>

                    <Link
                        href="/admin/messages"
                        onClick={() => setOpen(false)}
                        className="block border-t border-[var(--color-line)] px-4 py-2.5 text-center font-body text-xs font-medium text-[var(--color-accent)] hover:bg-[var(--color-panel2)]"
                    >
                        {t("admin.topbar.viewAll")}
                    </Link>
                </div>
            )}
        </div>
    );
}