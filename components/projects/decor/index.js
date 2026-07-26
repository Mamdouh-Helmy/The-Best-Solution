"use client";

import dynamic from "next/dynamic";

// كل بانل ديكور (صاروخ/كوكب/قمر صناعي/مذنّب) بيتحمّل بشكل منفصل
// (code-splitting) وclient-side فقط، بدل ما الأربعة يكونوا جوه الـ
// bundle الرئيسي من أول تحميل للصفحة.
export const DECOR_COMPONENTS = {
    rocket: dynamic(() => import("./RocketDecor"), { ssr: false }),
    planet: dynamic(() => import("./PlanetDecor"), { ssr: false }),
    satellite: dynamic(() => import("./SatelliteDecor"), { ssr: false }),
    comet: dynamic(() => import("./CometDecor"), { ssr: false }),
};
