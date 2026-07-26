// components/admin/AdminSidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

function DashboardIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <path d="M3 13h8V3H3v10Zm10 8h8V3h-8v18ZM3 21h8v-6H3v6Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function HeroIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <rect x="3" y="4" width="18" height="14" rx="2" />
            <path d="m3 15 4.5-4.5a2 2 0 0 1 2.8 0L15 15" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="9" r="1.5" />
        </svg>
    );
}

function AboutIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5.5M12 8v.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ProjectsIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 9h18" strokeLinecap="round" />
            <circle cx="6.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
            <circle cx="8.7" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
        </svg>
    );
}

function TestimonialsIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.5 8.5H20a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2v2.5l-3-2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function MessagesIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <path d="M4 5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8l-4 3V6a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function SocialIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <circle cx="18" cy="18" r="2.5" />
            <path d="M8.2 10.8 15.8 7.2M8.2 13.2l7.6 3.6" strokeLinecap="round" />
        </svg>
    );
}

function AdminsIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <circle cx="9" cy="8" r="3" />
            <path
                d="M2.5 19c.7-3.2 3.2-5 6.5-5s5.8 1.8 6.5 5M16.5 6.5c1.6.3 2.8 1.6 2.8 3.3s-1.2 3-2.8 3.3M20 19c-.4-2-1.4-3.5-3-4.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

const NAV_ITEMS = [
    { href: "/admin", key: "admin.sidebar.dashboard", Icon: DashboardIcon, exact: true },
    { href: "/admin/hero", key: "admin.sidebar.hero", Icon: HeroIcon },
    { href: "/admin/about", key: "admin.sidebar.about", Icon: AboutIcon },
    { href: "/admin/projects", key: "admin.sidebar.projects", Icon: ProjectsIcon },
    { href: "/admin/testimonials", key: "admin.sidebar.testimonials", Icon: TestimonialsIcon },
    { href: "/admin/messages", key: "admin.sidebar.messages", Icon: MessagesIcon },
    { href: "/admin/social", key: "admin.sidebar.social", Icon: SocialIcon },
    { href: "/admin/admins", key: "admin.sidebar.admins", Icon: AdminsIcon },
];

export default function AdminSidebar({ isRtl, open, onNavigate }) {
    const { t } = useLanguage();
    const pathname = usePathname();

    // IMPORTANT: the open/close (mobile) state is expressed with plain
    // Tailwind classes here, NOT an inline `style={{ transform }}`.
    // Inline styles beat every class rule regardless of breakpoint, so an
    // inline transform used to permanently override `lg:translate-x-0`
    // and hide the sidebar even on desktop. Using classes for both the
    // mobile toggle state and the `lg:` override lets the lg: rule win
    // correctly once the viewport is large, since Tailwind emits the
    // responsive utility after the base one in the stylesheet.
    const mobileHiddenClass = isRtl ? "translate-x-full" : "-translate-x-full";
    const translateClass = open ? "translate-x-0" : mobileHiddenClass;

    return (
        <aside
            className={
                "fixed inset-y-0 start-0 z-[100] w-64 border-e border-[var(--color-line)] bg-[var(--color-panel)] transition-transform duration-300 lg:translate-x-0 " +
                translateClass
            }
        >
            <div className="flex h-full flex-col">
                {/* Brand */}
                <div className="flex items-center gap-2.5 border-b border-[var(--color-line)] px-6 py-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent)] font-display text-sm font-bold text-white">
                        TB
                    </span>
                    <div className="leading-tight">
                        <p className="font-display text-sm font-bold text-[var(--color-ink)]">
                            {t("admin.sidebar.brand")}
                        </p>
                        <p className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--color-muted)]">
                            {t("admin.sidebar.brandSub")}
                        </p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
                    {NAV_ITEMS.map(({ href, key, Icon, exact }) => {
                        const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={onNavigate}
                                className={
                                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-body text-sm font-medium transition-colors " +
                                    (active
                                        ? "bg-[var(--color-accent)]/12 text-[var(--color-accent)]"
                                        : "text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)]")
                                }
                            >
                                <Icon className={"h-[18px] w-[18px] shrink-0 " + (active ? "text-[var(--color-accent)]" : "")} />
                                <span>{t(key)}</span>
                                {active && <span className="ms-auto h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t border-[var(--color-line)] px-4 py-4">
                    <p className="px-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                        {t("admin.sidebar.footerNote")}
                    </p>
                </div>
            </div>
        </aside>
    );
}