// app/admin/about/AboutFormModal.jsx
"use client";

import { useEffect, useRef, useState } from "react";

const emptyForm = {
    eyebrowEn: "",
    eyebrowAr: "",
    titleEn: "",
    titleAr: "",
    bodyEn: "",
    bodyAr: "",
    stats: [],
    isActive: false,
};

function makeEmptyStat(id) {
    return { id, value: "", labelEn: "", labelAr: "" };
}

export default function AboutFormModal({ open, entry, t, isRtl, lang, onClose, onSubmit, saving }) {
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const statIdCounter = useRef(0);
    const previewLang = lang === "ar" ? "ar" : "en";
    const formRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        if (entry) {
            setForm({
                eyebrowEn: entry.eyebrow?.en ?? "",
                eyebrowAr: entry.eyebrow?.ar ?? "",
                titleEn: entry.title?.en ?? "",
                titleAr: entry.title?.ar ?? "",
                bodyEn: entry.body?.en ?? "",
                bodyAr: entry.body?.ar ?? "",
                isActive: !!entry.isActive,
                stats: (entry.stats || []).map((s) => {
                    statIdCounter.current += 1;
                    return {
                        id: `existing-${statIdCounter.current}`,
                        value: s.value ?? "",
                        labelEn: s.label?.en ?? "",
                        labelAr: s.label?.ar ?? "",
                    };
                }),
            });
        } else {
            statIdCounter.current += 1;
            setForm({ ...emptyForm, stats: [makeEmptyStat(`new-${statIdCounter.current}`)] });
        }
        setErrors({});
        
        // Scroll to top when modal opens
        if (formRef.current) {
            formRef.current.scrollTop = 0;
        }
    }, [open, entry]);

    if (!open) return null;

    function set(field, value) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    function setStat(id, field, value) {
        setForm((f) => ({
            ...f,
            stats: f.stats.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
        }));
    }

    function addStat() {
        statIdCounter.current += 1;
        setForm((f) => ({ ...f, stats: [...f.stats, makeEmptyStat(`new-${statIdCounter.current}`)] }));
    }

    function removeStat(id) {
        setForm((f) => ({ ...f, stats: f.stats.filter((s) => s.id !== id) }));
    }

    function moveStat(id, direction) {
        setForm((f) => {
            const index = f.stats.findIndex((s) => s.id === id);
            const targetIndex = index + direction;
            if (index === -1 || targetIndex < 0 || targetIndex >= f.stats.length) return f;

            const next = [...f.stats];
            [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
            return { ...f, stats: next };
        });
    }

    function validate() {
        const next = {};
        for (const field of ["eyebrowEn", "eyebrowAr", "titleEn", "titleAr", "bodyEn", "bodyAr"]) {
            if (!form[field].trim()) next[field] = t("admin.about.requiredField");
        }

        if (form.stats.length === 0) {
            next.stats = t("admin.about.statsMinError");
        } else {
            for (const s of form.stats) {
                if (!s.value.trim() || !s.labelEn.trim() || !s.labelAr.trim()) {
                    next.stats = t("admin.about.statsIncompleteError");
                    break;
                }
            }
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        onSubmit({
            eyebrowEn: form.eyebrowEn,
            eyebrowAr: form.eyebrowAr,
            titleEn: form.titleEn,
            titleAr: form.titleAr,
            bodyEn: form.bodyEn,
            bodyAr: form.bodyAr,
            stats: form.stats.map((s) => ({ value: s.value, labelEn: s.labelEn, labelAr: s.labelAr })),
            isActive: form.isActive,
        });
    }

    const fieldClass =
        "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)] px-4 py-2.5 font-body text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20";
    const labelClass = "mb-1.5 block font-body text-xs font-medium text-[var(--color-muted)]";

    const previewStats = form.stats
        .filter((s) => s.value.trim() && (previewLang === "ar" ? s.labelAr.trim() : s.labelEn.trim()))
        .map((s) => ({ value: s.value, label: previewLang === "ar" ? s.labelAr : s.labelEn }));

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                dir={isRtl ? "rtl" : "ltr"}
                onClick={(e) => e.stopPropagation()}
                className="relative flex w-full max-w-6xl max-h-[90vh] flex-col rounded-3xl border border-[var(--color-line)] bg-[var(--color-panel)] shadow-2xl"
            >
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 rounded-t-3xl border-b border-[var(--color-line)] bg-[var(--color-panel)] px-6 py-4 md:px-8">
                    <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">
                        {entry ? t("admin.about.edit") : t("admin.about.create")}
                    </h2>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div>
                        <div>
                            <label className={labelClass}>{t("admin.about.eyebrowEn")}</label>
                            <input
                                dir="ltr"
                                className={fieldClass}
                                value={form.eyebrowEn}
                                onChange={(e) => set("eyebrowEn", e.target.value)}
                            />
                            {errors.eyebrowEn && <p className="mt-1 text-xs text-red-400">{errors.eyebrowEn}</p>}
                        </div>
                        <div className="mt-3">
                            <label className={labelClass}>{t("admin.about.eyebrowAr")}</label>
                            <input
                                dir="rtl"
                                className={fieldClass}
                                value={form.eyebrowAr}
                                onChange={(e) => set("eyebrowAr", e.target.value)}
                            />
                            {errors.eyebrowAr && <p className="mt-1 text-xs text-red-400">{errors.eyebrowAr}</p>}
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>{t("admin.about.titleEn")}</label>
                            <input
                                dir="ltr"
                                className={fieldClass}
                                value={form.titleEn}
                                onChange={(e) => set("titleEn", e.target.value)}
                            />
                            {errors.titleEn && <p className="mt-1 text-xs text-red-400">{errors.titleEn}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>{t("admin.about.titleAr")}</label>
                            <input
                                dir="rtl"
                                className={fieldClass}
                                value={form.titleAr}
                                onChange={(e) => set("titleAr", e.target.value)}
                            />
                            {errors.titleAr && <p className="mt-1 text-xs text-red-400">{errors.titleAr}</p>}
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>{t("admin.about.bodyEn")}</label>
                            <textarea
                                dir="ltr"
                                rows={4}
                                className={fieldClass}
                                value={form.bodyEn}
                                onChange={(e) => set("bodyEn", e.target.value)}
                            />
                            {errors.bodyEn && <p className="mt-1 text-xs text-red-400">{errors.bodyEn}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>{t("admin.about.bodyAr")}</label>
                            <textarea
                                dir="rtl"
                                rows={4}
                                className={fieldClass}
                                value={form.bodyAr}
                                onChange={(e) => set("bodyAr", e.target.value)}
                            />
                            {errors.bodyAr && <p className="mt-1 text-xs text-red-400">{errors.bodyAr}</p>}
                        </div>
                    </div>

                    {/* Stats / orbit satellites */}
                    <div className="mt-5 rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)] p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="font-body text-sm font-semibold text-[var(--color-ink)]">
                                    {t("admin.about.statsSectionTitle")}
                                </p>
                                <p className="mt-0.5 font-body text-xs text-[var(--color-muted)]">
                                    {t("admin.about.statsHint")}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addStat}
                                className="shrink-0 rounded-lg bg-[var(--color-accent)]/12 px-3 py-1.5 font-body text-xs font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20"
                            >
                                + {t("admin.about.addStat")}
                            </button>
                        </div>

                        {errors.stats && <p className="mt-3 text-xs text-red-400">{errors.stats}</p>}

                        <div className="mt-3 space-y-2.5">
                            {form.stats.map((s, index) => (
                                <div key={s.id} className="rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] p-3">
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[4.5rem_1fr_1fr]">
                                        <input
                                            dir="ltr"
                                            placeholder={t("admin.about.statValue")}
                                            className={fieldClass}
                                            value={s.value}
                                            onChange={(e) => setStat(s.id, "value", e.target.value)}
                                        />
                                        <input
                                            dir="ltr"
                                            placeholder={t("admin.about.statLabelEn")}
                                            className={fieldClass}
                                            value={s.labelEn}
                                            onChange={(e) => setStat(s.id, "labelEn", e.target.value)}
                                        />
                                        <input
                                            dir="rtl"
                                            placeholder={t("admin.about.statLabelAr")}
                                            className={fieldClass}
                                            value={s.labelAr}
                                            onChange={(e) => setStat(s.id, "labelAr", e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-2 flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            disabled={index === 0}
                                            onClick={() => moveStat(s.id, -1)}
                                            className="rounded-lg px-2 py-1 font-body text-xs text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)] disabled:opacity-30"
                                        >
                                            {isRtl ? "→" : "↑"}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={index === form.stats.length - 1}
                                            onClick={() => moveStat(s.id, 1)}
                                            className="rounded-lg px-2 py-1 font-body text-xs text-[var(--color-muted)] hover:bg-[var(--color-panel2)] hover:text-[var(--color-ink)] disabled:opacity-30"
                                        >
                                            {isRtl ? "←" : "↓"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeStat(s.id)}
                                            className="rounded-lg px-2 py-1 font-body text-xs text-[var(--color-muted)] hover:bg-red-500/10 hover:text-red-400"
                                        >
                                            {t("admin.about.removeStat")}
                                        </button>
                                    </div>
                                </div>
                            ))}
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
                                {t("admin.about.makeLive")}
                            </span>
                            <span className="block font-body text-xs text-[var(--color-muted)]">
                                {t("admin.about.makeLiveHint")}
                            </span>
                        </span>
                    </label>
                </div>

                {/* Sticky Footer with Actions */}
                <div className="sticky bottom-0 rounded-b-3xl border-t border-[var(--color-line)] bg-[var(--color-panel)] px-6 py-4 md:px-8">
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2.5 font-body text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
                        >
                            {t("admin.about.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-[var(--color-accent)] px-5 py-2.5 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                            {entry ? t("admin.about.save") : t("admin.about.create")}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}