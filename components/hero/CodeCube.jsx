"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { runCpp } from "@/lib/piston";
import { useLanguage } from "@/context/LanguageContext";
import "./hero.css";
import { CODE_TOKENS, CODE_LEN, SOURCE_CODE, TOKEN_COLORS, KEYWORDS, TYPES, TOKEN_RE } from "./data";

const FONT_STACK = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const ACCENT_GRADIENT = "linear-gradient(135deg, var(--color-accent-soft), var(--color-accent2))";
const sleep = (ms) => new Promise((r) => setTimeout(r, Math.max(0, ms)));

function highlightCpp(code) {
    const nodes = [];
    let m;
    let key = 0;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(code)) !== null) {
        const [full, comment, blockComment, dstr, sstr, pre, num, ident] = m;
        let cls = "pl";
        if (comment || blockComment) cls = "cm";
        else if (dstr || sstr) cls = "str";
        else if (pre) cls = "kw";
        else if (num) cls = "nu";
        else if (ident) {
            if (KEYWORDS.has(ident)) cls = "kw";
            else if (TYPES.has(ident)) cls = "ty";
            else cls = code[TOKEN_RE.lastIndex] === "(" ? "fn" : "pl";
        }
        nodes.push(
            <span key={key++} style={{ color: TOKEN_COLORS[cls] }}>
                {full}
            </span>
        );
    }
    return nodes;
}

function charAt(tokens, globalIndex) {
    let remaining = globalIndex;
    for (const tk of tokens) {
        if (remaining < tk.t.length) return tk.t[remaining];
        remaining -= tk.t.length;
    }
    return "";
}

function renderVisibleTokens(tokens, revealCount) {
    const out = [];
    let remaining = revealCount;
    for (let i = 0; i < tokens.length; i++) {
        if (remaining <= 0) break;
        const tk = tokens[i];
        const slice = tk.t.length <= remaining ? tk.t : tk.t.slice(0, remaining);
        remaining -= slice.length;
        if (slice.length > 0) out.push({ key: i, text: slice, c: tk.c });
    }
    return out;
}

function RunResultModal({ open, running, result, onClose, t }) {
    const [mounted, setMounted] = useState(false);
    const overlayRef = useRef(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape" && !running) onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, running, onClose]);

    useEffect(() => {
        if (!open) return;
        const el = overlayRef.current;
        if (!el) return;
        const onWheel = (e) => {
            const scrollable = e.target.closest("[data-scrollable]");
            if (scrollable) {
                const atTop = scrollable.scrollTop === 0 && e.deltaY < 0;
                const atBottom =
                    Math.ceil(scrollable.scrollTop + scrollable.clientHeight) >= scrollable.scrollHeight && e.deltaY > 0;
                if (!atTop && !atBottom) return;
            }
            e.preventDefault();
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [open]);

    if (!mounted || !open) return null;

    const statusMeta = running
        ? { label: t("codeCube.compiling"), color: "var(--color-accent-soft)", solid: "#8385f7", icon: null }
        : result?.stage === "compile"
        ? { label: t("codeCube.compileError"), color: "#ff5555", solid: "#ff5555", icon: "✗" }
        : result?.ok
        ? { label: t("codeCube.success"), color: "var(--color-accent2)", solid: "#f472b6", icon: "✓" }
        : { label: t("codeCube.runtimeError"), color: "#ff5555", solid: "#ff5555", icon: "✗" };

    return createPortal(
        <div
            ref={overlayRef}
            dir="ltr"
            className="run-modal-overlay"
            style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, direction: "ltr" }}
            onClick={(e) => {
                if (e.target === e.currentTarget && !running) onClose();
            }}
        >
            <div className="run-modal-backdrop" />

            <div
                className="run-modal-card"
                style={{
                    position: "relative",
                    width: "min(480px, 92vw)",
                    borderRadius: 22,
                    padding: "34px 30px 28px",
                    background: "linear-gradient(165deg, #232332 0%, #191924 65%, #14141d 100%)",
                    border: `1px solid ${statusMeta.solid}45`,
                    boxShadow: `0 40px 90px -25px rgba(0,0,0,0.65), 0 0 70px -12px ${statusMeta.solid}40, inset 0 1px 0 rgba(255,255,255,0.06)`,
                }}
            >
                {!running && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="close"
                        className="run-modal-close"
                        style={{
                            position: "absolute", top: 14, right: 14, width: 28, height: 28, borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                            color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1, cursor: "pointer",
                        }}
                    >
                        ✕
                    </button>
                )}

                <div
                    className="run-modal-glow"
                    style={{
                        position: "absolute", inset: 0, borderRadius: 22, pointerEvents: "none",
                        background: `radial-gradient(circle at 50% -10%, ${statusMeta.solid}25, transparent 60%)`,
                    }}
                />

                <div className="relative flex flex-col items-center gap-4 text-center">
                    {running ? (
                        <>
                            <div
                                className="run-modal-spinner-ring"
                                style={{
                                    width: 64, height: 64, borderRadius: "50%",
                                    border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "transparent",
                                    background: `conic-gradient(from 0deg, transparent, ${ACCENT_GRADIENT.match(/#[0-9a-fA-F]{3,6}/g)?.[0] || "#6366F1"})`,
                                    WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)",
                                    mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)",
                                }}
                            />
                            <div className="flex flex-col items-center gap-1.5">
                                <span
                                    className="text-[14px] font-mono tracking-wide"
                                    style={{ background: ACCENT_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontFamily: FONT_STACK }}
                                >
                                    {t("codeCube.compiling")}
                                </span>
                                <span className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.35)", fontFamily: FONT_STACK }}>
                                    g++ -O2 solution.cpp &amp;&amp; ./solution
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className="run-modal-icon"
                                style={{
                                    width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", background: result?.ok ? ACCENT_GRADIENT : statusMeta.solid,
                                    border: `1.5px solid ${statusMeta.solid}70`, boxShadow: `0 0 34px ${statusMeta.solid}40`,
                                    fontSize: 28, fontWeight: 700,
                                }}
                            >
                                {statusMeta.icon}
                            </div>

                            <span
                                className="text-[14px] font-mono tracking-wide"
                                style={
                                    result?.ok
                                        ? { background: ACCENT_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", fontFamily: FONT_STACK }
                                        : { color: statusMeta.solid, fontFamily: FONT_STACK }
                                }
                            >
                                {statusMeta.label}
                            </span>

                            <pre
                                dir="ltr"
                                data-scrollable
                                className="run-modal-output w-full m-0 px-4 py-3.5 rounded-xl text-[12.5px] whitespace-pre-wrap break-words overflow-auto text-left"
                                style={{ fontFamily: FONT_STACK, color: "#e7e9f3", background: "rgba(0,0,0,0.32)", border: `1px solid ${statusMeta.solid}35`, maxHeight: "40vh", lineHeight: "19px", direction: "ltr" }}
                            >
                                {result?.output || ""}
                            </pre>

                            <button
                                type="button"
                                onClick={onClose}
                                className="text-[11.5px] font-mono px-4 py-1.5 rounded-lg mt-1 transition-colors"
                                style={{ fontFamily: FONT_STACK, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}
                            >
                                {t("codeCube.backToCode")}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default function CodeCube() {
    const { t } = useLanguage();
    const wrapRef = useRef(null);
    const cardRef = useRef(null);
    const sheenRef = useRef(null);
    const cancelledRef = useRef({ v: false });
    const floatTweenRef = useRef(null);

    const [phase, setPhase] = useState("intro");
    const [codeReveal, setCodeReveal] = useState(0);
    const [code, setCode] = useState(SOURCE_CODE);
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const textareaRef = useRef(null);
    const preRef = useRef(null);
    const gutterRef = useRef(null);

    const visibleIntroCode = useMemo(() => renderVisibleTokens(CODE_TOKENS, codeReveal), [codeReveal]);

    useEffect(() => {
        cancelledRef.current.v = false;

        // بنعمل setState كل حرفين بدل كل حرف — بينص عدد الـ re-renders
        // خلال أنيميشن الكتابة (كانت ~300 render، بقت ~150) من غير ما
        // تأثر على شكل الكتابة، وبنفس المدة الزمنية تقريبًا.
        async function typeIntro() {
            let count = 0;
            while (count < CODE_LEN) {
                if (cancelledRef.current.v) return;
                const ch = charAt(CODE_TOKENS, count);
                count++;
                let delay = 18 + Math.random() * 26;
                if (ch === "\n") delay += 140;
                if (ch === ";") delay += 60;
                await sleep(delay);
                if (cancelledRef.current.v) return;
                if (count % 2 === 0 || count === CODE_LEN || ch === "\n" || ch === ";") {
                    setCodeReveal(count);
                }
            }
            if (cancelledRef.current.v) return;
            await sleep(400);
            if (cancelledRef.current.v) return;
            setPhase("ready");
        }

        typeIntro();
        return () => {
            cancelledRef.current.v = true;
        };
    }, []);

    const handleRun = useCallback(async () => {
        if (running || phase !== "ready") return;
        setRunning(true);
        setModalOpen(true);
        const r = await runCpp(code);
        setResult(r);
        setRunning(false);
    }, [code, running, phase]);

    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                handleRun();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [handleRun]);

    const syncScroll = () => {
        const ta = textareaRef.current;
        if (!ta) return;
        if (preRef.current) {
            preRef.current.scrollTop = ta.scrollTop;
            preRef.current.scrollLeft = ta.scrollLeft;
        }
        if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop;
    };

    const handleKeyDown = (e) => {
        if (e.key !== "Tab") return;
        e.preventDefault();
        const ta = e.target;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const next = code.slice(0, start) + "    " + code.slice(end);
        setCode(next);
        requestAnimationFrame(() => {
            ta.selectionStart = ta.selectionEnd = start + 4;
        });
    };

    const lineCount = code.split("\n").length;

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;

        const onWheel = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (phase === "ready" && textareaRef.current) {
                textareaRef.current.scrollTop += e.deltaY;
                syncScroll();
            }
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [phase]);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        gsap.set(card, { transformPerspective: 900, transformOrigin: "50% 50%" });
        gsap.to(card, { rotationX: 6, rotationY: -10, duration: 0.01 });
        floatTweenRef.current = gsap.to(card, { y: -8, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });

        return () => floatTweenRef.current?.kill();
    }, []);

    useEffect(() => {
        if (phase !== "ready") return;
        const card = cardRef.current;
        if (!card) return;
        floatTweenRef.current?.kill();
        gsap.to(card, { rotationX: 0, rotationY: 0, y: 0, duration: 0.5, ease: "power3.out" });
        if (sheenRef.current) sheenRef.current.style.opacity = "0";
    }, [phase]);

    const handleMouseMove = (e) => {
        if (phase !== "intro") return;
        const el = wrapRef.current;
        if (!el || !cardRef.current) return;
        const rect = el.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;

        gsap.to(cardRef.current, { rotationY: -10 + (relX - 0.5) * 18, rotationX: 6 - (relY - 0.5) * 14, duration: 0.6, ease: "power3.out" });

        if (sheenRef.current) {
            sheenRef.current.style.setProperty("--mx", `${relX * 100}%`);
            sheenRef.current.style.setProperty("--my", `${relY * 100}%`);
        }
    };

    const handleMouseEnter = () => {
        if (phase !== "intro") return;
        if (sheenRef.current) sheenRef.current.style.opacity = "1";
    };

    const handleMouseLeave = () => {
        if (phase !== "intro") return;
        if (sheenRef.current) sheenRef.current.style.opacity = "0";
        gsap.to(cardRef.current, { rotationY: -10, rotationX: 6, duration: 0.9, ease: "power3.out" });
    };

    const isIntro = phase === "intro";
    const canRun = phase === "ready" && !running;

    return (
        <div
            ref={wrapRef}
            className={`hidden md:block ${isIntro ? "select-none" : ""}`}
            style={{ perspective: "900px", width: 400, height: 320 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={cardRef}
                dir="ltr"
                className="relative w-full h-full rounded-2xl overflow-hidden flex flex-col"
                style={{
                    direction: "ltr", transformStyle: "preserve-3d", willChange: "transform",
                    background: "linear-gradient(165deg, #232332 0%, #191924 65%, #14141d 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 30px 60px -20px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
            >
                <div
                    className="absolute -inset-px rounded-2xl pointer-events-none"
                    style={{
                        padding: 1,
                        background: "linear-gradient(135deg, var(--color-accent-soft), transparent 40%, transparent 60%, var(--color-accent2))",
                        opacity: 0.5,
                        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                    }}
                />

                <div className="relative flex items-center gap-2 px-4 py-3 shrink-0" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f56" }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#27c93f" }} />
                    <span className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.45)", fontFamily: FONT_STACK }}>
                        solution.cpp — zsh
                    </span>

                    <span
                        className="w-1.5 h-1.5 rounded-full term-live-dot"
                        style={{ background: isIntro ? "var(--color-accent2)" : "transparent", boxShadow: isIntro ? "0 0 6px var(--color-accent2)" : "none" }}
                    />

                    <button
                        type="button"
                        onClick={handleRun}
                        disabled={!canRun}
                        title={canRun ? t("codeCube.runTooltipReady") : t("codeCube.runTooltipWaiting")}
                        className={`ml-auto flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-mono transition-all ${canRun ? "run-btn-pulse cursor-pointer" : "cursor-default opacity-50"}`}
                        style={{
                            fontFamily: FONT_STACK,
                            background: canRun ? ACCENT_GRADIENT : "rgba(255,255,255,0.05)",
                            color: canRun ? "#fff" : "rgba(255,255,255,0.4)",
                            border: canRun ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)",
                            boxShadow: canRun ? "0 4px 14px -4px rgba(99,102,241,0.55)" : "none",
                        }}
                    >
                        {running ? (
                            <>
                                <span className="spinner" />
                                {t("codeCube.running")}
                            </>
                        ) : (
                            <>▶ {t("codeCube.run")}</>
                        )}
                    </button>
                </div>

                <div className="relative flex-1 min-h-0">
                    {isIntro ? (
                        <pre
                            dir="ltr"
                            className="relative px-4 py-3 text-[11.5px] leading-[19px] overflow-hidden h-full"
                            style={{ margin: 0, whiteSpace: "pre", direction: "ltr", textAlign: "left", fontFamily: FONT_STACK }}
                        >
                            {visibleIntroCode.map((tk) => (
                                <span key={tk.key} style={{ color: TOKEN_COLORS[tk.c] }}>
                                    {tk.text}
                                </span>
                            ))}
                            <span className="term-caret" />
                        </pre>
                    ) : (
                        <div className="relative flex h-full" dir="ltr" style={{ direction: "ltr" }}>
                            <div
                                ref={gutterRef}
                                className="select-none px-2 py-3 text-[11.5px] overflow-hidden shrink-0"
                                style={{ fontFamily: FONT_STACK, lineHeight: "19px", color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.02)", minWidth: 34, textAlign: "right" }}
                            >
                                {Array.from({ length: lineCount }).map((_, i) => (
                                    <div key={i}>{i + 1}</div>
                                ))}
                            </div>

                            <div className="relative flex-1">
                                <pre
                                    ref={preRef}
                                    aria-hidden
                                    dir="ltr"
                                    className="absolute inset-0 m-0 px-3 py-3 text-[11.5px] overflow-auto pointer-events-none"
                                    style={{ fontFamily: FONT_STACK, lineHeight: "19px", whiteSpace: "pre-wrap", wordBreak: "break-word", direction: "ltr", textAlign: "left" }}
                                >
                                    {highlightCpp(code)}
                                    <br />
                                </pre>

                                <textarea
                                    ref={textareaRef}
                                    dir="ltr"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    onScroll={syncScroll}
                                    onKeyDown={handleKeyDown}
                                    spellCheck={false}
                                    autoCapitalize="off"
                                    autoCorrect="off"
                                    className="absolute inset-0 w-full h-full px-3 py-3 text-[11.5px] resize-none outline-none border-none"
                                    style={{
                                        fontFamily: FONT_STACK, lineHeight: "19px", whiteSpace: "pre-wrap", wordBreak: "break-word",
                                        background: "transparent", color: "transparent", caretColor: "#f8f8f2",
                                        direction: "ltr", textAlign: "left", unicodeBidi: "plaintext", overflowY: "auto",
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div ref={sheenRef} className="term-sheen" />
            </div>

            <RunResultModal open={modalOpen} running={running} result={result} onClose={() => setModalOpen(false)} t={t} />
        </div>
    );
}