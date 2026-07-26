"use client";

import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import Logo from "./Logo";
import NavLink from "./NavLinks";
import MenuIcon from "./icons";
import MobileMenu from "./MobileMenu";
import { useHeaderScroll } from "./useHeaderScroll";
import { useMobileMenu } from "./useMobileMenu";
import { useLanguage } from "@/context/LanguageContext";
import { NAV_ITEMS } from "./data";
import { tr } from "./utils";
import "./header.css";

export default function Header() {
    const { t, isRTL } = useLanguage();
    const isScrolled = useHeaderScroll();
    const { isOpen, toggleBtnRef, toggle, close } = useMobileMenu();

    return (
        <header className={`sticky top-0 z-50 w-full border-b border-transparent bg-panel/70 backdrop-blur-md hdr-shell ${isScrolled ? "is-scrolled" : ""}`}>
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
                <Logo />

                {/* روابط النافيجيشن — ديسكتوب بس */}
                <nav className="hidden md:flex items-center gap-8">
                    {NAV_ITEMS.map((item) => (
                        <NavLink key={item.id} item={item} label={t(item.key)} isRTL={isRTL} />
                    ))}
                </nav>

                <div className="flex items-center gap-3 shrink-0">
                    <LanguageSwitcher />
                    <ThemeSwitcher />

                    <button
                        ref={toggleBtnRef}
                        type="button"
                        onClick={toggle}
                        aria-expanded={isOpen}
                        aria-controls="mobile-nav-panel"
                        aria-label={isOpen ? tr(t, "nav.closeMenu", "قفل القايمة") : tr(t, "nav.openMenu", "فتح القايمة")}
                        className="md:hidden hdr-menu-btn inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink"
                    >
                        <MenuIcon open={isOpen} />
                    </button>
                </div>
            </div>

            {isOpen && <MobileMenu t={t} isRTL={isRTL} onClose={close} />}
        </header>
    );
}