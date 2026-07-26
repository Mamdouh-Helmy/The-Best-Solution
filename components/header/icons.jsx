import { memo } from "react";

// أيقونة الهامبرجر — تلات خطوط بتتحول لعلامة X بتغيير
// transform/opacity بس
function MenuIcon({ open }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={`hdr-bar hdr-bar-top ${open ? "is-open" : ""}`} />
            <path d="M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={`hdr-bar hdr-bar-mid ${open ? "is-open" : ""}`} />
            <path d="M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={`hdr-bar hdr-bar-bottom ${open ? "is-open" : ""}`} />
        </svg>
    );
}

export default memo(MenuIcon);