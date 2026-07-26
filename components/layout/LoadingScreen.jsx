"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const wrapRef = useRef(null);
  const barRef = useRef(null);
  const logoRef = useRef(null);
  const cornersRef = useRef(null);

  useEffect(() => {
    // منع سكرول الصفحة لحد ما التحميل يخلص
    document.documentElement.style.overflow = "hidden";

    let raf;
    let start = null;
    // مدة وهمية للعداد — عدّل الرقم لو حابب تبطّئه أو تسرّعه
    const duration = 2200;

    const tick = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      // Ease-out بسيط عشان الأرقام الأخيرة تاخد وقتها وتحس إنه "بيحمل" فعلاً
      const pct = Math.min(100, Math.round(100 * (1 - Math.pow(1 - elapsed / duration, 3))));
      setProgress(pct);

      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };

    raf = requestAnimationFrame(tick);

    const finish = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          onFinish?.();
        },
      });

      tl.to(logoRef.current, {
        scale: 1.06,
        duration: 0.35,
        ease: "power2.out",
      })
        .to(
          cornersRef.current,
          { opacity: 0, duration: 0.3, ease: "power1.out" },
          "<"
        )
        .to(wrapRef.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.9,
          ease: "power4.inOut",
        })
        .to(
          wrapRef.current,
          { autoAlpha: 0, duration: 0.1 },
          "-=0.05"
        );
    };

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      {/* خلفية الشبكة الهندسية — نفس روح section-grid */}
      <div className="pointer-events-none absolute inset-0 section-grid opacity-40" />

      {/* الإطار مع الزوايا — نفس blueprint-frame */}
      <div
        ref={cornersRef}
        className="blueprint-frame relative w-[280px] sm:w-[360px] px-8 py-10 flex flex-col items-center gap-6"
      >
        <span className="eyebrow">The Best Solution</span>

        <div ref={logoRef} className="relative">
          <span
            className="font-display text-4xl sm:text-5xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--color-accent-soft), var(--color-accent2))",
            }}
          >
            TBS
          </span>
        </div>

        {/* خط التقدّم */}
        <div className="w-full h-[3px] rounded-full bg-panel2 overflow-hidden">
          <div
            ref={barRef}
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              backgroundImage:
                "linear-gradient(90deg, var(--color-accent-soft), var(--color-accent2))",
              transition: "width 0.1s linear",
            }}
          />
        </div>

        <div className="flex w-full items-center justify-between font-mono text-xs text-muted">
          <span>SYSTEM.INIT</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}