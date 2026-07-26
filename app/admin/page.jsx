// app/admin/page.jsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

function TrendIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <path d="M3 17 9 11l4 4 8-8M15 6h6v6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function HeroStatIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <rect x="3" y="4" width="18" height="14" rx="2" />
            <path d="m3 15 4.5-4.5a2 2 0 0 1 2.8 0L15 15" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="9" r="1.5" />
        </svg>
    );
}
function TestimonialsStatIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function MessagesStatIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <path d="M4 5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8l-4 3V6a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function SocialStatIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <circle cx="18" cy="18" r="2.5" />
            <path d="M8.2 10.8 15.8 7.2M8.2 13.2l7.6 3.6" strokeLinecap="round" />
        </svg>
    );
}
function ArrowIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" {...props}>
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function timeAgo(dateStr, locale) {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (mins < 1) return locale === "ar" ? "الآن" : "just now";
    if (mins < 60) return locale === "ar" ? `منذ ${mins} د` : `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return locale === "ar" ? `منذ ${hrs} س` : `${hrs}h ago`;
    return locale === "ar" ? `منذ ${Math.floor(hrs / 24)} يوم` : `${Math.floor(hrs / 24)}d ago`;
}

function StatCard({ label, value, hint, Icon, loading, tone = "default" }) {
    const toneClasses = {
        default: "bg-[var(--color-panel2)] text-[var(--color-ink)]",
        accent: "bg-[var(--color-accent)]/12 text-[var(--color-accent)]",
        warn: "bg-amber-500/12 text-amber-500",
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5 transition-colors hover:border-[var(--color-accent)]/30">
            <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
                <span className={"flex h-9 w-9 shrink-0 items-center justify-center rounded-xl " + toneClasses[tone]}>
                    <Icon className="h-4 w-4" />
                </span>
            </div>

            {loading ? (
                <div className="mt-3 h-8 w-16 animate-pulse rounded-lg bg-[var(--color-panel2)]" />
            ) : (
                <p className="mt-2 font-display text-3xl font-bold text-[var(--color-ink)]">{value}</p>
            )}

            {hint && <p className="mt-1 font-body text-xs text-[var(--color-muted)]">{hint}</p>}
        </div>
    );
}

function QuickLink({ href, title, subtitle, Icon }) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5 transition-colors hover:border-[var(--color-accent)]/40"
        >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-panel2)] text-[var(--color-muted)] transition-colors group-hover:bg-[var(--color-accent)]/12 group-hover:text-[var(--color-accent)]">
                <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold text-[var(--color-ink)]">{title}</p>
                <p className="mt-0.5 truncate font-body text-xs text-[var(--color-muted)]">{subtitle}</p>
            </div>
            <ArrowIcon className="h-4 w-4 shrink-0 text-[var(--color-muted)] opacity-0 transition-all -translate-x-1 rtl:translate-x-1 rtl:rotate-180 group-hover:translate-x-0 group-hover:opacity-100" />
        </Link>
    );
}

const initialCounts = {
    hero: { total: 0, hasActive: false },
    testimonials: { total: 0, published: 0 },
    messages: { total: 0, unread: 0 },
    social: { total: 0, active: 0 },
};

export default function AdminDashboardPage() {
    const { t, lang } = useLanguage();
    const [counts, setCounts] = useState(initialCounts);
    const [loading, setLoading] = useState(true);
    const [recentMessages, setRecentMessages] = useState([]);

    useEffect(() => {
        let cancelled = false;

        async function loadAll() {
            const results = await Promise.allSettled([
                fetch("/api/admin/hero", { cache: "no-store" }).then((r) => (r.ok ? r.json() : { items: [] })),
                fetch("/api/admin/testimonials", { cache: "no-store" }).then((r) => (r.ok ? r.json() : { items: [] })),
                fetch("/api/admin/messages?limit=5", { cache: "no-store" }).then((r) => (r.ok ? r.json() : { items: [], unreadCount: 0 })),
                fetch("/api/admin/social", { cache: "no-store" }).then((r) => (r.ok ? r.json() : { items: [] })),
            ]);

            if (cancelled) return;

            const [heroRes, testRes, msgRes, socialRes] = results;

            const heroItems = heroRes.status === "fulfilled" ? heroRes.value.items || [] : [];
            const testItems = testRes.status === "fulfilled" ? testRes.value.items || [] : [];
            const msgData = msgRes.status === "fulfilled" ? msgRes.value : { items: [], unreadCount: 0 };
            const socialItems = socialRes.status === "fulfilled" ? socialRes.value.items || [] : [];

            setCounts({
                hero: { total: heroItems.length, hasActive: heroItems.some((i) => i.isActive) },
                testimonials: { total: testItems.length, published: testItems.filter((i) => i.isPublished).length },
                messages: { total: msgData.items?.length ?? 0, unread: msgData.unreadCount || 0 },
                social: { total: socialItems.length, active: socialItems.filter((i) => i.isActive).length },
            });
            setRecentMessages(msgData.items || []);
            setLoading(false);
        }

        loadAll();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold text-[var(--color-ink)] md:text-3xl">
                        {t("admin.dashboard.title")}
                    </h1>
                    <p className="mt-1 max-w-xl font-body text-sm text-[var(--color-muted)]">
                        {t("admin.dashboard.subtitle")}
                    </p>
                </div>
                {counts.messages.unread > 0 && (
                    <Link
                        href="/admin/messages"
                        className="flex items-center gap-2 rounded-full bg-[var(--color-accent)]/12 px-4 py-2 font-body text-xs font-bold text-[var(--color-accent)] transition-opacity hover:opacity-80"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                        {counts.messages.unread} {t("admin.dashboard.unreadBadge")}
                    </Link>
                )}
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label={t("admin.dashboard.heroEntries")}
                    value={counts.hero.total}
                    hint={counts.hero.hasActive ? t("admin.dashboard.live") : t("admin.dashboard.noneLive")}
                    Icon={HeroStatIcon}
                    loading={loading}
                    tone={counts.hero.hasActive ? "accent" : "default"}
                />
                <StatCard
                    label={t("admin.sidebar.testimonials")}
                    value={counts.testimonials.total}
                    hint={`${counts.testimonials.published} ${t("admin.dashboard.published")}`}
                    Icon={TestimonialsStatIcon}
                    loading={loading}
                />
                <StatCard
                    label={t("admin.sidebar.messages")}
                    value={counts.messages.unread}
                    hint={t("admin.topbar.unread")}
                    Icon={MessagesStatIcon}
                    loading={loading}
                    tone={counts.messages.unread > 0 ? "warn" : "default"}
                />
                <StatCard
                    label={t("admin.sidebar.social")}
                    value={counts.social.total}
                    hint={`${counts.social.active} ${t("admin.dashboard.active")}`}
                    Icon={SocialStatIcon}
                    loading={loading}
                />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Quick actions */}
                <div className="lg:col-span-2">
                    <h2 className="font-display text-lg font-bold text-[var(--color-ink)]">
                        {t("admin.dashboard.quickActions")}
                    </h2>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <QuickLink
                            href="/admin/hero"
                            title={t("admin.sidebar.hero")}
                            subtitle={t("admin.dashboard.heroQuickHint")}
                            Icon={HeroStatIcon}
                        />
                        <QuickLink
                            href="/admin/about"
                            title={t("admin.sidebar.about")}
                            subtitle={t("admin.dashboard.aboutQuickHint")}
                            Icon={TrendIcon}
                        />
                        <QuickLink
                            href="/admin/testimonials"
                            title={t("admin.sidebar.testimonials")}
                            subtitle={t("admin.dashboard.testimonialsQuickHint")}
                            Icon={TestimonialsStatIcon}
                        />
                        <QuickLink
                            href="/admin/social"
                            title={t("admin.sidebar.social")}
                            subtitle={t("admin.dashboard.socialQuickHint")}
                            Icon={SocialStatIcon}
                        />
                    </div>
                </div>

                {/* Recent messages */}
                <div>
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-lg font-bold text-[var(--color-ink)]">
                            {t("admin.dashboard.recentMessages")}
                        </h2>
                        <Link
                            href="/admin/messages"
                            className="font-body text-xs font-medium text-[var(--color-accent)] hover:opacity-80"
                        >
                            {t("admin.topbar.viewAll")}
                        </Link>
                    </div>

                    <div className="mt-4 space-y-2">
                        {loading &&
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-16 animate-pulse rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]" />
                            ))}

                        {!loading && recentMessages.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-[var(--color-line)] p-6 text-center">
                                <p className="font-body text-xs text-[var(--color-muted)]">{t("admin.messages.empty")}</p>
                            </div>
                        )}

                        {!loading &&
                            recentMessages.map((msg) => (
                                <Link
                                    key={msg._id}
                                    href={`/admin/messages?id=${msg._id}`}
                                    className="block rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4 transition-colors hover:border-[var(--color-accent)]/30"
                                >
                                    <div className="flex items-center gap-2">
                                        {!msg.isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />}
                                        <p className="truncate font-display text-sm font-bold text-[var(--color-ink)]">{msg.name}</p>
                                        <span className="ms-auto shrink-0 font-mono text-[0.6rem] text-[var(--color-muted)]">
                                            {timeAgo(msg.createdAt, lang)}
                                        </span>
                                    </div>
                                    <p className="mt-1 truncate font-body text-xs text-[var(--color-muted)]">{msg.message}</p>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}