"use client";

import { useTheme } from "@/context/ThemeContext";
import "./hero.css";
import { ICON, STARS, CLOUDS, METEORS, FLYING_BIRDS, TREES, GRASS_TUFTS, FLOWERS, STANDING_BIRDS, BUNNY_KEYFRAMES } from "./data";
import { waveY, round } from "./utils";

// ===== أرنب مرسوم بأجزاء منفصلة =====
function BunnySVG({ size = 34 }) {
    return (
        <svg viewBox="0 0 64 56" width={size} height={size} style={{ overflow: "visible", display: "block" }}>
            <g className="bunny-leg-back" style={{ transformOrigin: "18px 40px" }}>
                <ellipse cx="15" cy="45" rx="8" ry="5.5" fill="#c7a27a" />
            </g>
            <g className="bunny-body" style={{ transformOrigin: "30px 44px" }}>
                <ellipse cx="30" cy="34" rx="19" ry="15" fill="#d9b48f" />
                <circle cx="45" cy="24" r="10" fill="#e0bd93" />
                <circle cx="49" cy="21" r="1.3" fill="#3a2a1a" />
                <ellipse cx="14" cy="30" rx="4.5" ry="4" fill="#f2e2cd" />
            </g>
            <g className="bunny-leg-front" style={{ transformOrigin: "42px 40px" }}>
                <ellipse cx="43" cy="46" rx="5" ry="4" fill="#c7a27a" />
            </g>
            <g className="bunny-ear-l" style={{ transformOrigin: "26px 20px" }}>
                <ellipse cx="24" cy="8" rx="4.2" ry="15" fill="#c7a27a" />
                <ellipse cx="24" cy="8" rx="2" ry="11" fill="#e8c9a8" />
            </g>
            <g className="bunny-ear-r" style={{ transformOrigin: "34px 20px" }}>
                <ellipse cx="34" cy="7" rx="4.2" ry="15" fill="#c7a27a" />
                <ellipse cx="34" cy="7" rx="2" ry="11" fill="#e8c9a8" />
            </g>
        </svg>
    );
}

function BirdSVG({ size = 28, flying = true }) {
    return (
        <svg viewBox="0 0 44 34" width={size} height={size} style={{ overflow: "visible", display: "block" }}>
            <ellipse cx="20" cy="18" rx="12" ry="8" fill="#e2574c" />
            <circle cx="30" cy="12" r="6" fill="#e2574c" />
            <path d="M35 11 L41 13 L35 15 Z" fill="#f2a83c" />
            <circle cx="32" cy="10" r="1.1" fill="#20140f" />
            <path d="M9 21 L11 26 M17 22 L19 27" stroke="#f2a83c" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <g className={flying ? "wing-flap" : "wing-idle"} style={{ transformOrigin: "18px 15px" }}>
                <ellipse cx="11" cy="15" rx="11" ry="5" fill="#c94236" />
            </g>
        </svg>
    );
}

function GrassField() {
    const steps = 48;
    const points = Array.from({ length: steps + 1 }).map((_, i) => {
        const xp = (i / steps) * 100;
        return `${round(xp * 10, 2)},${round(waveY(xp), 2)}`;
    });
    const path = `M0,${round(waveY(0), 2)} L${points.join(" L")} L1000,140 L0,140 Z`;

    return (
        <>
            <svg
                viewBox="0 0 1000 140"
                preserveAspectRatio="none"
                className="absolute bottom-0 left-0 w-full"
                style={{ height: "140px" }}
            >
                <defs>
                    <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8ac96a" />
                        <stop offset="45%" stopColor="#6aab52" />
                        <stop offset="100%" stopColor="#4c8a3c" />
                    </linearGradient>
                </defs>
                <path d={path} fill="url(#groundGrad)" style={{ filter: "drop-shadow(0 -2px 6px rgba(30,60,20,0.12))" }} />
            </svg>

            {GRASS_TUFTS.map((t) => (
                <img
                    key={t.id}
                    src={t.icon}
                    alt=""
                    width={22}
                    height={22}
                    className="absolute select-none"
                    style={{
                        left: `${t.left}%`,
                        bottom: `${t.bottom}px`,
                        transform: `translateX(-50%) scale(${t.scale}) ${t.flip ? "scaleX(-1)" : ""}`,
                    }}
                />
            ))}

            {FLOWERS.map((f) => (
                <img
                    key={f.id}
                    src={ICON.blossom}
                    alt=""
                    width={16}
                    height={16}
                    className="absolute select-none"
                    style={{ left: `${f.left}%`, bottom: `${f.bottom}px`, transform: "translateX(-50%)" }}
                />
            ))}
        </>
    );
}

export default function HeroSky() {
    const { isDark } = useTheme();

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* الحاجة الديناميكية الوحيدة اللي فضلت — مسار قفز الأرنب، لأنه
                فعلاً متولّد من waveY() ومش ممكن يتحط CSS ثابت. الباقي كله
                في hero.css */}
            <style>{BUNNY_KEYFRAMES}</style>

            {/* خلفية السما */}
            <div
                className="absolute inset-0 transition-colors duration-700"
                style={{
                    backgroundImage: isDark
                        ? "linear-gradient(180deg, #05050c 0%, #0d0d1c 55%, #14142b 100%)"
                        : "linear-gradient(180deg, #cfe8ff 0%, #eaf5ff 55%, var(--color-bg) 100%)",
                }}
            />

            {isDark && (
                <div className="absolute inset-x-0 top-0 overflow-hidden pointer-events-none" style={{ height: "50%" }}>
                    <div
                        className="aurora-band"
                        style={{
                            top: "-15%", left: "-10%", width: "75%", height: "170px",
                            backgroundImage: "linear-gradient(120deg, rgba(140,255,200,0.28), rgba(150,210,255,0.2) 45%, rgba(210,170,255,0.22) 80%)",
                            animationDuration: "10s",
                        }}
                    />
                    <div
                        className="aurora-band"
                        style={{
                            top: "0%", left: "15%", width: "85%", height: "190px",
                            backgroundImage: "linear-gradient(100deg, rgba(160,255,215,0.22), rgba(160,190,255,0.16) 50%, rgba(255,255,255,0.08) 90%)",
                            animationDuration: "14s", animationDelay: "-4s",
                        }}
                    />
                </div>
            )}

            {STARS.map((s) => (
                <span
                    key={s.id}
                    className="absolute rounded-full bg-white transition-opacity duration-700"
                    style={{
                        top: `${s.top}%`,
                        left: `${s.left}%`,
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        opacity: isDark ? undefined : 0,
                        animation: isDark ? `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite` : "none",
                    }}
                />
            ))}

            {isDark &&
                METEORS.map((m, i) => (
                    <span
                        key={i}
                        className="meteor-track"
                        style={{ top: `${m.top}%`, left: `${m.left}%`, transform: `rotate(${m.angle}deg)` }}
                    >
                        <span
                            className="meteor"
                            style={{
                                width: `${m.length}px`,
                                animationDuration: `${m.duration}s`,
                                animationDelay: `${m.delay}s`,
                                "--dist": `${m.distance}px`,
                            }}
                        >
                            <span className="meteor-head" />
                        </span>
                    </span>
                ))}

            <div
                className="absolute rounded-full transition-opacity duration-700"
                style={{
                    top: "12%", insetInlineEnd: "10%", width: "70px", height: "70px",
                    opacity: isDark ? 1 : 0,
                    backgroundImage: "radial-gradient(circle at 35% 35%, #f5f3ff, #cfc7e8 60%, #a89bcf)",
                    boxShadow: "0 0 50px 8px rgba(200,190,255,0.35)",
                }}
            >
                <span className="absolute rounded-full bg-black/10" style={{ width: 14, height: 14, top: 14, left: 16 }} />
                <span className="absolute rounded-full bg-black/10" style={{ width: 9, height: 9, top: 34, left: 40 }} />
                <span className="absolute rounded-full bg-black/10" style={{ width: 7, height: 7, top: 44, left: 18 }} />
            </div>

            <div
                className="absolute transition-opacity duration-700"
                style={{ top: "5%", insetInlineEnd: "8%", width: "150px", height: "150px", opacity: isDark ? 0 : 1 }}
            >
                <span
                    className="absolute inset-0 rounded-full"
                    style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,200,110,0.45), transparent 70%)",
                        animation: "glowPulse 4s ease-in-out infinite",
                    }}
                />
                <span
                    className="absolute rounded-full"
                    style={{
                        top: "18px", insetInlineStart: "18px", width: "114px", height: "114px",
                        backgroundImage: "repeating-conic-gradient(from 0deg, rgba(255,236,190,0.55) 0deg 3deg, transparent 3deg 18deg)",
                        filter: "blur(0.6px)", animation: "sunRotate 100s linear infinite", opacity: 0.7,
                    }}
                />
                <span
                    className="absolute rounded-full"
                    style={{
                        top: "24px", insetInlineStart: "24px", width: "102px", height: "102px",
                        backgroundImage: "radial-gradient(circle, rgba(255,214,140,0.55), transparent 72%)",
                    }}
                />
                <div
                    className="absolute rounded-full"
                    style={{
                        top: "43px", insetInlineStart: "43px", width: "64px", height: "64px",
                        backgroundImage: "radial-gradient(circle at 38% 35%, #fffaf0 0%, #ffe17d 35%, #ffb347 68%, #ff8a3d 100%)",
                        boxShadow: "0 0 30px 6px rgba(255,180,90,0.5)",
                    }}
                />
            </div>

            {!isDark && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {CLOUDS.map((c) => (
                        <img
                            key={c.id}
                            src={ICON.cloud}
                            alt=""
                            width={100}
                            height={70}
                            className="cloud-drift select-none"
                            style={{
                                top: `${c.top}%`,
                                opacity: c.opacity,
                                filter: c.blur ? `blur(${c.blur}px) drop-shadow(0 8px 8px rgba(60,70,110,0.15))` : "drop-shadow(0 8px 8px rgba(60,70,110,0.15))",
                                animationDuration: `${c.duration}s`,
                                animationDelay: `${c.delay}s`,
                                transform: `scale(${c.scale}) ${c.flip ? "scaleX(-1)" : ""}`,
                            }}
                        />
                    ))}

                    {FLYING_BIRDS.map((b, i) => (
                        <div
                            key={i}
                            className="bird-fly"
                            style={{ top: `${b.top}%`, animationDuration: `${b.duration}s, 1.4s`, animationDelay: `${b.delay}s, 0s`, "--bs": b.scale }}
                        >
                            <BirdSVG size={30} flying />
                        </div>
                    ))}
                </div>
            )}

            {!isDark && (
                <div className="absolute inset-x-0 bottom-0 z-[5] pointer-events-none" style={{ height: "220px" }}>
                    <GrassField />

                    {TREES.map((t, i) => (
                        <img
                            key={i}
                            src={t.icon}
                            alt=""
                            width={64}
                            height={64}
                            className="absolute tree-sway select-none"
                            style={{
                                left: `${t.left}%`,
                                bottom: `${t.bottom}px`,
                                transform: `translateX(-50%) scale(${t.scale})`,
                                "--sway": `${t.sway}deg`,
                                filter: "drop-shadow(0 6px 5px rgba(20,35,15,0.25))",
                            }}
                        />
                    ))}

                    {STANDING_BIRDS.map((b, i) => (
                        <div
                            key={i}
                            className="absolute peck select-none"
                            style={{
                                left: `${b.left}%`,
                                bottom: `${b.bottom}px`,
                                animationDelay: b.delay ? `${b.delay}s` : undefined,
                                transform: b.flip ? "scaleX(-1)" : undefined,
                            }}
                        >
                            <BirdSVG size={24} flying={false} />
                        </div>
                    ))}

                    <div className="butterfly-path" style={{ left: "14%", bottom: "120px" }}>
                        <img src={ICON.butterfly} alt="" width={26} height={26} className="wing-flutter select-none" />
                    </div>

                    <div className="bunny-wrap">
                        <div className="bunny-shadow" />
                        <div className="bunny-hop-bounce">
                            <BunnySVG size={34} />
                        </div>
                    </div>

                    <div
                        className="absolute inset-x-0 bottom-0 pointer-events-none"
                        style={{
                            height: "26px",
                            backgroundImage: "linear-gradient(180deg, transparent 0%, color-mix(in srgb, #4c8a3c 8%, var(--color-bg)) 70%, var(--color-bg) 100%)",
                        }}
                    />
                </div>
            )}
        </div>
    );
}