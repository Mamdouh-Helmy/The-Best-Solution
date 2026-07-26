// lib/validation/contact.js
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactPayload({ name, contact, message } = {}) {
    const errors = {};

    const n = (name ?? "").trim();
    if (!n) errors.name = "name is required";
    else if (n.length < 2) errors.name = "name is too short (min 2 chars)";

    const c = (contact ?? "").trim();
    if (!c) {
        errors.contact = "contact is required";
    } else {
        const digitsOnly = c.replace(/[\s\-()]/g, "");
        const isEmail = EMAIL_RE.test(c);
        const isPhone = /^\+?\d{7,15}$/.test(digitsOnly);
        if (!isEmail && !isPhone) errors.contact = "contact format is invalid";
    }

    const m = (message ?? "").trim();
    if (!m) errors.message = "message is required";
    else if (m.length < 10) errors.message = "message is too short (min 10 chars)";

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        values: { name: n, contact: c, message: m },
    };
}