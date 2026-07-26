// app/admin/testimonials/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

function PlusIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" {...props}>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
    );
}
function PencilIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <path d="m16.5 3.5 4 4L8 20H4v-4L16.5 3.5Z" strokeLinecap="round" strokeLinejoin="round" />
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
function ArrowUpIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" {...props}>
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function ArrowDownIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" {...props}>
            <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function StarIconSmall({ filled }) {
    return (
        <svg viewBox="0 0 20 20" width="14" height="14" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2">
            <path d="M10 1.6l2.5 5.4 5.9.6-4.4 4 1.2 5.8L10 14.5l-5.2 2.9 1.2-5.8-4.4-4 5.9-.6L10 1.6Z" strokeLinejoin="round" />
        </svg>
    );
}

const emptyForm = {
    nameEn: "",
    nameAr: "",
    roleEn: "",
    roleAr: "",
    quoteEn: "",
    quoteAr: "",
    rating: 5,
    isPublished: true,
};

function Field({ label, children }) {
    return (
        <div>
            <label className="mb-1.5 block font-body text-xs font-medium text-[var(--color-muted)]">{label}</label>
            {children}
        </div>
    );
}

const inputClass =
    "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)] px-3.5 py-2.5 font-body text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]/60";

export default function AdminTestimonialsPage() {
    const { t } = useLanguage();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reorderingId, setReorderingId] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    async function loadItems() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/testimonials", { cache: "no-store" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to load testimonials");
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

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setFormError("");
        setModalOpen(true);
    }

    function openEdit(item) {
        setEditing(item);
        setForm({
            nameEn: item.name?.en || "",
            nameAr: item.name?.ar || "",
            roleEn: item.role?.en || "",
            roleAr: item.role?.ar || "",
            quoteEn: item.quote?.en || "",
            quoteAr: item.quote?.ar || "",
            rating: item.rating || 5,
            isPublished: item.isPublished,
        });
        setFormError("");
        setModalOpen(true);
    }

    function closeModal() {
        if (saving) return;
        setModalOpen(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setFormError("");

        try {
            const payload = {
                nameEn: form.nameEn.trim(),
                nameAr: form.nameAr.trim(),
                roleEn: form.roleEn.trim(),
                roleAr: form.roleAr.trim(),
                quoteEn: form.quoteEn.trim(),
                quoteAr: form.quoteAr.trim(),
                rating: Number(form.rating),
                isPublished: form.isPublished,
            };

            const url = editing ? `/api/admin/testimonials/${editing._id}` : "/api/admin/testimonials";
            const method = editing ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");

            setModalOpen(false);
            loadItems();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        setDeleteError("");
        try {
            const res = await fetch(`/api/admin/testimonials/${deleteTarget._id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete");
            setDeleteTarget(null);
            loadItems();
        } catch (err) {
            setDeleteError(err.message);
        } finally {
            setDeleting(false);
        }
    }

    async function togglePublished(item) {
        try {
            await fetch(`/api/admin/testimonials/${item._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !item.isPublished }),
            });
            loadItems();
        } catch {
            // هيرجع بصريًا لحالته الأصلية في أول تحميل تاني لو فشل.
        }
    }

    async function move(index, direction) {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        const a = items[index];
        const b = items[targetIndex];
        setReorderingId(a._id);

        try {
            await Promise.all([
                fetch(`/api/admin/testimonials/${a._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order: b.order }),
                }),
                fetch(`/api/admin/testimonials/${b._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order: a.order }),
                }),
            ]);
            await loadItems();
        } finally {
            setReorderingId(null);
        }
    }

    return (
        <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold text-[var(--color-ink)] md:text-3xl">
                        {t("admin.sidebar.testimonials")}
                    </h1>
                    <p className="mt-1 max-w-xl font-body text-sm text-[var(--color-muted)]">
                        {t("admin.testimonials.subtitle")}
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 font-body text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                    <PlusIcon className="h-4 w-4" />
                    {t("admin.testimonials.add")}
                </button>
            </div>

            {error && (
                <p className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-body text-sm text-red-400">
                    {error}
                </p>
            )}

            <div className="mt-8 space-y-3">
                {loading &&
                    Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-[92px] animate-pulse rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]"
                        />
                    ))}

                {!loading && items.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[var(--color-line)] p-10 text-center">
                        <p className="font-body text-sm text-[var(--color-muted)]">{t("admin.testimonials.empty")}</p>
                    </div>
                )}

                {!loading &&
                    items.map((item, index) => (
                        <div
                            key={item._id}
                            className="flex items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4"
                        >
                            <div className="flex shrink-0 flex-col gap-0.5">
                                <button
                                    onClick={() => move(index, -1)}
                                    disabled={index === 0 || reorderingId}
                                    aria-label={t("admin.testimonials.moveUp")}
                                    className="rounded-lg p-1 text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)] disabled:opacity-30"
                                >
                                    <ArrowUpIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => move(index, 1)}
                                    disabled={index === items.length - 1 || reorderingId}
                                    aria-label={t("admin.testimonials.moveDown")}
                                    className="rounded-lg p-1 text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)] disabled:opacity-30"
                                >
                                    <ArrowDownIcon className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-panel2)] font-display text-sm font-bold text-[var(--color-ink)]">
                                {(item.name?.ar || item.name?.en || "?").trim().charAt(0)}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="truncate font-display text-sm font-bold text-[var(--color-ink)]">
                                        {item.name?.ar || item.name?.en}
                                    </p>
                                    {!item.isPublished && (
                                        <span className="shrink-0 rounded-full bg-[var(--color-panel2)] px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-[var(--color-muted)]">
                                            {t("admin.testimonials.hidden")}
                                        </span>
                                    )}
                                </div>
                                <p className="truncate font-mono text-xs text-[var(--color-muted)]">
                                    {item.role?.ar || item.role?.en}
                                </p>
                                <div className="mt-1 flex gap-[2px] text-[var(--color-accent)]">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <StarIconSmall key={i} filled={i < item.rating} />
                                    ))}
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    onClick={() => togglePublished(item)}
                                    className={
                                        "rounded-full px-3 py-1.5 font-body text-xs font-medium transition-colors " +
                                        (item.isPublished
                                            ? "bg-[var(--color-accent)]/12 text-[var(--color-accent)]"
                                            : "bg-[var(--color-panel2)] text-[var(--color-muted)]")
                                    }
                                >
                                    {item.isPublished ? t("admin.testimonials.live") : t("admin.testimonials.show")}
                                </button>
                                <button
                                    onClick={() => openEdit(item)}
                                    aria-label={t("admin.testimonials.edit")}
                                    className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)]"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        setDeleteTarget(item);
                                        setDeleteError("");
                                    }}
                                    aria-label={t("admin.testimonials.delete")}
                                    className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-red-500/10 hover:text-red-400"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Add / edit modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto p-4">
                    <div onClick={closeModal} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-6 shadow-2xl">
                        <h2 className="font-display text-lg font-bold text-[var(--color-ink)]">
                            {editing ? t("admin.testimonials.editTitle") : t("admin.testimonials.addTitle")}
                        </h2>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label={t("admin.testimonials.name") + " (EN)"}>
                                    <input
                                        required
                                        value={form.nameEn}
                                        onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label={t("admin.testimonials.name") + " (AR)"}>
                                    <input
                                        required
                                        dir="rtl"
                                        value={form.nameAr}
                                        onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label={t("admin.testimonials.role") + " (EN)"}>
                                    <input
                                        required
                                        value={form.roleEn}
                                        onChange={(e) => setForm((f) => ({ ...f, roleEn: e.target.value }))}
                                        placeholder="CEO — CodeSchool"
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label={t("admin.testimonials.role") + " (AR)"}>
                                    <input
                                        required
                                        dir="rtl"
                                        value={form.roleAr}
                                        onChange={(e) => setForm((f) => ({ ...f, roleAr: e.target.value }))}
                                        placeholder="المدير التنفيذي — CodeSchool"
                                        className={inputClass}
                                    />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label={t("admin.testimonials.quote") + " (EN)"}>
                                    <textarea
                                        required
                                        rows={4}
                                        value={form.quoteEn}
                                        onChange={(e) => setForm((f) => ({ ...f, quoteEn: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label={t("admin.testimonials.quote") + " (AR)"}>
                                    <textarea
                                        required
                                        dir="rtl"
                                        rows={4}
                                        value={form.quoteAr}
                                        onChange={(e) => setForm((f) => ({ ...f, quoteAr: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                            </div>

                            <Field label={t("admin.testimonials.rating")}>
                                <select
                                    value={form.rating}
                                    onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                                    className={inputClass}
                                >
                                    {[5, 4, 3, 2, 1].map((n) => (
                                        <option key={n} value={n}>
                                            {n} {"★".repeat(n)}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <label className="flex items-center gap-2.5 font-body text-sm text-[var(--color-ink)]">
                                <input
                                    type="checkbox"
                                    checked={form.isPublished}
                                    onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                                    className="h-4 w-4 rounded border-[var(--color-line)] accent-[var(--color-accent)]"
                                />
                                {t("admin.testimonials.published")}
                            </label>

                            {formError && (
                                <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 font-body text-xs text-red-400">
                                    {formError}
                                </p>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-xl px-4 py-2.5 font-body text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-panel2)]"
                                >
                                    {t("admin.testimonials.cancel")}
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-[var(--color-accent)] px-4 py-2.5 font-body text-sm font-bold text-white disabled:opacity-50"
                                >
                                    {saving ? t("admin.testimonials.saving") : t("admin.testimonials.save")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}
            {deleteTarget && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div
                        onClick={() => !deleting && setDeleteTarget(null)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <div className="relative w-full max-w-sm rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-6 shadow-2xl">
                        <h2 className="font-display text-lg font-bold text-[var(--color-ink)]">
                            {t("admin.testimonials.deleteTitle")}
                        </h2>
                        <p className="mt-2 font-body text-sm text-[var(--color-muted)]">
                            {t("admin.testimonials.deleteConfirm")}{" "}
                            <strong className="text-[var(--color-ink)]">
                                {deleteTarget.name?.ar || deleteTarget.name?.en}
                            </strong>
                            ؟
                        </p>

                        {deleteError && (
                            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 font-body text-xs text-red-400">
                                {deleteError}
                            </p>
                        )}

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                                className="rounded-xl px-4 py-2.5 font-body text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-panel2)]"
                            >
                                {t("admin.testimonials.cancel")}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="rounded-xl bg-red-500 px-4 py-2.5 font-body text-sm font-bold text-white disabled:opacity-50"
                            >
                                {deleting ? t("admin.testimonials.deleting") : t("admin.testimonials.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}