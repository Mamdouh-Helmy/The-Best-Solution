// app/admin/hero/HeroFormModal.jsx
"use client";

import { useEffect, useState } from "react";
// Adjust this import to wherever Hero3DTitle actually lives in your project
// (same folder as Hero.jsx, which imports it via "./Hero3DTitle").
import Hero3DTitle from "@/components/hero/Hero3DTitle";

const LATIN_ONLY = /^[A-Za-z0-9\s'".,!?&:_-]*$/;
const emptyForm = { eyebrowEn: "", eyebrowAr: "", title: "", subtitleEn: "", subtitleAr: "", isActive: false };

export default function HeroFormModal({ open, entry, t, isRtl, onClose, onSubmit, saving }) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!open) return;
        setForm(
            entry
                ? {
                      eyebrowEn: entry.eyebrow?.en ?? "",
                      eyebrowAr: entry.eyebrow?.ar ?? "",
                      title: entry.title ?? "",
                      subtitleEn: entry.subtitle?.en ?? "",
                      subtitleAr: entry.subtitle?.ar ?? "",
                      isActive: !!entry.isActive,
                  }
                : emptyForm
        );
        setErrors({});
    }, [open, entry]);

    if (!open) return null;

    function set(field, value) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    function validate() {
        const next = {};
        for (const field of ["eyebrowEn", "eyebrowAr", "title", "subtitleEn", "subtitleAr"]) {
            if (!form[field].trim()) next[field] = t("admin.hero.requiredField");
        }
        if (form.title && !LATIN_ONLY.test(form.title)) next.title = t("admin.hero.latinOnlyError");
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(form);
    }

    const fieldClass =
        "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)] px-4 py-2.5 font-body text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20";
    const labelClass = "mb-1.5 block font-body text-xs font-medium text-[var(--color-muted)]";

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <form
                onSubmit={handleSubmit}
                dir={isRtl ? "rtl" : "ltr"}
                onClick={(e) => e.stopPropagation()}
                className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[var(--color-panel)] shadow-2xl md:grid-cols-[1.1fr_1fr]"
            >
                {/* Fields */}
                <div className="max-h-[85vh] overflow-y-auto p-6 md:p-8">
                    <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">
                        {entry ? t("admin.hero.edit") : t("admin.hero.create")}
                    </h2>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>{t("admin.hero.eyebrowEn")}</label>
                            <input
                                dir="ltr"
                                className={fieldClass}
                                value={form.eyebrowEn}
                                onChange={(e) => set("eyebrowEn", e.target.value)}
                            />
                            {errors.eyebrowEn && <p className="mt-1 text-xs text-red-400">{errors.eyebrowEn}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>{t("admin.hero.eyebrowAr")}</label>
                            <input
                                dir="rtl"
                                className={fieldClass}
                                value={form.eyebrowAr}
                                onChange={(e) => set("eyebrowAr", e.target.value)}
                            />
                            {errors.eyebrowAr && <p className="mt-1 text-xs text-red-400">{errors.eyebrowAr}</p>}
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className={labelClass}>{t("admin.hero.title")}</label>
                        <input
                            dir="ltr"
                            className={fieldClass}
                            value={form.title}
                            onChange={(e) => set("title", e.target.value)}
                            placeholder="e.g. Build Faster"
                        />
                        <p className="mt-1 font-body text-xs text-[var(--color-muted)]">{t("admin.hero.titleHint")}</p>
                        {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>{t("admin.hero.subtitleEn")}</label>
                            <textarea
                                dir="ltr"
                                rows={3}
                                className={fieldClass}
                                value={form.subtitleEn}
                                onChange={(e) => set("subtitleEn", e.target.value)}
                            />
                            {errors.subtitleEn && <p className="mt-1 text-xs text-red-400">{errors.subtitleEn}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>{t("admin.hero.subtitleAr")}</label>
                            <textarea
                                dir="rtl"
                                rows={3}
                                className={fieldClass}
                                value={form.subtitleAr}
                                onChange={(e) => set("subtitleAr", e.target.value)}
                            />
                            {errors.subtitleAr && <p className="mt-1 text-xs text-red-400">{errors.subtitleAr}</p>}
                        </div>
                    </div>

                    <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)] p-4">
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(e) => set("isActive", e.target.checked)}
                            className="mt-0.5 h-4 w-4 accent-[var(--color-accent)]"
                        />
                        <span>
                            <span className="block font-body text-sm font-medium text-[var(--color-ink)]">
                                {t("admin.hero.makeLive")}
                            </span>
                            <span className="block font-body text-xs text-[var(--color-muted)]">
                                {t("admin.hero.makeLiveHint")}
                            </span>
                        </span>
                    </label>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2.5 font-body text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                        >
                            {t("admin.hero.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-[var(--color-accent)] px-5 py-2.5 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                            {entry ? t("admin.hero.save") : t("admin.hero.create")}
                        </button>
                    </div>
                </div>

                {/* Live preview */}
                <div className="section-grid blueprint-frame relative hidden items-center justify-center bg-[var(--color-panel2)] p-8 md:flex">
                    <div className="pointer-events-none absolute left-5 top-5 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--color-muted)]">
                        {t("admin.hero.preview")}
                    </div>
                    <div className="pointer-events-none">
                        <Hero3DTitle title={form.title || "PREVIEW"} />
                    </div>
                </div>
            </form>
        </div>
    );
}