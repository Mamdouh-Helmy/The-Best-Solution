// app/admin/social/page.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ICON_LIBRARY } from "@/components/Footer/icons";

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

const emptyForm = {
    label: "",
    href: "",
    iconType: "preset",
    iconKey: "email",
    image: null, // { url, publicId }
    isActive: true,
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

export default function AdminSocialPage() {
    const { t } = useLanguage();
    const fileInputRef = useRef(null);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reorderingId, setReorderingId] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formError, setFormError] = useState("");

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    async function loadItems() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/social", { cache: "no-store" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to load social links");
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
            label: item.label,
            href: item.href,
            iconType: item.iconType,
            iconKey: item.iconKey || "email",
            image: item.image || null,
            isActive: item.isActive,
        });
        setFormError("");
        setModalOpen(true);
    }

    function closeModal() {
        if (saving || uploading) return;
        setModalOpen(false);
    }

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setFormError("");
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/admin/social/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");
            setForm((f) => ({ ...f, image: { url: data.url, publicId: data.publicId } }));
        } catch (err) {
            setFormError(err.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setFormError("");

        try {
            const payload = {
                label: form.label.trim(),
                href: form.href.trim(),
                iconType: form.iconType,
                iconKey: form.iconType === "preset" ? form.iconKey : undefined,
                image: form.iconType === "custom" ? form.image : undefined,
                isActive: form.isActive,
            };

            const url = editing ? `/api/admin/social/${editing._id}` : "/api/admin/social";
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
        try {
            const res = await fetch(`/api/admin/social/${deleteTarget._id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete");
            setDeleteTarget(null);
            loadItems();
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    }

    async function toggleActive(item) {
        try {
            await fetch(`/api/admin/social/${item._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !item.isActive }),
            });
            loadItems();
        } catch {
            // هيرجع لحالته الأصلية في أول reload لو فشل
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
                fetch(`/api/admin/social/${a._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order: b.order }),
                }),
                fetch(`/api/admin/social/${b._id}`, {
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

    function renderItemIcon(item) {
        if (item.iconType === "custom" && item.image?.url) {
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={item.image.url} alt="" className="h-5 w-5 object-contain" />;
        }
        const entry = ICON_LIBRARY[item.iconKey];
        const Icon = entry?.Icon;
        return Icon ? <Icon /> : null;
    }

    return (
        <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold text-[var(--color-ink)] md:text-3xl">
                        {t("admin.sidebar.social")}
                    </h1>
                    <p className="mt-1 max-w-xl font-body text-sm text-[var(--color-muted)]">
                        {t("admin.social.subtitle")}
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 font-body text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                    <PlusIcon className="h-4 w-4" />
                    {t("admin.social.add")}
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
                        <div key={i} className="h-[76px] animate-pulse rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]" />
                    ))}

                {!loading && items.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[var(--color-line)] p-10 text-center">
                        <p className="font-body text-sm text-[var(--color-muted)]">{t("admin.social.empty")}</p>
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

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-panel2)] text-[var(--color-ink)]">
                                {renderItemIcon(item)}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="truncate font-display text-sm font-bold text-[var(--color-ink)]">{item.label}</p>
                                    {!item.isActive && (
                                        <span className="shrink-0 rounded-full bg-[var(--color-panel2)] px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-[var(--color-muted)]">
                                            {t("admin.testimonials.hidden")}
                                        </span>
                                    )}
                                </div>
                                <p className="truncate font-mono text-xs text-[var(--color-muted)]" dir="ltr">
                                    {item.href}
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    onClick={() => toggleActive(item)}
                                    className={
                                        "rounded-full px-3 py-1.5 font-body text-xs font-medium transition-colors " +
                                        (item.isActive
                                            ? "bg-[var(--color-accent)]/12 text-[var(--color-accent)]"
                                            : "bg-[var(--color-panel2)] text-[var(--color-muted)]")
                                    }
                                >
                                    {item.isActive ? t("admin.testimonials.live") : t("admin.testimonials.show")}
                                </button>
                                <button
                                    onClick={() => openEdit(item)}
                                    aria-label={t("admin.testimonials.edit")}
                                    className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)]"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(item)}
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
                    <div className="relative my-8 w-full max-w-md rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-6 shadow-2xl">
                        <h2 className="font-display text-lg font-bold text-[var(--color-ink)]">
                            {editing ? t("admin.social.editTitle") : t("admin.social.addTitle")}
                        </h2>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                            <Field label={t("admin.social.label")}>
                                <input
                                    required
                                    value={form.label}
                                    onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                                    placeholder="WhatsApp"
                                    className={inputClass}
                                />
                            </Field>

                            <Field label={t("admin.social.link")}>
                                <input
                                    required
                                    dir="ltr"
                                    value={form.href}
                                    onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
                                    placeholder="https://wa.me/201000000000"
                                    className={inputClass}
                                />
                            </Field>

                            <Field label={t("admin.social.iconType")}>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setForm((f) => ({ ...f, iconType: "preset" }))}
                                        className={
                                            "flex-1 rounded-xl border px-3 py-2 font-body text-sm font-medium transition-colors " +
                                            (form.iconType === "preset"
                                                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                                                : "border-[var(--color-line)] text-[var(--color-muted)]")
                                        }
                                    >
                                        {t("admin.social.presetIcon")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm((f) => ({ ...f, iconType: "custom" }))}
                                        className={
                                            "flex-1 rounded-xl border px-3 py-2 font-body text-sm font-medium transition-colors " +
                                            (form.iconType === "custom"
                                                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                                                : "border-[var(--color-line)] text-[var(--color-muted)]")
                                        }
                                    >
                                        {t("admin.social.customIcon")}
                                    </button>
                                </div>
                            </Field>

                            {form.iconType === "preset" ? (
                                <Field label={t("admin.social.chooseIcon")}>
                                    <select
                                        value={form.iconKey}
                                        onChange={(e) => setForm((f) => ({ ...f, iconKey: e.target.value }))}
                                        className={inputClass}
                                    >
                                        {Object.entries(ICON_LIBRARY).map(([key, { label }]) => (
                                            <option key={key} value={key}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            ) : (
                                <Field label={t("admin.social.uploadIcon")}>
                                    <div className="flex items-center gap-3">
                                        {form.image?.url && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={form.image.url}
                                                alt=""
                                                className="h-10 w-10 shrink-0 rounded-lg bg-[var(--color-panel2)] object-contain p-1.5"
                                            />
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={uploading}
                                            className="flex-1 font-body text-xs text-[var(--color-muted)]"
                                        />
                                    </div>
                                    {uploading && (
                                        <p className="mt-1.5 font-mono text-[0.7rem] text-[var(--color-muted)]">
                                            {t("admin.social.uploading")}
                                        </p>
                                    )}
                                </Field>
                            )}

                            <label className="flex items-center gap-2.5 font-body text-sm text-[var(--color-ink)]">
                                <input
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
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
                                    disabled={saving || uploading}
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
                            <strong className="text-[var(--color-ink)]">{deleteTarget.label}</strong>؟
                        </p>

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