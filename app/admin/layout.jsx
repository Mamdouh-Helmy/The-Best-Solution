// app/admin/layout.jsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const { lang } = useLanguage();
    const isRtl = lang !== "en";

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [admin, setAdmin] = useState(null);

    const closeSidebar = useCallback(() => setSidebarOpen(false), []);

    useEffect(() => {
        // Login page renders standalone (no shell), so no point fetching
        // the current admin there.
        if (pathname === "/admin/login") return;

        let cancelled = false;
        fetch("/api/admin/me", { cache: "no-store" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!cancelled && data?.admin) setAdmin(data.admin);
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [pathname]);

    // Close the mobile sidebar automatically on route change.
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // The login page has its own centered, chrome-less layout.
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-[var(--color-bg)]">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    onClick={closeSidebar}
                    className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm lg:hidden"
                />
            )}

            <AdminSidebar isRtl={isRtl} open={sidebarOpen} onNavigate={closeSidebar} />

            <div className="flex min-h-screen flex-col lg:ps-64">
                <AdminTopbar isRtl={isRtl} admin={admin} onMenuClick={() => setSidebarOpen((v) => !v)} />
                <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
            </div>
        </div>
    );
}