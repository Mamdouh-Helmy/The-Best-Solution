// ===================== gsap / ScrollTrigger — lazy load =====================
// بيتحمّلوا بس أول مرة حد يحتاجهم (جوه useEffect بعد الـ mount)، بدل
// static import فوق الملف. الـ Promise متخزّنة هنا (مستوى الموديول)
// عشان لو أكتر من effect احتاجهم، يتحمّلوا مرة واحدة بس، و
// registerPlugin يتنفّذ مرة واحدة بس كمان.
let gsapModulePromise = null;

export function loadGsap() {
    if (!gsapModulePromise) {
        gsapModulePromise = Promise.all([
            import(/* webpackChunkName: "gsap-core" */ "gsap"),
            import(/* webpackChunkName: "gsap-scrolltrigger" */ "gsap/ScrollTrigger"),
        ]).then(([gsapModule, scrollTriggerModule]) => {
            const gsapInstance = gsapModule.default;
            const { ScrollTrigger } = scrollTriggerModule;
            gsapInstance.registerPlugin(ScrollTrigger);
            return { gsap: gsapInstance, ScrollTrigger };
        });
    }
    return gsapModulePromise;
}