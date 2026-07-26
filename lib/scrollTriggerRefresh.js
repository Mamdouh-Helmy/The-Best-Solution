// lib/scrollTriggerRefresh.js
//
// حل مركزي لمشكلة: أي سيكشن بيجيب بياناته من API بعد الـ mount (زي
// Testimonials) وبيغيّر طول الصفحة، فكل ScrollTrigger اتسجّل قبل كده
// (زي بتاع Contact) بيفضل شغال بمواقع start/end غلط، فالخط بيبان
// "ماشي" مسافة غلط لأن الـ progress بيتحسب على طول صفحة قديم.
//
// بدل ما كل سيكشن يعمل ResizeObserver خاص بيه (ومعاه احتمال إن أكتر
// من refresh() يتنفذوا في نفس اللحظة من مصادر مختلفة ويتعارضوا)، فيه
// مراقب واحد بس على document.body، وكل استدعاءات الـ refresh بتتجمع
// في نفس الـ debounce، فمفيش سباق توقيت بين السكاشن المختلفة.

let observer = null;
let debounceTimer = null;
let refCount = 0;

// بيتنادى من جوه أي effect محتاج يضمن إن أي ScrollTrigger في الصفحة
// هيتظبط تلقائي لو طول الصفحة اتغيّر. بيرجع دالة cleanup لازم تتنادى
// في الـ return بتاع الـ effect.
export function watchLayoutShifts(ScrollTrigger) {
    refCount += 1;

    if (!observer) {
        observer = new ResizeObserver(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 150);
        });
        observer.observe(document.body);
    }

    return () => {
        refCount -= 1;
        if (refCount <= 0 && observer) {
            observer.disconnect();
            observer = null;
            clearTimeout(debounceTimer);
        }
    };
}