// app/admin/projects/page.jsx
"use client";

import { useEffect, useRef, useState } from "react";
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
function ImageIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <rect x="3" y="4" width="18" height="14" rx="2" />
            <path d="m3 15 4.5-4.5a2 2 0 0 1 2.8 0L15 15" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="9" r="1.5" />
        </svg>
    );
}

const emptyForm = {
    fileName: "",
    techLabel: "",
    tagEn: "",
    tagAr: "",
    titleEn: "",
    titleAr: "",
    descEn: "",
    descAr: "",
    href: "",
    linkLabel: "",
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

export default function AdminProjectsPage() {
    const { t } = useLanguage();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reorderingId, setReorderingId] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const fileInputRef = useRef(null);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    async function loadItems() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/projects", { cache: "no-store" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to load projects");
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
        setImageFile(null);
        setImagePreview("");
        setFormError("");
        setModalOpen(true);
    }

    function openEdit(project) {
        setEditing(project);
        setForm({
            fileName: project.fileName,
            techLabel: project.techLabel,
            tagEn: project.tag?.en || "",
            tagAr: project.tag?.ar || "",
            titleEn: project.title?.en || "",
            titleAr: project.title?.ar || "",
            descEn: project.desc?.en || "",
            descAr: project.desc?.ar || "",
            href: project.href || "",
            linkLabel: project.linkLabel || "",
            isPublished: project.isPublished,
        });
        setImageFile(null);
        setImagePreview(project.image?.url || "");
        setFormError("");
        setModalOpen(true);
    }

    function closeModal() {
        if (saving) return;
        setModalOpen(false);
    }

    function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    async function uploadImage(file) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Image upload failed");
        return { url: data.url, publicId: data.publicId };
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setFormError("");

        try {
            let image;
            if (imageFile) image = await uploadImage(imageFile);

            const payload = {
                fileName: form.fileName.trim(),
                techLabel: form.techLabel.trim(),
                tagEn: form.tagEn.trim(),
                tagAr: form.tagAr.trim(),
                titleEn: form.titleEn.trim(),
                titleAr: form.titleAr.trim(),
                descEn: form.descEn.trim(),
                descAr: form.descAr.trim(),
                href: form.href.trim() || "#",
                linkLabel: form.linkLabel.trim(),
                isPublished: form.isPublished,
                ...(image ? { image } : {}),
            };

            const url = editing ? `/api/admin/projects/${editing._id}` : "/api/admin/projects";
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
            const res = await fetch(`/api/admin/projects/${deleteTarget._id}`, { method: "DELETE" });
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

    async function togglePublished(project) {
        try {
            await fetch(`/api/admin/projects/${project._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !project.isPublished }),
            });
            loadItems();
        } catch {
            // Silently ignore — the toggle will just visually revert on
            // the next load if this failed.
        }
    }

    // Swaps `order` between a project and its neighbor, then persists
    // both — the simplest reliable way to reorder without drag-and-drop.
    async function move(index, direction) {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        const a = items[index];
        const b = items[targetIndex];
        setReorderingId(a._id);

        try {
            await Promise.all([
                fetch(`/api/admin/projects/${a._id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order: b.order }),
                }),
                fetch(`/api/admin/projects/${b._id}`, {
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
                        {t("admin.sidebar.projects")}
                    </h1>
                    <p className="mt-1 max-w-xl font-body text-sm text-[var(--color-muted)]">
                        {t("admin.projects.subtitle")}
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 font-body text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                    <PlusIcon className="h-4 w-4" />
                    {t("admin.projects.add")}
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
                        <p className="font-body text-sm text-[var(--color-muted)]">{t("admin.projects.empty")}</p>
                    </div>
                )}

                {!loading &&
                    items.map((project, index) => (
                        <div
                            key={project._id}
                            className="flex items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-4"
                        >
                            <div className="flex shrink-0 flex-col gap-0.5">
                                <button
                                    onClick={() => move(index, -1)}
                                    disabled={index === 0 || reorderingId}
                                    aria-label={t("admin.projects.moveUp")}
                                    className="rounded-lg p-1 text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)] disabled:opacity-30"
                                >
                                    <ArrowUpIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => move(index, 1)}
                                    disabled={index === items.length - 1 || reorderingId}
                                    aria-label={t("admin.projects.moveDown")}
                                    className="rounded-lg p-1 text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)] disabled:opacity-30"
                                >
                                    <ArrowDownIcon className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)]">
                                {project.image?.url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={project.image.url} alt={project.title?.en} className="h-full w-full object-cover" />
                                ) : (
                                    <ImageIcon className="h-5 w-5 text-[var(--color-muted)]" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="truncate font-display text-sm font-bold text-[var(--color-ink)]">
                                        {project.title?.ar || project.title?.en}
                                    </p>
                                    {!project.isPublished && (
                                        <span className="shrink-0 rounded-full bg-[var(--color-panel2)] px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-[var(--color-muted)]">
                                            {t("admin.projects.hidden")}
                                        </span>
                                    )}
                                </div>
                                <p className="truncate font-mono text-xs text-[var(--color-muted)]">
                                    {project.fileName} · {project.techLabel}
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    onClick={() => togglePublished(project)}
                                    className={
                                        "rounded-full px-3 py-1.5 font-body text-xs font-medium transition-colors " +
                                        (project.isPublished
                                            ? "bg-[var(--color-accent)]/12 text-[var(--color-accent)]"
                                            : "bg-[var(--color-panel2)] text-[var(--color-muted)]")
                                    }
                                >
                                    {project.isPublished ? t("admin.projects.live") : t("admin.projects.show")}
                                </button>
                                <button
                                    onClick={() => openEdit(project)}
                                    aria-label={t("admin.projects.edit")}
                                    className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)]"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        setDeleteTarget(project);
                                        setDeleteError("");
                                    }}
                                    aria-label={t("admin.projects.delete")}
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
                            {editing ? t("admin.projects.editTitle") : t("admin.projects.addTitle")}
                        </h2>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)]">
                                    {imagePreview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <ImageIcon className="h-5 w-5 text-[var(--color-muted)]" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)] px-3.5 py-2 font-body text-xs font-medium text-[var(--color-ink)] hover:border-[var(--color-accent)]/40"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    {t("admin.projects.uploadScreenshot")}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label={t("admin.projects.fileName")}>
                                    <input
                                        required
                                        value={form.fileName}
                                        onChange={(e) => setForm((f) => ({ ...f, fileName: e.target.value }))}
                                        placeholder="codeschool.tsx"
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label={t("admin.projects.techLabel")}>
                                    <input
                                        required
                                        value={form.techLabel}
                                        onChange={(e) => setForm((f) => ({ ...f, techLabel: e.target.value }))}
                                        placeholder="TypeScript React"
                                        className={inputClass}
                                    />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label={t("admin.projects.tag") + " (EN)"}>
                                    <input
                                        required
                                        value={form.tagEn}
                                        onChange={(e) => setForm((f) => ({ ...f, tagEn: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label={t("admin.projects.tag") + " (AR)"}>
                                    <input
                                        required
                                        dir="rtl"
                                        value={form.tagAr}
                                        onChange={(e) => setForm((f) => ({ ...f, tagAr: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label={t("admin.projects.title") + " (EN)"}>
                                    <input
                                        required
                                        value={form.titleEn}
                                        onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label={t("admin.projects.title") + " (AR)"}>
                                    <input
                                        required
                                        dir="rtl"
                                        value={form.titleAr}
                                        onChange={(e) => setForm((f) => ({ ...f, titleAr: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label={t("admin.projects.desc") + " (EN)"}>
                                    <textarea
                                        required
                                        rows={3}
                                        value={form.descEn}
                                        onChange={(e) => setForm((f) => ({ ...f, descEn: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label={t("admin.projects.desc") + " (AR)"}>
                                    <textarea
                                        required
                                        dir="rtl"
                                        rows={3}
                                        value={form.descAr}
                                        onChange={(e) => setForm((f) => ({ ...f, descAr: e.target.value }))}
                                        className={inputClass}
                                    />
                                </Field>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label={t("admin.projects.href")}>
                                    <input
                                        value={form.href}
                                        onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
                                        placeholder="https://example.com"
                                        dir="ltr"
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label={t("admin.projects.linkLabel")}>
                                    <input
                                        required
                                        value={form.linkLabel}
                                        onChange={(e) => setForm((f) => ({ ...f, linkLabel: e.target.value }))}
                                        placeholder="example.com"
                                        dir="ltr"
                                        className={inputClass}
                                    />
                                </Field>
                            </div>

                            <label className="flex items-center gap-2.5 font-body text-sm text-[var(--color-ink)]">
                                <input
                                    type="checkbox"
                                    checked={form.isPublished}
                                    onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                                    className="h-4 w-4 rounded border-[var(--color-line)] accent-[var(--color-accent)]"
                                />
                                {t("admin.projects.published")}
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
                                    {t("admin.projects.cancel")}
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-[var(--color-accent)] px-4 py-2.5 font-body text-sm font-bold text-white disabled:opacity-50"
                                >
                                    {saving ? t("admin.projects.saving") : t("admin.projects.save")}
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
                            {t("admin.projects.deleteTitle")}
                        </h2>
                        <p className="mt-2 font-body text-sm text-[var(--color-muted)]">
                            {t("admin.projects.deleteConfirm")}{" "}
                            <strong className="text-[var(--color-ink)]">{deleteTarget.title?.ar || deleteTarget.title?.en}</strong>?
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
                                {t("admin.projects.cancel")}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="rounded-xl bg-red-500 px-4 py-2.5 font-body text-sm font-bold text-white disabled:opacity-50"
                            >
                                {deleting ? t("admin.projects.deleting") : t("admin.projects.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}