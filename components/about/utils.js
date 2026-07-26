// بيقرّب أي رقم float لعدد خانات عشرية ثابت — نفس سبب استخدامها في
// hero/utils.js: أي رقم متولّد من Math.cos/sin وبيتحط في style attribute
// لازم يتقرّب قبل ما يوصل لـ JSX، وإلا المتصفح هيخزنه بدقة أقل من اللي
// React حاسبها وقت الـ hydration ويحصل mismatch.
export function roundCoord(n, precision = 4) {
    const f = 10 ** precision;
    return Math.round(n * f) / f;
}

// نقطة على إهليلج المدار (قبل الميل) عند زاوية معيّنة — دالة عامة بتاخد
// كل قيمها كـ parameters عشان تفضل قابلة لإعادة الاستخدام/الاختبار
// بدل ما تعتمد على constants خارجية ثابتة.
export function pointOnOrbit(angleDeg, tiltDeg, orbitRx, orbitRy) {
    const rad = (angleDeg * Math.PI) / 180;
    const x0 = orbitRx * Math.cos(rad);
    const y0 = orbitRy * Math.sin(rad);
    const tilt = (tiltDeg * Math.PI) / 180;
    const x = x0 * Math.cos(tilt) - y0 * Math.sin(tilt);
    const y = x0 * Math.sin(tilt) + y0 * Math.cos(tilt);
    return { x: roundCoord(x), y: roundCoord(y) };
}