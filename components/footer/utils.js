export function tr(t, key, fallback) {
    const val = t(key);
    return !val || val === key ? fallback : val;
}

// بيبني منحنى Bezier بسيط بين نقطتين — نص المسافة الأفقية بينهم
// بيتحط كنقطة تحكم عشان يطلع منحنى ناعم بدل خط مستقيم.
export function buildSegment(p0, p1) {
    const midX = (p0.x + p1.x) / 2;
    return `M${p0.x},${p0.y} C${midX},${p0.y} ${midX},${p1.y} ${p1.x},${p1.y}`;
}