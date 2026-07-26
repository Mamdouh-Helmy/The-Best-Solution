import { memo } from "react";
import { useTicketSlider } from "./useTicketSlider";
import { BURST_SHARDS } from "./data";
import { tr } from "./utils";

function TicketSlider({ isRTL, t }) {
    const {
        trackRef,
        progress,
        trackWidth,
        dragging,
        tearing,
        hasInteracted,
        handlePointerDown,
        handleKeyDown,
    } = useTicketSlider(isRTL);

    return (
        <div className="ftr-perf">
            <p className={`ftr-perf-hint ${hasInteracted ? "is-hidden" : ""}`}>
                {tr(t, "footer.dragHint", "اسحب للرجوع لأعلى")}
                <svg className="ftr-perf-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 12h14M12 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </p>

            <div className="ftr-perf-track" ref={trackRef} />
            <div
                className={`ftr-perf-fill ${dragging ? "is-dragging" : ""}`}
                style={{ width: `${progress * trackWidth}px` }}
            />
            <div className="ftr-perf-hole end" />

            <div
                className={`ftr-perf-handle ${dragging ? "is-dragging" : ""} ${hasInteracted ? "has-interacted" : ""}`}
                style={{ insetInlineStart: `${progress * trackWidth}px` }}
                role="slider"
                tabIndex={0}
                aria-label={tr(t, "footer.backToTop", "اسحب للرجوع لأعلى")}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                onPointerDown={handlePointerDown}
                onKeyDown={handleKeyDown}
            >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 19V6M6 11l6-6 6 6" stroke="var(--color-accent2)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <div className={`ftr-tear-burst ${tearing ? "is-tearing" : ""}`}>
                {BURST_SHARDS.map((s, i) => (
                    <span
                        key={i}
                        style={{
                            "--rot": `${s.rot}deg`,
                            "--tx": `${s.tx}px`,
                            "--ty": `${s.ty}px`,
                            animationDelay: `${i * 18}ms`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default memo(TicketSlider);