import { memo } from "react";

// أيقونات ثابتة 100% (مفيش props بتتغيّر)، فمعمولة memo عشان محدش
// منهم يتعاد رندره لما الفوتر يعمل re-render لأي سبب تاني.
//
// ملحوظة: أي مفتاح تضيفه هنا لازم يتضاف بنفس الاسم في
// lib/constants/socialIcons.js (SOCIAL_ICON_KEYS) عشان الباك يقبله.

function EmailIcon() {
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2.4" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function WhatsappIcon() {
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path
                d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8c-1.1 0-2.1-.2-3-.6L4 20l1.1-4.4C4.4 14.5 4 13.3 4 12Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path
                d="M6.5 3h3l1.5 4.5-2.2 1.8a12 12 0 0 0 5.9 5.9l1.8-2.2L21 14.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function LinkedinIcon() {
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2.4" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="7.2" cy="7.5" r="1" fill="currentColor" />
            <path d="M7.2 10.5v6M11 10.5v6M11 13.2c0-1.5 1-2.7 2.5-2.7s2.5 1.2 2.5 2.7v3.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function GithubIcon() {
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path
                d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.61-.2.61-.43v-1.7c-2.5.55-3.03-1.06-3.03-1.06-.41-1.04-1-1.31-1-1.31-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.11.98 2.63.75.08-.58.32-.98.57-1.2-2-.23-4.1-1-4.1-4.44 0-.98.35-1.78.92-2.4-.09-.23-.4-1.15.09-2.4 0 0 .75-.24 2.46.92a8.5 8.5 0 0 1 4.48 0c1.7-1.16 2.45-.92 2.45-.92.5 1.25.19 2.17.1 2.4.57.62.92 1.42.92 2.4 0 3.45-2.1 4.2-4.1 4.43.33.29.62.85.62 1.72v2.55c0 .24.16.51.62.43A9 9 0 0 0 12 3Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function TwitterIcon() {
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path
                d="M4 4l7 9.4L4.4 20H6l6-6.6 4.6 6.6H20l-7.4-9.9L19.8 4h-1.6l-5.6 6.1L8 4H4Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path
                d="M14.5 21v-7h2.3l.4-2.9h-2.7V9.3c0-.85.24-1.4 1.5-1.4h1.3V5.3c-.24-.03-1-.1-1.9-.1-1.9 0-3.2 1.15-3.2 3.3v2.6H9.9V14h2.3v7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
        </svg>
    );
}

function TelegramIcon() {
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path
                d="M4 11.5 20 4l-3 16-5.3-4-2.5 2.4-.4-3.6L18 6.6 8 12.9 4 11.5Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function YoutubeIcon() {
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
    );
}

function TiktokIcon() {
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path
                d="M14 4v10.2a2.6 2.6 0 1 1-2.2-2.57M14 4a4.4 4.4 0 0 0 4.5 4.3V10a6.7 6.7 0 0 1-4.5-1.7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function GlobeIcon() {
    return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 12h18M12 3c2.4 2.5 3.6 5.7 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.7-3.6-9S9.6 5.5 12 3Z" stroke="currentColor" strokeWidth="1.4" />
        </svg>
    );
}

// خريطة iconKey → { label, Icon } — الـ label بيتعرض في select الأدمن،
// والـ Icon هو اللي بيترسم فعليًا في الفوتر.
export const ICON_LIBRARY = {
    email: { label: "Email", Icon: memo(EmailIcon) },
    whatsapp: { label: "WhatsApp", Icon: memo(WhatsappIcon) },
    phone: { label: "Phone", Icon: memo(PhoneIcon) },
    linkedin: { label: "LinkedIn", Icon: memo(LinkedinIcon) },
    github: { label: "GitHub", Icon: memo(GithubIcon) },
    twitter: { label: "Twitter / X", Icon: memo(TwitterIcon) },
    instagram: { label: "Instagram", Icon: memo(InstagramIcon) },
    facebook: { label: "Facebook", Icon: memo(FacebookIcon) },
    telegram: { label: "Telegram", Icon: memo(TelegramIcon) },
    youtube: { label: "YouTube", Icon: memo(YoutubeIcon) },
    tiktok: { label: "TikTok", Icon: memo(TiktokIcon) },
    globe: { label: "Website", Icon: memo(GlobeIcon) },
};