"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./about.css";
import { TILT_DEG, ORBIT_RX, ORBIT_RY } from "./data";
import { pointOnOrbit } from "./utils";

const SPHERE_GRADIENT_ID = "about-planet-sphere-gradient";
const SPHERE_CLIP_ID = "about-planet-sphere-clip";
const SHADE_GRADIENT_ID = "about-planet-shade-gradient";
const SPECULAR_GRADIENT_ID = "about-planet-specular-gradient";
const RIM_GRADIENT_ID = "about-planet-rim-gradient";
const BAND_GRADIENT_ID = "about-planet-band-gradient";
const RING_GRADIENT_ID = "about-planet-ring-gradient";
const RING_CLIP_ID = "about-ring-front-clip";
const GALAXY_ARM_GRADIENT_ID = "about-galaxy-arm-gradient";
const ARROW_MARKER_ID = "about-galaxy-arrow-marker";

function OrbitGalaxy({ x, y, delay, value, label }) {
    const isLeftSide = x < 0;
    return (
        <div className="about-sat" style={{ left: `${50 + x}%`, top: `${50 + y}%` }}>
            <div className="about-sat-bob" style={{ animationDelay: `${delay}s` }}>
                <div className="about-sat-entrance" style={{ transitionDelay: `${0.15 + Math.abs(delay) * 0.02}s` }}>
                    <div
                        className={`about-sat-flip ${isLeftSide ? "is-flipped" : ""}`}
                        style={{ transform: isLeftSide ? "scaleX(-1)" : "none" }}
                    >
                        <svg className="about-galaxy-icon" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="16" fill={`url(#${GALAXY_ARM_GRADIENT_ID})`} opacity="0.28" />
                            <path
                                d="M32,10 C33,22 34,29 46,32 C34,35 33,42 32,54 C31,42 30,35 18,32 C30,29 31,22 32,10 Z"
                                fill={`url(#${GALAXY_ARM_GRADIENT_ID})`}
                            />
                            <path
                                d="M32,21 C32.5,27 33,29.5 39,32 C33,34.5 32.5,37 32,43 C31.5,37 31,34.5 25,32 C31,29.5 31.5,27 32,21 Z"
                                fill="#ffffff"
                                opacity="0.85"
                            />
                            <circle className="about-galaxy-star" cx="13" cy="15" r="2.6" fill="var(--color-accent2)" />
                            <circle className="about-galaxy-star" cx="50" cy="47" r="2" fill="var(--color-accent-soft)" />
                            <circle className="about-galaxy-star" cx="52" cy="16" r="1.4" fill="#ffffff" />
                        </svg>

                        <svg className="about-galaxy-arrow" viewBox="0 0 70 46">
                            <path
                                d="M8,10 Q40,4 62,26"
                                fill="none"
                                stroke="var(--color-accent2)"
                                strokeWidth="5"
                                strokeLinecap="round"
                                opacity="0.22"
                            />
                            <path
                                d="M8,10 Q40,4 62,26"
                                fill="none"
                                stroke="var(--color-accent2)"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                markerEnd={`url(#${ARROW_MARKER_ID})`}
                            />
                        </svg>

                        <div className="about-sat-unflip">
                            <div className="about-sat-badge">
                                <span className="about-sat-value">{value}</span>
                                <span className="about-sat-label">{label}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AboutPlanet({ stats = [] }) {
    const sceneRef = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = sceneRef.current;
        if (!el) return;

        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion) {
            setInView(true);
            return;
        }

        const io = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.25, rootMargin: "-10% 0px -10% 0px" }
        );
        io.observe(el);

        return () => io.disconnect();
    }, []);

    // اتلفت بـ useMemo عشان تتحسب بس لما stats تتغيّر فعليًا، مش كل render
    const satellites = useMemo(() => {
        const n = Math.max(stats.length, 1);
        return stats.map((s, i) => {
            const angle = i * (360 / n) - 90;
            const { x, y } = pointOnOrbit(angle, TILT_DEG, ORBIT_RX, ORBIT_RY);
            return { ...s, x, y, delay: -(i * 4) };
        });
    }, [stats]);

    return (
        <div ref={sceneRef} className={`about-planet-scene ${inView ? "is-in-view" : ""}`}>
            <div className="about-planet-glow" aria-hidden="true" />
            <div className="about-planet-cast-shadow" aria-hidden="true" />

            <svg viewBox="0 0 400 400" className="about-planet-canvas" aria-hidden="true">
                <defs>
                    <radialGradient id={SPHERE_GRADIENT_ID} cx="34%" cy="28%" r="80%">
                        <stop offset="0%" stopColor="var(--color-accent-soft)" />
                        <stop offset="52%" stopColor="var(--color-accent)" />
                        <stop offset="100%" stopColor="var(--color-accent2)" />
                    </radialGradient>
                    <clipPath id={SPHERE_CLIP_ID}>
                        <circle cx="200" cy="200" r="98" />
                    </clipPath>
                    <radialGradient id={SHADE_GRADIENT_ID} cx="30%" cy="26%" r="92%">
                        <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                        <stop offset="46%" stopColor="#000000" stopOpacity="0" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0.62" />
                    </radialGradient>
                    <radialGradient id={SPECULAR_GRADIENT_ID} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id={RIM_GRADIENT_ID} x1="0" y1="400" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
                        <stop offset="55%" stopColor="var(--color-accent-soft)" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id={BAND_GRADIENT_ID} x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--color-panel2)" stopOpacity="0" />
                        <stop offset="50%" stopColor="var(--color-panel2)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="var(--color-panel2)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id={RING_GRADIENT_ID} x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--color-accent-soft)" />
                        <stop offset="50%" stopColor="var(--color-accent2)" />
                        <stop offset="100%" stopColor="var(--color-accent-soft)" />
                    </linearGradient>
                    <clipPath id={RING_CLIP_ID}>
                        <rect x="0" y="200" width="400" height="200" />
                    </clipPath>
                </defs>

                <g transform={`rotate(${TILT_DEG} 200 200)`}>
                    <ellipse cx="200" cy="200" rx="192" ry="66" fill="none" stroke={`url(#${RING_GRADIENT_ID})`} strokeWidth="7" opacity="0.35" />
                    <ellipse cx="200" cy="200" rx="182" ry="61" fill="none" stroke="var(--color-bg)" strokeWidth="2" opacity="0.5" />
                    <ellipse cx="200" cy="200" rx="172" ry="56" fill="none" stroke={`url(#${RING_GRADIENT_ID})`} strokeWidth="13" opacity="0.9" />
                    <ellipse cx="200" cy="200" rx="150" ry="45" fill="none" stroke="var(--color-bg)" strokeWidth="1.4" opacity="0.4" />
                    <ellipse cx="200" cy="200" rx="138" ry="38" fill="none" stroke={`url(#${RING_GRADIENT_ID})`} strokeWidth="8" opacity="0.6" />

                    <circle cx="200" cy="200" r="98" fill={`url(#${SPHERE_GRADIENT_ID})`} />

                    <g className="about-planet-bands" clipPath={`url(#${SPHERE_CLIP_ID})`}>
                        <ellipse cx="200" cy="164" rx="100" ry="10" fill={`url(#${BAND_GRADIENT_ID})`} opacity="0.5" />
                        <ellipse cx="200" cy="196" rx="100" ry="14" fill={`url(#${BAND_GRADIENT_ID})`} opacity="0.35" />
                        <ellipse cx="200" cy="228" rx="100" ry="9" fill={`url(#${BAND_GRADIENT_ID})`} opacity="0.45" />
                        <ellipse cx="200" cy="252" rx="100" ry="7" fill={`url(#${BAND_GRADIENT_ID})`} opacity="0.3" />
                    </g>

                    <circle cx="200" cy="200" r="98" fill={`url(#${SHADE_GRADIENT_ID})`} />

                    <ellipse className="about-planet-specular" cx="152" cy="150" rx="30" ry="20" fill={`url(#${SPECULAR_GRADIENT_ID})`} />

                    <circle cx="200" cy="200" r="96" fill="none" stroke={`url(#${RIM_GRADIENT_ID})`} strokeWidth="2.5" opacity="0.55" />

                    <g clipPath={`url(#${RING_CLIP_ID})`}>
                        <ellipse cx="200" cy="200" rx="192" ry="66" fill="none" stroke={`url(#${RING_GRADIENT_ID})`} strokeWidth="7" opacity="0.4" />
                        <ellipse cx="200" cy="200" rx="182" ry="61" fill="none" stroke="var(--color-bg)" strokeWidth="2" opacity="0.55" />
                        <ellipse cx="200" cy="200" rx="172" ry="56" fill="none" stroke={`url(#${RING_GRADIENT_ID})`} strokeWidth="13" opacity="0.95" />
                        <ellipse cx="200" cy="200" rx="150" ry="45" fill="none" stroke="var(--color-bg)" strokeWidth="1.4" opacity="0.45" />
                        <ellipse cx="200" cy="200" rx="138" ry="38" fill="none" stroke={`url(#${RING_GRADIENT_ID})`} strokeWidth="8" opacity="0.65" />
                    </g>
                </g>
            </svg>

            <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
                <defs>
                    <marker id={ARROW_MARKER_ID} markerWidth="8" markerHeight="8" refX="4.6" refY="4" orient="auto">
                        <path d="M0,0.5 L7.5,4 L0,7.5 Q1.8,4 0,0.5 Z" fill="var(--color-accent2)" />
                    </marker>
                    <linearGradient id={GALAXY_ARM_GRADIENT_ID} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--color-accent-soft)" />
                        <stop offset="100%" stopColor="var(--color-accent2)" />
                    </linearGradient>
                </defs>
            </svg>

            {satellites.map((s, i) => (
                <OrbitGalaxy key={i} x={s.x} y={s.y} delay={s.delay} value={s.value} label={s.label} />
            ))}
        </div>
    );
}