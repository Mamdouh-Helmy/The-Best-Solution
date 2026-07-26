// lib/validation/social.js
import { SOCIAL_ICON_KEYS } from "@/lib/constants/socialIcons";

export function validateSocialPayload({ label, href, iconType, iconKey, image } = {}) {
    const errors = {};

    const l = (label ?? "").trim();
    if (!l) errors.label = "label is required";

    const h = (href ?? "").trim();
    if (!h) errors.href = "link is required";

    const type = iconType === "custom" ? "custom" : "preset";

    if (type === "preset") {
        if (!iconKey || !SOCIAL_ICON_KEYS.includes(iconKey)) {
            errors.iconKey = "a valid icon must be selected";
        }
    } else if (!image?.url) {
        errors.image = "custom icon image is required";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        values: {
            label: l,
            href: h,
            iconType: type,
            iconKey: type === "preset" ? iconKey : undefined,
            image: type === "custom" ? { url: image.url, publicId: image.publicId } : undefined,
        },
    };
}