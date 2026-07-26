"use client";

import dynamic from "next/dynamic";

// كل ديكور بيتحمّل بشكل منفصل (code-splitting) وuser-side فقط:
// - ssr:false لأن الديكورات دي بتعتمد على window.matchMedia وGSAP، ومفيش
//   داعي نصورها على السيرفر أصلاً.
// - كل واحد بيتحط في chunk منفصل، فبدل ما الصفحة تحمّل الـ 6 ديكورات
//   (وفلاتر SVG المتحركة التقيلة بتاعتهم) مرة واحدة، كل واحد بيتحمّل
//   بس وقت أول مرة يتطلب فعليًا (قرب الظهور في السكرول).
export const DECOR_COMPONENTS = {
    planet: dynamic(() => import("./PlanetDecor"), { ssr: false }),
    moon: dynamic(() => import("./MoonDecor"), { ssr: false }),
    rocket: dynamic(() => import("./RocketDecor"), { ssr: false }),
    sun: dynamic(() => import("./SunDecor"), { ssr: false }),
    earth: dynamic(() => import("./EarthDecor"), { ssr: false }),
    mars: dynamic(() => import("./MarsDecor"), { ssr: false }),
};
