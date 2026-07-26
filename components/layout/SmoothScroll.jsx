"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // duration أعلى = نزول أبطأ وأنعم. جرّب بين 1 و 1.6
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
      // ===== السبب الحقيقي وراء "الخط بيتلخبط عند السكرول" =====
      // Lenis افتراضيًا (autoRaf غير محدد = true) بيشغّل حلقة
      // requestAnimationFrame خاصة بيه هو نفسه، بالتوازي مع الحلقة
      // اللي بنشغّلها يدويًا تحت عن طريق gsap.ticker.add(raf).
      // يعني lenis.raf() كان بينفذ مرتين في كل فريم من مصدرين
      // مختلفين وبتوقيتين مش متطابقين تمامًا — ده اللي كان بيسبب
      // السلوك الغير ثابت (شغال كويس أحيانًا وغلط أحيانًا)، لأن
      // ScrollTrigger.update() كان بياخد مواقع سكرول متضاربة من
      // الحلقتين. autoRaf:false بيوقف حلقة Lenis الداخلية تمامًا،
      // فبيفضل مصدر واحد بس (gsap.ticker) هو اللي بيحرك كل حاجة —
      // ده هو التكامل الرسمي الموصى بيه من Lenis مع GSAP.
      autoRaf: false,
    });

    // كل ما Lenis يسكرول، حدّث ScrollTrigger عشان الأنيميشن يفضل متزامن مع مكان السكرول الفعلي
    lenis.on("scroll", ScrollTrigger.update);

    // اربط الـ raf loop بتاع Lenis بـ ticker بتاع GSAP بدل requestAnimationFrame العادي
    // ده بيخلي التايمنج موحّد بين السكرول والأنيميشن، ويمنع أي تقطيع
    function raf(time) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return children;
}