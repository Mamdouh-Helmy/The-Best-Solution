"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

// ملحوظة: التنسيق كله هنا بقى Tailwind utility classes مباشرة على
// العناصر. الحاجة الوحيدة اللي فضلت CSS خام هي الـ @keyframes (4 بس:
// siteTwinkle, siteAuroraDrift, siteCloudDrift, siteMoonBreathe) —
// موجودة في global.css لأن Tailwind arbitrary values مش بيقدر يعرّف
// @keyframes بنفسه، بس بيقدر "يستخدم" اسم keyframe معرّف برة عن طريق
// [animation-name:...]. تفعيل/إيقاف الأنيميشن (active/paused) بقى عن
// طريق group + data-active بدل كلاس .is-active.

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* =============================================================================
   ثوابت
   ============================================================================= */

const STAR_COUNT = 70;
const CLOUD_COUNT = 6;

/* =============================================================================
   Hooks مساعدة — توليد بيانات النجوم والسحاب بشكل عشوائي مرة واحدة
   ============================================================================= */

function useSiteStars(count = STAR_COUNT) {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    setStars(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 1.6 + 0.6,
        delay: Math.random() * 4,
        duration: Math.random() * 2.5 + 2,
      }))
    );
  }, [count]);

  return stars;
}

function useSiteClouds(count = CLOUD_COUNT) {
  const [clouds, setClouds] = useState([]);

  useEffect(() => {
    setClouds(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: 8 + Math.random() * 80,
        left: Math.random() * 100,
        scale: 0.7 + Math.random() * 0.9,
        duration: 40 + Math.random() * 30,
        delay: -Math.random() * 30,
      }))
    );
  }, [count]);

  return clouds;
}

/* =============================================================================
   Hook مساعد — قياس أبعاد الكونتينر + مكان توقف الخيوط + مكان القمر
   ============================================================================= */

// بنقيس الطول الحقيقي بالبكسل للكونتينر (اللي بيغطي كل الأقسام اللي
// محطوطة جوه SiteSky ده). جوه الكونتينر ممكن يكون فيه سيكشن معمول له
// pin بـ GSAP (ScrollTrigger)، فارتفاعه في الـ DOM بيتغيّر أول ما GSAP
// يحط الـ pin-spacer، وممكن GSAP يعيد حساب المسافة دي كذا مرة (تحميل
// صور/خطوط، إلخ). لو قسنا بـ ResizeObserver عادي، أي تغيير مؤقت زي ده
// هيتترجم لإعادة رسم للخطوط/القمر، وده اللي بيبان إنهم "بيتحركوا وقت
// السكرول". عشان كده هنا بنقيس بس لما GSAP نفسه يقول "خلصت إعادة حساب"
// (حدث refresh بتاع ScrollTrigger) + عند resize حقيقي للويندو — مش عند
// أي تغيير تخطيطي عابر بيحصل أثناء toggling الـ pin وانت بتسكرول عادي.
function useSkyDimensions(sceneRef, threadsBoundaryRef, moonAnchorRef) {
  const [dims, setDims] = useState({ w: 0, h: 0, threadsH: 0, moonTop: null });

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width <= 0 || height <= 0) return;

      // ارتفاع منطقة الخيوط: لو فيه threadsBoundaryRef اتحدد، بنوقف
      // الخيوط عند مكانه. لو مفيش، الخيوط بتغطي كل ارتفاع الكونتينر.
      let threadsH = height;
      if (threadsBoundaryRef?.current) {
        const bRect = threadsBoundaryRef.current.getBoundingClientRect();
        threadsH = Math.max(0, Math.round(bRect.top - rect.top));
      }

      // مكان القمر: المسافة من بداية الكونتينر لحد moonAnchorRef.
      let moonTop = null;
      if (moonAnchorRef?.current) {
        const mRect = moonAnchorRef.current.getBoundingClientRect();
        moonTop = Math.max(0, Math.round(mRect.top - rect.top));
      }

      setDims((prev) =>
        Math.round(prev.w) === Math.round(width) &&
        Math.round(prev.h) === Math.round(height) &&
        Math.round(prev.threadsH) === Math.round(threadsH) &&
        prev.moonTop === moonTop
          ? prev
          : { w: Math.round(width), h: Math.round(height), threadsH: Math.round(threadsH), moonTop }
      );
    };

    // قياس أولي (قبل ما GSAP يخلص الإعداد، هيتصحّح بعدين مع أول refresh)
    measure();

    // إعادة القياس فقط لما GSAP يقول إنه خلص إعادة حساب كل الـ
    // ScrollTrigger بتاعته (بيحصل عند الـ load الأول، عند window resize،
    // أو أي نداء صريح لـ ScrollTrigger.refresh() — مش عند كل toggle
    // للـ pin وقت السكرول العادي).
    ScrollTrigger.addEventListener("refresh", measure);

    // resize حقيقي للويندو برضه بيستاهل إعادة قياس
    window.addEventListener("resize", measure);

    return () => {
      ScrollTrigger.removeEventListener("refresh", measure);
      window.removeEventListener("resize", measure);
    };
  }, [threadsBoundaryRef, moonAnchorRef]);

  return dims;
}

// بيفعّل الأنيميشنز بس لما الكومبوننت يكون ظاهر في الشاشة (IntersectionObserver)،
// مع احترام إعداد "تقليل الحركة" في نظام التشغيل.
function useActiveWhenVisible(sceneRef) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setActive(true);
      return;
    }

    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0,
      rootMargin: "40% 0px 40% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [sceneRef]);

  return active;
}

/* =============================================================================
   بناء مسارات الخيوط (SVG paths)
   ============================================================================= */

// خيط بشكل قوس كبير واحد ناعم (زي قوس قزح) — منحنى واحد بس من فوق
// لتحت، من غير أي تعرّج متكرر.
function buildArcThread(x0, height, bow) {
  const midY = height / 2;
  return `M${x0},0 Q${x0 + bow},${midY} ${x0},${height}`;
}

// خيط متعرّج (بسيط أو أضيق حسب segH/amplitude) — سلسلة منحنيات Q متصلة
// من غير أي فجوة بينها، فبيبان كخيط واحد سايح مش خطوط متقطّعة.
function buildWaveThread(x0, amplitude, segH, height, startDir = 1) {
  let d = `M${x0},0`;
  let x = x0;
  let y = 0;
  let dir = startDir;
  while (y < height) {
    const ny = Math.min(y + segH, height);
    const cx = x + amplitude * dir;
    const cy = y + (ny - y) / 2;
    d += ` Q${cx},${cy} ${x},${ny}`;
    dir *= -1;
    y = ny;
  }
  return d;
}

// تجهيز تعريفات الخيوط التلاتة: قوس كبير ناعم، تعرّج بسيط، تعرّج أضيق —
// مواقعهم كنسبة من عرض الكونتينر عشان يفضلوا موزّعين صح مهما اتغيّر
// العرض. الارتفاع بتاعهم بيبقى threadsH بدل h، عشان يقفوا عند
// threadsBoundaryRef لو موجود.
function buildThreadDefs(w, threadsH) {
  return [
    { kind: "arc", xFrac: 0.12, bow: w * 0.1 },
    { kind: "wave", xFrac: 0.5, amplitude: w * 0.028, segH: Math.max(70, threadsH / 16), dir: -1 },
    { kind: "wave", xFrac: 0.87, amplitude: w * 0.014, segH: Math.max(46, threadsH / 24), dir: 1 },
  ];
}

function threadPath(th, w, threadsH) {
  const x0 = w * th.xFrac;
  return th.kind === "arc"
    ? buildArcThread(x0, threadsH, th.bow)
    : buildWaveThread(x0, th.amplitude, th.segH, threadsH, th.dir);
}

/* =============================================================================
   Tailwind class strings ثابتة (مفصولة هنا بس عشان الـ JSX يفضل قابل
   للقراءة). القيم الديناميكية (مواقع عشوائية، مقاسات، ألوان الخلفية
   المحسوبة) بتفضل inline style لأن Tailwind JIT محتاج القيم تبقى
   نصوص ثابتة معروفة وقت البناء، مش متغيّرات جافاسكريبت.
   ============================================================================= */

// كل الأنيميشنز بتبدأ paused وبتشتغل بس لو الأب (group) عليه data-active="true"
const ANIMATED_PAUSED = "[animation-play-state:paused] group-data-[active=true]:[animation-play-state:running]";

const STAR_CLASSES = `absolute rounded-full bg-white [animation-name:siteTwinkle] [animation-timing-function:ease-in-out] [animation-iteration-count:infinite] ${ANIMATED_PAUSED} motion-reduce:[animation-name:none]`;

const AURORA_CLASSES = `absolute blur-[40px] mix-blend-screen [animation-name:siteAuroraDrift] [animation-duration:16s] [animation-timing-function:ease-in-out] [animation-iteration-count:infinite] ${ANIMATED_PAUSED} motion-reduce:[animation-name:none]`;

const SKY_WAVES_SVG_CLASSES =
  "absolute top-0 left-0 w-full opacity-90 " +
  "[mask-image:linear-gradient(180deg,black_0%,black_88%,transparent_100%)] " +
  "[-webkit-mask-image:linear-gradient(180deg,black_0%,black_88%,transparent_100%)]";

const SKY_WAVE_PATH_CLASSES =
  "fill-none [stroke:color-mix(in_srgb,var(--color-accent)_32%,var(--color-line))] " +
  "[stroke-width:1.8] [stroke-linecap:round] [vector-effect:non-scaling-stroke]";

const CLOUD_CLASSES =
  "absolute rounded-full blur-[2px] opacity-55 " +
  "[background:radial-gradient(ellipse_at_35%_35%,color-mix(in_srgb,var(--color-panel)_92%,transparent)_0%,color-mix(in_srgb,var(--color-accent-soft)_18%,var(--color-panel))_60%,transparent_100%)] " +
  `[animation-name:siteCloudDrift] [animation-timing-function:ease-in-out] [animation-iteration-count:infinite] ${ANIMATED_PAUSED} motion-reduce:[animation-name:none]`;

const MOON_GROUP_CLASSES =
  "absolute z-0 pointer-events-none opacity-0 w-[min(62%,760px)] h-[640px] " +
  "[transition:opacity_1.8s_ease] group-data-[active=true]:opacity-100";

const MOON_AMBIENT_CLASSES =
  "absolute top-[-30%] w-[160%] h-[160%] rounded-full blur-[70px] mix-blend-screen " +
  "[background:radial-gradient(circle_at_68%_28%,rgba(238,240,234,0.20)_0%,rgba(238,240,234,0.09)_22%,rgba(170,200,255,0.05)_42%,rgba(170,200,255,0)_68%)]";

const MOON_CORONA_CLASSES =
  "absolute top-[26px] w-[210px] h-[210px] rounded-full blur-[10px] mix-blend-screen " +
  "[background:radial-gradient(circle,rgba(246,244,236,0.55)_0%,rgba(246,244,236,0.18)_45%,rgba(246,244,236,0)_75%)] " +
  `[animation-name:siteMoonBreathe] [animation-duration:7s] [animation-timing-function:ease-in-out] [animation-iteration-count:infinite] ${ANIMATED_PAUSED} ` +
  "motion-reduce:[animation-name:none] motion-reduce:opacity-85 " +
  "max-[720px]:top-[20px] max-[720px]:w-[140px] max-[720px]:h-[140px]";

const MOON_BODY_CLASSES =
  "absolute top-[46px] w-[74px] h-[74px] rounded-full " +
  "[background:radial-gradient(circle_at_38%_34%,#fbfaf4_0%,#eeece2_40%,#d3d0c2_74%,#b3b0a0_100%)] " +
  "shadow-[0_0_18px_2px_rgba(246,244,236,0.5),0_0_40px_8px_rgba(170,200,255,0.14)] " +
  "before:content-[''] before:absolute before:rounded-full before:bg-[rgba(70,65,55,0.10)] " +
  "before:w-[13px] before:h-[13px] before:top-[16px] before:left-[14px] " +
  "before:shadow-[24px_30px_0_-3px_rgba(70,65,55,0.08),10px_42px_0_-5px_rgba(70,65,55,0.07)] " +
  "after:content-[''] after:absolute after:rounded-full after:bg-[rgba(70,65,55,0.10)] " +
  "after:w-[8px] after:h-[8px] after:top-[40px] after:left-[44px] " +
  "max-[720px]:top-[34px] max-[720px]:w-[52px] max-[720px]:h-[52px]";

/* =============================================================================
   أجزاء بصرية فرعية (dark mode)
   ============================================================================= */

function StarsLayer({ stars }) {
  return stars.map((s) => (
    <span
      key={s.id}
      className={STAR_CLASSES}
      style={{
        top: `${s.top}%`,
        left: `${s.left}%`,
        width: `${s.size}px`,
        height: `${s.size}px`,
        animationDuration: `${s.duration}s`,
        animationDelay: `${s.delay}s`,
      }}
    />
  ));
}

function AuroraLayer() {
  return (
    <div
      className={AURORA_CLASSES}
      style={{
        top: "14%",
        left: "-5%",
        width: "60%",
        height: "160px",
        backgroundImage:
          "linear-gradient(120deg, rgba(140,255,200,0.18), rgba(150,210,255,0.12) 45%, rgba(210,170,255,0.14) 80%)",
      }}
    />
  );
}

function MoonLayer({ top, isRTL }) {
  const sideClass = isRTL ? "left-0" : "right-0";
  const glowSideClass = isRTL
    ? "left-[64px] -translate-x-1/2"
    : "right-[64px] translate-x-1/2";
  const ambientSideClass = isRTL ? "left-[-30%]" : "right-[-30%]";

  return (
    <div className={`${MOON_GROUP_CLASSES} ${sideClass}`} aria-hidden="true" style={{ top: `${top}px` }}>
      <div className={`${MOON_AMBIENT_CLASSES} ${ambientSideClass}`} />
      <div className={`${MOON_CORONA_CLASSES} ${glowSideClass}`} />
      <div className={`${MOON_BODY_CLASSES} ${glowSideClass}`} />
    </div>
  );
}

/* =============================================================================
   أجزاء بصرية فرعية (light mode)
   ============================================================================= */

function ThreadsLayer({ w, threadsH }) {
  const threads = buildThreadDefs(w, threadsH);
  return (
    <svg
      className={SKY_WAVES_SVG_CLASSES}
      aria-hidden="true"
      viewBox={`0 0 ${w} ${threadsH}`}
      preserveAspectRatio="none"
      style={{ height: `${threadsH}px` }}
    >
      {threads.map((th, i) => (
        <path key={i} className={SKY_WAVE_PATH_CLASSES} d={threadPath(th, w, threadsH)} />
      ))}
    </svg>
  );
}

function CloudsLayer({ clouds }) {
  return clouds.map((c) => (
    <div
      key={c.id}
      className={CLOUD_CLASSES}
      style={{
        top: `${c.top}%`,
        left: `${c.left}%`,
        width: `${180 * c.scale}px`,
        height: `${60 * c.scale}px`,
        animationDuration: `${c.duration}s`,
        animationDelay: `${c.delay}s`,
      }}
    />
  ));
}

/* =============================================================================
   الكومبوننت الرئيسي
   ============================================================================= */

// ===== الخلفية الموحّدة لكل الصفحة (طبقة واحدة بس) =====
// دي الطبقة الوحيدة المسؤولة عن: تدرّج السما/الفضاء + النجوم + الشفق
// القطبي بالليل، والسحاب بالنهار، + خيوط ثابتة في الخلفية بالنهار،
// + قمر (dark mode بس) قرب نهاية الكونتينر (عادةً قبل سيكشن Contact).
//
// ليه القمر هنا مش جوه Contact.jsx؟ لأن أي توهج (glow) لازم يكون جزء
// من نفس طبقة الخلفية عشان يندمج معاها صح. لو حطيناه كطبقة منفصلة
// فوق الخلفية، أي تدرّج شفافية عادي فوق خلفية غامقة مسطحة بيبان كحافة/
// قوس واضح للعين حتى لو "ناعم" رياضيًا. الحل: نفس تقنية الـ aurora
// اللي شغالة صح أصلاً (mix-blend-mode: screen + blur كبير) — دي اللي
// بتخلي الضوء "يدوب" في الخلفية بدل ما "يتقص" عليها.
//
// showThreads: تشغيل/تعطيل الخيوط بالكامل.
// threadsBoundaryRef: توقيف الخيوط عند نقطة معينة (زي قبل Contact).
// moonAnchorRef: مكان ظهور القمر (أعلى نقطة القمر بتتزبط عند نفس
// الارتفاع بتاع العنصر ده). لو مش موجود، مفيش قمر بيتعرض. ينفع تستخدم
// نفس الـ ref بتاع threadsBoundaryRef لو عايز القمر يبدأ من نفس نقطة
// توقف الخيوط بالظبط.
export default function SiteSky({ showThreads = true, threadsBoundaryRef = null, moonAnchorRef = null }) {
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();

  const sceneRef = useRef(null);
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");

  const stars = useSiteStars();
  const clouds = useSiteClouds();
  const dims = useSkyDimensions(sceneRef, threadsBoundaryRef, moonAnchorRef);
  const active = useActiveWhenVisible(sceneRef);

  const w = dims.w || 1;
  const h = dims.h || 1;
  const threadsH = dims.threadsH || h;
  const showMoon = isDark && dims.moonTop !== null;

  const backgroundImage = isDark
    ? "linear-gradient(180deg, #14142b 0%, #0d0d1c 32%, #05050c 62%, #05050c 100%)"
    : `linear-gradient(180deg,
        var(--color-bg) 0%,
        color-mix(in srgb, #6aab52 12%, var(--color-bg)) 6%,
        color-mix(in srgb, #6aab52 5%, var(--color-panel2)) 16%,
        var(--color-panel2) 40%,
        var(--color-panel2) 100%)`;

  return (
    <div
      ref={sceneRef}
      data-uid={uid}
      data-active={active}
      className="group absolute inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0" style={{ backgroundImage }} />

      {isDark ? (
        <>
          <AuroraLayer />
          <StarsLayer stars={stars} />
          {showMoon && <MoonLayer top={dims.moonTop} isRTL={isRTL} />}
        </>
      ) : (
        <>
          {showThreads && dims.w > 0 && threadsH > 0 && <ThreadsLayer w={w} threadsH={threadsH} />}
          <CloudsLayer clouds={clouds} />
        </>
      )}
    </div>
  );
}