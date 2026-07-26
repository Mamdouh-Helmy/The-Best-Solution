export function tr(t, key, fallback) {
    const val = t(key);
    return !val || val === key ? fallback : val;
}
