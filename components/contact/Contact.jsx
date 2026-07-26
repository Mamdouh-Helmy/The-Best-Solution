"use client";

import { useCallback, useEffect, useId, useMemo, useReducer, useRef } from "react";
import { HighlightMark, PointerArrow, UnderlineLastWord, CircleMark, TripleArrows } from "@/components/ui/TextMarks";
import BlobButton from "@/components/ui/BlobButton";
import { useLanguage } from "@/context/LanguageContext";

import "./contact.css";
import { PATH_D, FIELD_KEYS, MAX_TERMINAL_LINES, validateField, initialFormState, formReducer } from "./data";
import { tr } from "./utils";
import FormField from "./FormField";

const clamp01 = (v) => Math.min(1, Math.max(0, v));

// =====================================================================
// سيكشن "تواصل معنا" — نسخة "Signal Trajectory"
//
// ===== إعادة هيكلة كاملة لأنيميشن الخط (بدل ScrollTrigger) =====
// المشكلة الجذرية اللي كانت موجودة قبل كده: ScrollTrigger بيحسب
// start/end بالبكسل مرة واحدة وقت الإنشاء، وبيفضل "مصدّق" الأرقام دي
// لحد ما حد ينادي refresh() يدويًا. أي حل بيعتمد على "امتى أعمل
// refresh بالظبط" هيفضل هش، لأن أي سيكشن فوق (زي Testimonials) ممكن
// يغيّر طوله في أي لحظة (بعد fetch من API)، وفيه احتمال دايم إن
// اللحظة دي تحصل في توقيت غلط. كمان لو الصفحة بتستخدم smooth-scroll
// (Lenis)، فيه احتمال تضارب بين حلقة تحديث Lenis وحلقة ScrollTrigger.
//
// الحل: نشيل فكرة "احسب مرة واحدة واحتفظ بالنتيجة" خالص. بدل كده، في
// كل تحديث سكرول، بنقيس مكان .sig-track *حي* من الـ DOM مباشرة عن
// طريق getBoundingClientRect() — قياس مستحيل يبقى قديم لأنه بيتعمل من
// جديد كل مرة، مفيش قيمة متخزّنة نحتاج "نحدّثها". أي سيكشن مهما يكون
// غيّر طوله، النتيجة صح تلقائيًا لأنها بتعكس واقع الصفحة اللحظي.
//
// الاستماع بقى عن طريق window "scroll" العادي (مش ScrollTrigger) —
// وده شغال تمام مع Lenis لأن الأخير (بدون wrapper/content options)
// بيحرك الـ scroll الحقيقي للمتصفح فعليًا، مش transform وهمي، فأي
// "scroll" listener عادي بيتفعل بنفس التوقيت الطبيعي. كل تحديث
// بيتلف جوه requestAnimationFrame عشان يفضل مربوط بمعدل الرسم
// (frame rate) ومايتكررش زيادة عن اللازم.
//
// نفس المبدأ اتطبّق على ظهور الـ "stops" الثلاثة (بدل ScrollTrigger
// onEnter/onLeaveBack): IntersectionObserver + CSS transition، بنفس
// النمط المستخدم أصلاً في الموقع لتفعيل is-active. ده شال الاعتماد
// على gsap/ScrollTrigger من الملف ده بالكامل.
// =====================================================================

export default function Contact() {
    const { t, isRTL } = useLanguage();
    const rawId = useId();
    const uid = rawId.replace(/:/g, "");

    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const calcPathRef = useRef(null);
    const progressPathRef = useRef(null);
    const markerRef = useRef(null);
    const trailRefs = useRef([]);
    const percentRef = useRef(null);
    const stopRefs = useRef([]);
    const fieldRefs = useRef({});
    const timeoutsRef = useRef([]);

    const [form, dispatch] = useReducer(formReducer, initialFormState);

    const LOG_LINES = useMemo(
        () => [
            tr(t, "contact.log1", "> establishing secure channel"),
            tr(t, "contact.log2", "> encrypting payload"),
            tr(t, "contact.log3", "> transmitting to ground control"),
            tr(t, "contact.log4", "> transmission received ✓"),
        ],
        [t]
    );

    useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), []);

    const handleChange = useCallback(
        (key) => (e) => {
            const value = e.target.value;
            dispatch({
                type: "CHANGE",
                key,
                value,
                error: form.errors[key] ? validateField(t, key, value) : undefined,
            });
        },
        [t, form.errors]
    );

    const handleBlur = useCallback(
        (key) => (e) => {
            dispatch({ type: "BLUR", key, error: validateField(t, key, e.target.value) });
        },
        [t]
    );

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (form.status === "sending") return;

            const errors = {
                name: validateField(t, "name", form.values.name),
                contact: validateField(t, "contact", form.values.contact),
                message: validateField(t, "message", form.values.message),
            };
            const invalidKeys = FIELD_KEYS.filter((k) => errors[k]);

            if (invalidKeys.length > 0) {
                dispatch({
                    type: "SUBMIT_INVALID",
                    errors,
                    shakeKeys: Object.fromEntries(invalidKeys.map((k) => [k, true])),
                });
                fieldRefs.current[invalidKeys[0]]?.focus({ preventScroll: true });
                return;
            }

            dispatch({ type: "START_SENDING" });
            timeoutsRef.current.forEach(clearTimeout);

            timeoutsRef.current = [
                setTimeout(() => dispatch({ type: "APPEND_LOG", line: LOG_LINES[0] }), 480),
                setTimeout(() => dispatch({ type: "APPEND_LOG", line: LOG_LINES[1] }), 960),
            ];

            fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form.values),
            })
                .then(async (res) => {
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok) {
                        const err = new Error(data.error || "failed");
                        err.fieldErrors = data.errors;
                        throw err;
                    }
                    dispatch({ type: "APPEND_LOG", line: LOG_LINES[2] });
                    timeoutsRef.current.push(
                        setTimeout(() => {
                            dispatch({ type: "APPEND_LOG", line: LOG_LINES[3] });
                            dispatch({ type: "SET_SENT" });
                        }, 480)
                    );
                })
                .catch((err) => {
                    const fieldErrors = err.fieldErrors;
                    const mappedErrors = fieldErrors
                        ? Object.fromEntries(
                              Object.entries(fieldErrors).map(([k, msg]) => [k, `> ${k}: ${msg}`])
                          )
                        : { message: tr(t, "contact.errors.sendFailed", "> transmission failed — try again") };

                    dispatch({
                        type: "SEND_FAILED",
                        errors: mappedErrors,
                        shakeKeys: Object.fromEntries(Object.keys(mappedErrors).map((k) => [k, true])),
                    });
                });
        },
        [form.status, form.values, t, LOG_LINES]
    );

    // تفعيل الأنيميشن الخلفي بس وقت ظهور السيكشن
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const reduceMotion =
            typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
            el.classList.add("is-active");
            return;
        }
        const io = new IntersectionObserver(
            ([entry]) => el.classList.toggle("is-active", entry.isIntersecting),
            { threshold: 0, rootMargin: "20% 0px 20% 0px" }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // ظهور كل "stop" لوحده — IntersectionObserver + CSS transition بدل
    // ScrollTrigger. كل عنصر بيتفعله كلاس is-visible لما يدخل الشاشة،
    // وبيتشال لما يخرج لفوق تاني (نفس toggleActions "play none none
    // reverse" القديمة، بس بدون أي حساب مواقع مسبق).
    useEffect(() => {
        const reduceMotion =
            typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion) {
            stopRefs.current.forEach((el) => el?.classList.add("is-visible"));
            return;
        }

        const observers = stopRefs.current.map((el) => {
            if (!el) return null;
            const io = new IntersectionObserver(([entry]) => el.classList.toggle("is-visible", entry.isIntersecting), {
                threshold: 0,
                rootMargin: "0px 0px -18% 0px",
            });
            io.observe(el);
            return io;
        });

        return () => observers.forEach((io) => io?.disconnect());
    }, [isRTL]);

    // المسار: النقطة المتحركة + خط التقدّم — بيتحسب حي (live) من الـ
    // DOM في كل تحديث سكرول، مفيش أي قيمة متخزّنة أو محتاجة refresh.
    useEffect(() => {
        const trackEl = trackRef.current;
        const calcPathEl = calcPathRef.current;
        const progressEl = progressPathRef.current;
        if (!trackEl || !calcPathEl || !progressEl) return;

        const reduceMotion =
            typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion) {
            progressEl.style.strokeDashoffset = "0";
            if (markerRef.current) markerRef.current.style.opacity = "0";
            trailRefs.current.forEach((el) => el && (el.style.opacity = "0"));
            if (percentRef.current) percentRef.current.style.opacity = "0";
            return;
        }

        const totalLen = calcPathEl.getTotalLength();
        let ticking = false;

        const placeAt = (el, progress, opacity, rect) => {
            if (!el) return;
            const len = Math.max(0, Math.min(totalLen, progress * totalLen));
            const pt = calcPathEl.getPointAtLength(len);
            const px = (pt.x / 100) * rect.width;
            const py = (pt.y / 1000) * rect.height;
            el.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;
            if (opacity !== undefined) el.style.opacity = `${opacity}`;
        };

        const update = () => {
            ticking = false;

            // قياس حي كل مرة — نفس منطق ScrollTrigger "top top" →
            // "bottom bottom": p=0 لما أعلى trackEl يوصل أعلى الشاشة،
            // p=1 لما أسفله يوصل أسفل الشاشة. مفيش أي كاش هنا خالص.
            const rect = trackEl.getBoundingClientRect();
            const vh = window.innerHeight;
            const total = rect.height - vh;
            const p = total > 0 ? clamp01(-rect.top / total) : rect.top <= 0 ? 1 : 0;

            progressEl.style.strokeDashoffset = `${1 - p}`;

            placeAt(markerRef.current, p, 1, rect);
            trailRefs.current.forEach((el, i) => {
                const delta = (i + 1) * 0.012;
                placeAt(el, Math.max(0, p - delta), 0.5 - i * 0.15, rect);
            });

            if (percentRef.current) {
                placeAt(percentRef.current, p, p > 0.01 && p < 0.99 ? 1 : 0, rect);
                percentRef.current.textContent = `${Math.round(p * 100)}%`;
            }
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        update(); // رسم أولي فور التحميل (يغطي حالة "الصفحة فُتحت وهي مسكرولة أصلاً")

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [isRTL]);

    // محتوى لوحة التشخيص — مشتق من حالة الفورم، بعدد أسطر ثابت دايمًا
    const terminalLines = useMemo(() => {
        let lines;
        if (form.status === "sending" || form.status === "sent") {
            lines = form.log.map((text) => ({ text, tone: form.status === "sent" ? "success" : "default" }));
        } else {
            const activeErrors = FIELD_KEYS.filter((k) => form.touched[k] && form.errors[k]).map((k) => form.errors[k]);
            if (activeErrors.length > 0) {
                lines = [tr(t, "contact.diagHeader", "> validation failed"), ...activeErrors].map((text) => ({
                    text,
                    tone: "error",
                }));
            } else {
                lines = [{ text: tr(t, "contact.diagIdle", "> channel idle"), tone: "idle", caret: true }];
            }
        }
        return Array.from({ length: MAX_TERMINAL_LINES }, (_, i) => lines[i] ?? { text: "", tone: "", visible: false });
    }, [form.status, form.log, form.touched, form.errors, t]);

    return (
        <section id="contact" ref={sectionRef} className="sig-section">
            <div className="sig-header">
                <div className="relative inline-block">
                    <span className="eyebrow relative z-10">
                        <HighlightMark>{tr(t, "contact.eyebrow", "تواصل معنا")}</HighlightMark>
                    </span>
                    <PointerArrow flip={!isRTL} />
                </div>

                <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
                    {tr(t, "contact.title", "لسه في استفسار؟ ابعتلنا")}
                </h2>

                <UnderlineLastWord
                    text={tr(t, "contact.body", "مفيش رسالة بتتفوّت — كل تواصل بيوصل فريقنا مباشرة")}
                    className="font-body text-lg max-w-lg text-muted leading-8"
                />

                <span className="sig-open-line">
                    <span className="sig-open-arrows-wrap">
                        <TripleArrows className="sig-open-arrows" />
                        <CircleMark className="sig-live-value">{tr(t, "contact.channelOpen", "مفتوح")}</CircleMark>
                    </span>
                    <span className="sig-open-caption">{tr(t, "contact.openCaption", "يعني بنرد عليك دلوقتي")}</span>
                </span>
            </div>

            <div className="sig-track" ref={trackRef} dir="ltr">
                <svg className="sig-path-svg" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
                    <path d={PATH_D} className="sig-path-base" />
                    <path ref={calcPathRef} d={PATH_D} className="sig-path-calc" />
                    <path ref={progressPathRef} d={PATH_D} pathLength="1" className="sig-path-progress" />
                </svg>

                <div className="sig-marker" ref={markerRef} aria-hidden="true" />
                <div className="sig-trail" ref={(el) => (trailRefs.current[0] = el)} aria-hidden="true" />
                <div className="sig-trail" ref={(el) => (trailRefs.current[1] = el)} aria-hidden="true" />
                <div className="sig-trail" ref={(el) => (trailRefs.current[2] = el)} aria-hidden="true" />
                <div className="sig-percent" ref={percentRef} aria-hidden="true">0%</div>

                <div className="sig-path-end" aria-hidden="true">
                    <svg className="sig-path-end-line" viewBox="0 0 2 100" preserveAspectRatio="none">
                        <path d="M1,0 L1,100" pathLength="1" className="sig-path-end-stroke" />
                    </svg>
                    <span className="sig-path-end-glow" />
                    <span className="sig-path-end-dot" />
                </div>

                <div dir={isRTL ? "rtl" : "ltr"}>
                    <div className="sig-stop sig-stop-1" ref={(el) => (stopRefs.current[0] = el)}>
                        <p className="sig-stop-eyebrow">// incoming transmission</p>
                        <h3 className="sig-stop-heading">{tr(t, "contact.openHeading", "الخط مفتوح دلوقتي")}</h3>
                        <p className="sig-stop-body">
                            {tr(t, "contact.openBody", "كل رسالة بتتقرأ فعليًا من حد حقيقي في الفريق — مفيش رد آلي ولا نموذج بيتفوّت")}
                        </p>
                    </div>

                    <div className="sig-stop sig-stop-2" ref={(el) => (stopRefs.current[1] = el)}>
                        <p className="sig-stop-eyebrow">// transmit.msg</p>
                        <h3 className="sig-stop-heading">{tr(t, "contact.heading", "ابعتلنا رسالتك")}</h3>
                        <p className="sig-stop-body">
                            {tr(t, "contact.sub", "هنرد عليك خلال 24 ساعة على نفس القناة اللي هتوصلنا بيها")}
                        </p>

                        <form
                            className="sig-form"
                            onSubmit={handleSubmit}
                            noValidate
                            aria-describedby={`sig-terminal-${uid}`}
                        >
                            <FormField
                                id={`sig-name-${uid}`}
                                label={tr(t, "contact.name", "الاسم")}
                                value={form.values.name}
                                onChange={handleChange("name")}
                                onBlur={handleBlur("name")}
                                onShakeEnd={() => dispatch({ type: "CLEAR_SHAKE", key: "name" })}
                                isShaking={Boolean(form.shakeKeys.name)}
                                isInvalid={Boolean(form.touched.name && form.errors.name)}
                                placeholder={tr(t, "contact.namePh", "اسمك بالكامل")}
                                inputRef={(el) => (fieldRefs.current.name = el)}
                                type="text"
                            />

                            <FormField
                                id={`sig-contact-${uid}`}
                                label={tr(t, "contact.contact", "وسيلة التواصل")}
                                value={form.values.contact}
                                onChange={handleChange("contact")}
                                onBlur={handleBlur("contact")}
                                onShakeEnd={() => dispatch({ type: "CLEAR_SHAKE", key: "contact" })}
                                isShaking={Boolean(form.shakeKeys.contact)}
                                isInvalid={Boolean(form.touched.contact && form.errors.contact)}
                                placeholder={tr(t, "contact.contactPh", "إيميل أو رقم واتساب")}
                                inputRef={(el) => (fieldRefs.current.contact = el)}
                                type="text"
                                inputMode="email"
                                autoComplete="email"
                            />

                            <FormField
                                id={`sig-message-${uid}`}
                                label={tr(t, "contact.message", "الرسالة")}
                                value={form.values.message}
                                onChange={handleChange("message")}
                                onBlur={handleBlur("message")}
                                onShakeEnd={() => dispatch({ type: "CLEAR_SHAKE", key: "message" })}
                                isShaking={Boolean(form.shakeKeys.message)}
                                isInvalid={Boolean(form.touched.message && form.errors.message)}
                                placeholder={tr(t, "contact.messagePh", "احكيلنا عن مشروعك...")}
                                inputRef={(el) => (fieldRefs.current.message = el)}
                                multiline
                                rows={3}
                            />

                            <div className="sig-honeypot" aria-hidden="true">
                                <label htmlFor={`sig-website-${uid}`}>Website</label>
                                <input
                                    id={`sig-website-${uid}`}
                                    name="website"
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    onChange={(e) => {
                                        form.values.website = e.target.value;
                                    }}
                                />
                            </div>

                            <div className="sig-submit-wrap">
                                <BlobButton type="submit" disabled={form.status === "sending"}>
                                    {form.status === "sending" ? (
                                        <span className="inline-flex items-center gap-2">
                                            <span className="sig-spinner" />
                                            {tr(t, "contact.sending", "بيترسل...")}
                                        </span>
                                    ) : form.status === "sent" ? (
                                        <span>✓ {tr(t, "contact.sent", "اترسلت")}</span>
                                    ) : (
                                        tr(t, "contact.send", "ابعت الرسالة")
                                    )}
                                </BlobButton>
                            </div>

                            <div className="sig-terminal" id={`sig-terminal-${uid}`} aria-live="polite">
                                {terminalLines.map((line, i) => (
                                    <p
                                        key={i}
                                        className={`sig-terminal-line ${line.text ? "is-visible" : ""} tone-${line.tone || ""} ${
                                            line.caret ? "sig-terminal-caret" : ""
                                        }`}
                                    >
                                        {line.text}
                                    </p>
                                ))}
                            </div>
                        </form>
                    </div>

                    <div className="sig-stop sig-stop-3" ref={(el) => (stopRefs.current[2] = el)}>
                        <p className="sig-stop-eyebrow">// uplink.status</p>
                        <h3 className="sig-stop-heading sig-stop-heading-accent">{tr(t, "contact.linkTitle", "LINK ESTABLISHED")}</h3>
                        <p className="sig-stop-body">
                            {tr(t, "contact.linkSub", "مش رسالة آلية — فريقنا بيرد فعليًا خلال 24 ساعة")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}