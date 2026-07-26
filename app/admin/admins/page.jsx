// app/admin/admins/page.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

function CameraIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
            <circle cx="12" cy="13" r="3.2" />
        </svg>
    );
}

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

function LockIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor" {...props}>
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 1 1 8 0v3" strokeLinecap="round" />
        </svg>
    );
}

const emptyForm = { username: "", password: "", name: "" };

function Avatar({ url, name, username, size = 44 }) {
    const initial = (name || username || "?").trim()[0]?.toUpperCase() || "?";
    return (
        <span
            className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-accent)] font-body font-bold text-white"
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={name || username} className="h-full w-full object-cover" />
            ) : (
                initial
            )}
        </span>
    );
}

export default function AdminsPage() {
    const { t } = useLanguage();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null); // null = create, object = edit
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const fileInputRef = useRef(null);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    async function loadAdmins() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/admin/admins", { cache: "no-store" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to load admins");
            setItems(data.items || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAdmins();
    }, []);

    function openCreate() {
        setEditing(null);
        setForm(emptyForm);
        setImageFile(null);
        setImagePreview("");
        setFormError("");
        setModalOpen(true);
    }

    function openEdit(admin) {
        setEditing(admin);
        setForm({ username: admin.username, password: "", name: admin.name || "" });
        setImageFile(null);
        setImagePreview(admin.image?.url || "");
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
            if (imageFile) {
                image = await uploadImage(imageFile);
            }

            const payload = {
                username: form.username.trim(),
                name: form.name.trim(),
                ...(form.password ? { password: form.password } : {}),
                ...(image ? { image } : {}),
            };

            const url = editing ? `/api/admin/admins/${editing._id}` : "/api/admin/admins";
            const method = editing ? "PATCH" : "POST";

            if (!editing && !form.password) {
                setFormError(t("admin.admins.passwordRequired"));
                setSaving(false);
                return;
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");

            setModalOpen(false);
            loadAdmins();
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
            const res = await fetch(`/api/admin/admins/${deleteTarget._id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete");
            setDeleteTarget(null);
            loadAdmins();
        } catch (err) {
            setDeleteError(err.message);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold text-[var(--color-ink)] md:text-3xl">
                        {t("admin.sidebar.admins")}
                    </h1>
                    <p className="mt-1 max-w-xl font-body text-sm text-[var(--color-muted)]">
                        {t("admin.admins.subtitle")}
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 font-body text-sm font-bold text-white transition-opacity hover:opacity-90"
                >
                    <PlusIcon className="h-4 w-4" />
                    {t("admin.admins.add")}
                </button>
            </div>

            {error && (
                <p className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-body text-sm text-red-400">
                    {error}
                </p>
            )}

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {loading &&
                    Array.from({ length: 2 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-[104px] animate-pulse rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]"
                        />
                    ))}

                {!loading && items.length === 0 && (
                    <div className="col-span-full rounded-2xl border border-dashed border-[var(--color-line)] p-10 text-center">
                        <p className="font-body text-sm text-[var(--color-muted)]">{t("admin.admins.empty")}</p>
                    </div>
                )}

                {!loading &&
                    items.map((admin) => {
                        const locked = admin.lockUntil && new Date(admin.lockUntil) > new Date();
                        return (
                            <div
                                key={admin._id}
                                className="flex items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-5"
                            >
                                <Avatar url={admin.image?.url} name={admin.name} username={admin.username} />

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate font-display text-sm font-bold text-[var(--color-ink)]">
                                            {admin.name || admin.username}
                                        </p>
                                        {locked && <LockIcon className="h-3.5 w-3.5 shrink-0 text-red-400" />}
                                    </div>
                                    <p className="truncate font-mono text-xs text-[var(--color-muted)]">@{admin.username}</p>
                                    <p className="mt-0.5 font-body text-xs text-[var(--color-muted)]">
                                        {admin.lastLoginAt
                                            ? t("admin.admins.lastLogin") + " " + new Date(admin.lastLoginAt).toLocaleDateString()
                                            : t("admin.admins.neverLoggedIn")}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-1">
                                    <button
                                        onClick={() => openEdit(admin)}
                                        aria-label={t("admin.admins.edit")}
                                        className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)]"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDeleteTarget(admin);
                                            setDeleteError("");
                                        }}
                                        aria-label={t("admin.admins.delete")}
                                        className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-red-500/10 hover:text-red-400"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Add / edit modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div onClick={closeModal} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="relative w-full max-w-md rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-6 shadow-2xl">
                        <h2 className="font-display text-lg font-bold text-[var(--color-ink)]">
                            {editing ? t("admin.admins.editTitle") : t("admin.admins.addTitle")}
                        </h2>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar url={imagePreview} name={form.name} username={form.username} size={56} />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)] px-3.5 py-2 font-body text-xs font-medium text-[var(--color-ink)] hover:border-[var(--color-accent)]/40"
                                >
                                    <CameraIcon className="h-4 w-4" />
                                    {t("admin.admins.uploadPhoto")}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block font-body text-xs font-medium text-[var(--color-muted)]">
                                    {t("admin.admins.name")}
                                </label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)] px-3.5 py-2.5 font-body text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]/60"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block font-body text-xs font-medium text-[var(--color-muted)]">
                                    {t("admin.admins.username")}
                                </label>
                                <input
                                    required
                                    value={form.username}
                                    onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                                    className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)] px-3.5 py-2.5 font-body text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]/60"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block font-body text-xs font-medium text-[var(--color-muted)]">
                                    {t("admin.admins.password")}{" "}
                                    {editing && (
                                        <span className="normal-case text-[var(--color-muted)]/70">
                                            ({t("admin.admins.passwordOptionalHint")})
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                                    placeholder={editing ? "••••••••" : ""}
                                    className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)] px-3.5 py-2.5 font-body text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]/60"
                                />
                            </div>

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
                                    {t("admin.admins.cancel")}
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-[var(--color-accent)] px-4 py-2.5 font-body text-sm font-bold text-white disabled:opacity-50"
                                >
                                    {saving ? t("admin.admins.saving") : t("admin.admins.save")}
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
                            {t("admin.admins.deleteTitle")}
                        </h2>
                        <p className="mt-2 font-body text-sm text-[var(--color-muted)]">
                            {t("admin.admins.deleteConfirm")} <strong className="text-[var(--color-ink)]">@{deleteTarget.username}</strong>?
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
                                {t("admin.admins.cancel")}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="rounded-xl bg-red-500 px-4 py-2.5 font-body text-sm font-bold text-white disabled:opacity-50"
                            >
                                {deleting ? t("admin.admins.deleting") : t("admin.admins.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}