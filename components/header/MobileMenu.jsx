import NavLink from "./NavLinks";
import { NAV_ITEMS } from "./data";
import { tr } from "./utils";

// بتترندر بس لما isOpen تبقى true (شايفها Header.jsx) — يعني مفيش
// أي DOM ولا event listeners إضافية على أول تحميل للصفحة.
function MobileMenu({ t, isRTL, onClose }) {
    return (
        <>
            <button
                type="button"
                onClick={onClose}
                aria-label={tr(t, "nav.closeMenu", "قفل القايمة")}
                className="hdr-backdrop-enter md:hidden fixed inset-0 top-16 z-40 bg-black/30 backdrop-blur-sm"
            />
            <nav id="mobile-nav-panel" className="hdr-panel-enter md:hidden absolute inset-x-0 top-full z-50 border-b border-line bg-panel shadow-lg">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
                    {NAV_ITEMS.map((item) => (
                        <NavLink key={item.id} item={item} label={t(item.key)} isRTL={isRTL} onNavigate={onClose} />
                    ))}
                </div>
            </nav>
        </>
    );
}

export default MobileMenu;