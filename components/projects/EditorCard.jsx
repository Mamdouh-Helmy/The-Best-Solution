import { memo, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GUTTER_LINES } from "./data";
import { tr } from "./utils";

const IMAGE_SIZES = "(max-width: 640px) 82vw, (max-width: 1024px) 40vw, 380px";

function EditorCard({ project, index, t }) {
    const [imageFailed, setImageFailed] = useState(false);

    // NEW: أي صورة بتخلص تحميل ممكن تغيّر ارتفاع/عرض الكارت الفعلي
    // (قبل ما next/image يحسم الأبعاد النهائية بتاعتها فعليًا على
    // الشاشة)، فبنعمل refresh خفيف عشان أي ScrollTrigger تاني في
    // الصفحة (بما فيه Testimonials اللي بعدنا) ياخد القياس الصح.
    const handleImageLoad = () => {
        if (typeof window !== "undefined") {
            ScrollTrigger.refresh();
        }
    };

    return (
        <article className="proj-card" style={{ "--status-color": project.statusColor }}>
            <span className="proj-card-spotlight" aria-hidden="true" />

            <div className="proj-titlebar">
                <div className="proj-traffic" aria-hidden="true">
                    <span className="proj-tf-dot proj-tf-red" />
                    <span className="proj-tf-dot proj-tf-yellow" />
                    <span className="proj-tf-dot proj-tf-green" />
                </div>
                <div className="proj-tab">
                    <span className="proj-tab-icon" style={{ background: project.statusColor }} />
                    <span className="proj-tab-name">{project.fileName}</span>
                    <span className="proj-tab-unsaved" />
                </div>
                <span className="proj-card-index">{String(index + 1).padStart(2, "0")}</span>
            </div>

            <div className="proj-editor-body">
                <div className="proj-gutter" aria-hidden="true">
                    {GUTTER_LINES.map((n) => (
                        <span key={n}>{n}</span>
                    ))}
                </div>

                <div className="proj-editor-main">
                    <div className="proj-browserbar">
                        <div className="proj-browser-dots" aria-hidden="true">
                            <span /><span /><span />
                        </div>
                        <div className="proj-browser-url">
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" fill="none" />
                            </svg>
                            <span>{project.linkLabel}</span>
                        </div>
                    </div>

                    <div className={`proj-image-wrap ${imageFailed ? "proj-image-fallback" : ""}`}>
                        {!imageFailed && (
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                sizes={IMAGE_SIZES}
                                className="proj-image"
                                onLoad={handleImageLoad}
                                onError={() => setImageFailed(true)}
                            />
                        )}
                        <div className="proj-image-overlay" />
                        <span className="proj-image-fallback-content">
                            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
                                <path d="M3 15l5-4 4 3 4-5 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{tr(t, "projects.noPreview", "لسه مفيش معاينة")}</span>
                        </span>
                    </div>

                    <p className="proj-comment">// {project.tag}</p>
                    <h3 className="font-display proj-title">{project.title}</h3>
                    <p className="font-body proj-desc">{project.desc}</p>

                    <a
                        href={project.href}
                        target={project.href?.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="proj-run-btn"
                    >
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <path d="M4 2.5v11l9-5.5-9-5.5Z" fill="currentColor" />
                        </svg>
                        <span>{tr(t, "projects.runProject", "تشغيل المشروع")}</span>
                    </a>
                </div>
            </div>

            <div className="proj-statusbar">
                <span className="proj-status-item proj-status-branch">
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.3" />
                        <circle cx="4" cy="12" r="2" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M4 6v4M4 6c0 3 3 2 3 5" stroke="currentColor" strokeWidth="1.3" fill="none" />
                    </svg>
                    main
                </span>
                <span className="proj-status-item">{project.lang}</span>
                <span className="proj-status-item proj-status-spacer" />
                <span className="proj-status-item">Ln {12 + index}, Col {4 + index * 3}</span>
                <span className="proj-status-item proj-status-ok">✓ 0 Problems</span>
            </div>
        </article>
    );
}

export default memo(EditorCard);