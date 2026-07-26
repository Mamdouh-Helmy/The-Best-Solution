export default function StarIcon({ filled }) {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "var(--color-accent2)" : "none"} stroke="var(--color-accent2)" strokeWidth="1.4">
            <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.6l-6.1 3.4 1.5-6.8-5.2-4.7 6.9-.7L12 2.5Z" strokeLinejoin="round" />
        </svg>
    );
}
