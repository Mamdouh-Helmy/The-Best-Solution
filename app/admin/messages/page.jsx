// app/admin/messages/page.jsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

function MailOpenIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <path d="M3 8.5 12 14l9-5.5M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function TrashIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" strokeLinecap="round" strokeLinejoin="round" />
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

// المكوّن الحقيقي بمنطق الصفحة كله. مفصول عن الـ default export عشان
// useSearchParams لازم يكون جوه Suspense boundary في الـ App Router —
// لو استخدمناه على طول جوه export افتراضي من غير Suspense، Next.js
// بيدّي تحذير/خطأ وقت الـ build (بيمنع static rendering للصفحة).
function AdminMessagesContent() {
    const { t, lang } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [active, setActive] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    async function loadItems() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/messages", { cache: "no-store" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to load messages");
            setItems(data.items || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadItems();
    }, []);

    // لو فيه ?id=... في الرابط (جاي من جرس الإشعارات مثلاً)، افتح الرسالة
    // دي تلقائي بمجرد ما الليست تحمل، وبعدين امسح الـ id من الرابط عشان
    // لو المستخدم عمل refresh ميعيدش فتحها تاني من غير قصد.
    useEffect(() => {
        const targetId = searchParams.get("id");
        if (!targetId || items.length === 0) return;

        const found = items.find((m) => m._id === targetId);
        if (found) {
            openMessage(found);
        }
        router.replace("/admin/messages");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    async function openMessage(item) {
        setActive(item);
        if (item.isRead) return;
        setItems((prev) => prev.map((m) => (m._id === item._id ? { ...m, isRead: true } : m)));
        try {
            await fetch(`/api/admin/messages/${item._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isRead: true }),
            });
        } catch {
            // هيتصحح تاني في أول reload لو فشل
        }
    }

    async function toggleRead(item, e) {
        e.stopPropagation();
        const nextRead = !item.isRead;
        setItems((prev) => prev.map((m) => (m._id === item._id ? { ...m, isRead: nextRead } : m)));
        try {
            await fetch(`/api/admin/messages/${item._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isRead: nextRead }),
            });
        } catch {
            loadItems();
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/messages/${deleteTarget._id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete");
            setDeleteTarget(null);
            setActive((a) => (a?._id === deleteTarget._id ? null : a));
            loadItems();
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="font-display text-2xl font-bold text-[var(--color-ink)] md:text-3xl">{t("admin.sidebar.messages")}</h1>
            <p className="mt-1 font-body text-sm text-[var(--color-muted)]">{t("admin.messages.subtitle")}</p>

            {error && (
                <p className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-body text-sm text-red-400">{error}</p>
            )}

            <div className="mt-8 space-y-2">
                {loading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]" />
                    ))}

                {!loading && items.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[var(--color-line)] p-10 text-center">
                        <p className="font-body text-sm text-[var(--color-muted)]">{t("admin.messages.empty")}</p>
                    </div>
                )}

                {!loading &&
                    items.map((item) => (
                        <button
                            key={item._id}
                            onClick={() => openMessage(item)}
                            className={
                                "flex w-full items-center gap-4 rounded-2xl border p-4 text-start transition-colors " +
                                (item.isRead
                                    ? "border-[var(--color-line)] bg-[var(--color-panel)]"
                                    : "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/[0.04]")
                            }
                        >
                            {!item.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" />}

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="truncate font-display text-sm font-bold text-[var(--color-ink)]">{item.name}</p>
                                    <span className="shrink-0 font-mono text-[0.65rem] text-[var(--color-muted)]" dir="ltr">
                                        {item.contact}
                                    </span>
                                </div>
                                <p className="mt-0.5 truncate font-body text-xs text-[var(--color-muted)]">{item.message}</p>
                            </div>

                            <span className="shrink-0 font-mono text-[0.65rem] text-[var(--color-muted)]">
                                {timeAgo(item.createdAt, lang)}
                            </span>

                            <div className="flex shrink-0 items-center gap-1">
                                <span
                                    onClick={(e) => toggleRead(item, e)}
                                    role="button"
                                    aria-label={t("admin.messages.toggleRead")}
                                    className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)]"
                                >
                                    <MailOpenIcon className="h-4 w-4" />
                                </span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteTarget(item);
                                    }}
                                    role="button"
                                    aria-label={t("admin.testimonials.delete")}
                                    className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-red-500/10 hover:text-red-400"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </span>
                            </div>
                        </button>
                    ))}
            </div>

            {active && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div onClick={() => setActive(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="relative w-full max-w-lg rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-6 shadow-2xl">
                        <h2 className="font-display text-lg font-bold text-[var(--color-ink)]">{active.name}</h2>
                        <p className="mt-1 font-mono text-xs text-[var(--color-muted)]" dir="ltr">{active.contact}</p>
                        <p className="mt-4 whitespace-pre-wrap rounded-xl bg-[var(--color-panel2)] p-4 font-body text-sm leading-7 text-[var(--color-ink)]">
                            {active.message}
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button onClick={() => setActive(null)} className="rounded-xl px-4 py-2.5 font-body text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-panel2)]">
                                {t("admin.testimonials.cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div onClick={() => !deleting && setDeleteTarget(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="relative w-full max-w-sm rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-6 shadow-2xl">
                        <h2 className="font-display text-lg font-bold text-[var(--color-ink)]">{t("admin.testimonials.deleteTitle")}</h2>
                        <p className="mt-2 font-body text-sm text-[var(--color-muted)]">
                            {t("admin.testimonials.deleteConfirm")} <strong className="text-[var(--color-ink)]">{deleteTarget.name}</strong>؟
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="rounded-xl px-4 py-2.5 font-body text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-panel2)]">
                                {t("admin.testimonials.cancel")}
                            </button>
                            <button onClick={handleDelete} disabled={deleting} className="rounded-xl bg-red-500 px-4 py-2.5 font-body text-sm font-bold text-white disabled:opacity-50">
                                {deleting ? t("admin.testimonials.deleting") : t("admin.testimonials.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminMessagesPage() {
    return (
        <Suspense fallback={null}>
            <AdminMessagesContent />
        </Suspense>
    );
}