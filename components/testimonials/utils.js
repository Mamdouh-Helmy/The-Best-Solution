export function tr(t, key, fallback) {
    const val = t(key);
    return !val || val === key ? fallback : val;
}

const BRAND_A = "#6366F1";
const BRAND_B = "#F472B6";

export function mixBrand(ratio) {
    const pctA = Math.round((1 - Math.max(0, Math.min(1, ratio))) * 100);
    return `color-mix(in oklch, ${BRAND_A} ${pctA}%, ${BRAND_B} ${100 - pctA}%)`;
}
