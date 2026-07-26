// app/admin/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminLoginPage() {
    const router = useRouter();
    const { t, lang } = useLanguage();
    const isRtl = lang !== "en";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!username.trim() || !password) return;

        setSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username.trim(), password }),
            });
            const data = await res.json();

            if (!res.ok) {
                // 429 (locked) comes with its own descriptive message from the
                // server (including minutes remaining) — show it as-is.
                // 401 gets the localized generic message instead of leaking
                // which part (username/password) was wrong.
                setError(res.status === 429 ? data.error : t("admin.login.invalidCredentials"));
                return;
            }

            router.push("/admin");
            router.refresh();
        } catch {
            setError(t("admin.login.genericError"));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div dir={isRtl ? "rtl" : "ltr"} className="relative flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-6">
            <div className="absolute top-6 flex items-center gap-3 end-6">
                <LanguageSwitcher />
                <ThemeSwitcher />
            </div>

            <form
                onSubmit={handleSubmit}
                className="section-grid blueprint-frame w-full max-w-sm rounded-3xl border border-[var(--color-line)] bg-[var(--color-panel)] p-8 shadow-2xl"
            >
                <div className="mb-7 text-center">
                    <span className="eyebrow">{t("admin.login.eyebrow")}</span>
                    <p className="mt-2 font-body text-sm text-[var(--color-muted)]">{t("admin.login.subtitle")}</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <input
                            dir="ltr"
                            autoComplete="username"
                            placeholder={t("admin.login.usernamePh")}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)] px-4 py-2.5 font-body text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                        />
                    </div>
                    <div>
                        <input
                            dir="ltr"
                            type="password"
                            autoComplete="current-password"
                            placeholder={t("admin.login.passwordPh")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-panel2)] px-4 py-2.5 font-body text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                        />
                    </div>
                </div>

                {error && (
                    <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 font-body text-xs text-red-400">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 w-full rounded-xl bg-[var(--color-accent)] py-2.5 font-body text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    {submitting ? t("admin.login.sending") : t("admin.login.submit")}
                </button>
            </form>
        </div>
    );
}