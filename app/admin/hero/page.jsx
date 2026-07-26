// app/admin/hero/page.jsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import HeroFormModal from "./HeroFormModal";
import ConfirmDialog from "./ConfirmDialog";

function StatusBadge({ active, label }) {
    return (
        <span
            className={
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider " +
                (active
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-[var(--color-panel2)] text-[var(--color-muted)]")
            }
        >
            <span className={"h-1.5 w-1.5 rounded-full " + (active ? "bg-emerald-400" : "bg-[var(--color-muted)]")} />
            {label}
        </span>
    );
}

function HeroCard({ item, t, onEdit, onDelete, onSetLive }) {
    return (
        <div className="group relative rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5 transition-colors hover:border-[var(--color-accent)]/40">
            <div className="flex items-start justify-between gap-3">
                <StatusBadge active={item.isActive} label={item.isActive ? t("admin.hero.active") : t("admin.hero.inactive")} />
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {!item.isActive && (
                        <button
                            onClick={() => onSetLive(item)}
                            className="rounded-lg px-2 py-1 font-body text-xs text-[var(--color-accent)] hover:bg-[var(--color-panel2)]"
                        >
                            {t("admin.hero.setLive")}
                        </button>
                    )}
                    <button
                        onClick={() => onEdit(item)}
                        className="rounded-lg px-2 py-1 font-body text-xs text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)]"
                    >
                        {t("admin.hero.edit")}
                    </button>
                    <button
                        onClick={() => onDelete(item)}
                        className="rounded-lg px-2 py-1 font-body text-xs text-[var(--color-muted)] hover:bg-red-500/10 hover:text-red-400"
                    >
                        {t("admin.hero.delete")}
                    </button>
                </div>
            </div>

            <p className="eyebrow mt-4">{item.eyebrow?.en}</p>
            <h3 dir="ltr" className="font-display mt-1 truncate text-2xl font-bold text-[var(--color-ink)]">
                {item.title}
            </h3>
            <p className="mt-2 line-clamp-2 font-body text-sm text-[var(--color-muted)]">{item.subtitle?.en}</p>
        </div>
    );
}

export default function HeroAdminPage() {
    const { t, lang } = useLanguage();
    const isRtl = lang !== "en";

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const flash = useCallback((message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/hero", { cache: "no-store" });
            if (res.status === 401) {
                window.location.href = "/admin/login";
                return;
            }
            const data = await res.json();
            setItems(data.items || []);
        } catch {
            flash(t("admin.hero.errorToast"), "error");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    function openCreate() {
        setEditingEntry(null);
        setModalOpen(true);
    }

    function openEdit(item) {
        setEditingEntry(item);
        setModalOpen(true);
    }

    async function handleSubmit(form) {
        setSaving(true);
        try {
            const payload = {
                eyebrowEn: form.eyebrowEn,
                eyebrowAr: form.eyebrowAr,
                title: form.title,
                subtitleEn: form.subtitleEn,
                subtitleAr: form.subtitleAr,
                isActive: form.isActive,
            };

            const res = editingEntry
                ? await fetch(`/api/admin/hero/${editingEntry._id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                  })
                : await fetch("/api/admin/hero", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                  });

            if (res.status === 401) {
                window.location.href = "/admin/login";
                return;
            }
            if (!res.ok) throw new Error("request failed");

            setModalOpen(false);
            flash(editingEntry ? t("admin.hero.savedToast") : t("admin.hero.createdToast"));
            load();
        } catch {
            flash(t("admin.hero.errorToast"), "error");
        } finally {
            setSaving(false);
        }
    }

    async function handleSetLive(item) {
        try {
            const res = await fetch(`/api/admin/hero/${item._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: true }),
            });
            if (res.status === 401) {
                window.location.href = "/admin/login";
                return;
            }
            if (!res.ok) throw new Error("request failed");
            flash(t("admin.hero.savedToast"));
            load();
        } catch {
            flash(t("admin.hero.errorToast"), "error");
        }
    }

    async function confirmDelete() {
        if (!pendingDelete) return;
        try {
            const res = await fetch(`/api/admin/hero/${pendingDelete._id}`, { method: "DELETE" });
            if (res.status === 401) {
                window.location.href = "/admin/login";
                return;
            }
            if (!res.ok) throw new Error("request failed");
            flash(t("admin.hero.deletedToast"));
            load();
        } catch {
            flash(t("admin.hero.errorToast"), "error");
        } finally {
            setPendingDelete(null);
        }
    }

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-[var(--color-ink)] md:text-3xl">
                        {t("admin.hero.appName")}
                    </h1>
                    <p className="mt-1 max-w-xl font-body text-sm text-[var(--color-muted)]">
                        {t("admin.hero.pageSubtitle")}
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="w-fit rounded-xl bg-[var(--color-accent)] px-4 py-2.5 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                    + {t("admin.hero.newEntry")}
                </button>
            </div>

            <div className="mt-8">
                {loading ? (
                    <p className="font-body text-sm text-[var(--color-muted)]">{t("admin.hero.loading")}</p>
                ) : items.length === 0 ? (
                    <div className="section-grid rounded-3xl border border-dashed border-[var(--color-line)] py-16 text-center">
                        <p className="font-display text-lg font-semibold text-[var(--color-ink)]">
                            {t("admin.hero.noEntries")}
                        </p>
                        <p className="mx-auto mt-1 max-w-sm font-body text-sm text-[var(--color-muted)]">
                            {t("admin.hero.noEntriesHint")}
                        </p>
                        <button
                            onClick={openCreate}
                            className="mt-5 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 font-body text-sm font-semibold text-white hover:opacity-90"
                        >
                            + {t("admin.hero.newEntry")}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                            <HeroCard
                                key={item._id}
                                item={item}
                                t={t}
                                onEdit={openEdit}
                                onDelete={setPendingDelete}
                                onSetLive={handleSetLive}
                            />
                        ))}
                    </div>
                )}
            </div>

            <HeroFormModal
                open={modalOpen}
                entry={editingEntry}
                t={t}
                isRtl={isRtl}
                saving={saving}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
            />

            <ConfirmDialog
                open={!!pendingDelete}
                title={t("admin.hero.confirmDeleteTitle")}
                body={t("admin.hero.confirmDeleteBody")}
                confirmLabel={t("admin.hero.delete")}
                cancelLabel={t("admin.hero.cancel")}
                onConfirm={confirmDelete}
                onCancel={() => setPendingDelete(null)}
            />

            {toast && (
                <div
                    className={
                        "fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 rounded-xl px-4 py-2.5 font-body text-sm text-white shadow-xl " +
                        (toast.type === "error" ? "bg-red-500" : "bg-[var(--color-accent)]")
                    }
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}