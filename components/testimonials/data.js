import { mixBrand } from "./utils";

export const TILT_DEG = -14;

export const CARD_VARIANTS = ["spotlight", "ribbon", "framed", "minimal", "beam"];
export const DECOR_SEQUENCE = ["planet", "moon", "rocket", "sun", "earth", "mars"];

// التستيمونيالز بقت جاية من /api/testimonials (وتتدار من
// /admin/testimonials) بدل ما تكون Array ثابتة هنا. كل عنصر راجع من
// الـ API بشكل ثنائي اللغة (name/role/quote = { en, ar })؛ الدالة دي
// بتحوّله لشكل مسطّح باللغة الحالية عشان TestimonialCard يستخدمه زي ما
// هو، وبتدي كل عنصر accent/side/variant تلقائي حسب ترتيبه في القايمة —
// بنفس المنطق اللي كان مبني على الأرّاي الثابتة قبل كده.
export function mapApiTestimonials(items = [], lang = "ar") {
    return items.map((it, i, arr) => {
        const name = it.name?.[lang] || it.name?.ar || "";
        return {
            id: it._id,
            name,
            role: it.role?.[lang] || it.role?.ar || "",
            quote: it.quote?.[lang] || it.quote?.ar || "",
            rating: it.rating || 5,
            accent: mixBrand(arr.length > 1 ? i / (arr.length - 1) : 0),
            side: i % 2 === 0 ? "left" : "right",
            variant: CARD_VARIANTS[i % CARD_VARIANTS.length],
            initial: name.trim().charAt(0),
        };
    });
}

/**
 * Interleaves testimonial cards with decorative "space" slides.
 * Extracted as a pure function (instead of inline useMemo body) so it can be
 * unit tested and reused without touching the component tree.
 */
export function buildSlides(testimonials = []) {
    const slides = [];
    testimonials.forEach((item, i) => {
        slides.push({ key: `card-${item.id}`, type: "card", item });
        if (i < testimonials.length - 1) {
            slides.push({
                key: `decor-${i}`,
                type: "decor",
                decorType: DECOR_SEQUENCE[i % DECOR_SEQUENCE.length],
                index: i,
            });
        }
    });
    return slides;
}