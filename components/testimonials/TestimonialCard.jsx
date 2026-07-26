import StarIcon from "./StarIcon";
import { tr } from "./utils";

export default function TestimonialCard({ item, t }) {
    const stars = Array.from({ length: 5 }, (_, i) => i < item.rating);
    const cardBase =
        "test-card relative w-[min(540px,92vw)] rounded-[1.1rem] bg-panel border border-line shadow-[0_35px_70px_-35px_rgba(5,5,15,0.2)] p-8 overflow-hidden text-start";

    return (
        <article className={`${cardBase} test-card-${item.variant}`} style={{ "--accent-color": item.accent }}>
            {item.variant === "spotlight" && (
                <div className="pt-[3.2rem] -mt-[3.2rem]">
                    <span className="test-quote-big absolute -top-2 start-[1.2rem] text-[6rem] font-display opacity-[0.18] leading-none" style={{ color: "var(--accent-color)" }} aria-hidden="true">"</span>
                    <div className="flex items-center justify-between gap-[0.85rem] mb-[1.1rem]">
                        <div className="flex items-center gap-[0.85rem]">
                            <span className="flex-none w-[46px] h-[46px] rounded-full flex items-center justify-center text-white font-bold font-mono" style={{ background: item.accent }}>{item.initial}</span>
                            <div>
                                <p className="font-bold text-ink text-[0.98rem]">{item.name}</p>
                                <p className="text-muted text-[0.8rem] mt-[0.15rem]">{item.role}</p>
                            </div>
                        </div>
                    </div>
                    <blockquote className="text-muted text-[0.95rem] leading-[1.9] m-0 mb-[1.2rem]">{item.quote}</blockquote>
                    <div className="flex gap-[3px]">
                        {stars.map((f, i) => <StarIcon key={i} filled={f} />)}
                    </div>
                </div>
            )}

            {item.variant === "ribbon" && (
                <div className="pt-[2.6rem] -mt-[2.6rem]">
                    <span className="test-ribbon" style={{ background: item.accent }} >
                        {tr(t, "testimonials.featured", "عميل مميز")}
                    </span>
                    <div className="flex gap-[3px] mb-[0.9rem]">
                        {stars.map((f, i) => <StarIcon key={i} filled={f} />)}
                    </div>
                    <blockquote className="text-muted text-[0.95rem] leading-[1.9] m-0 mb-[1.3rem]">{item.quote}</blockquote>
                    <div className="flex items-center gap-[0.85rem]">
                        <span className="flex-none w-[46px] h-[46px] rounded-2xl flex items-center justify-center text-white font-bold font-mono" style={{ background: item.accent }}>{item.initial}</span>
                        <div>
                            <p className="font-bold text-ink text-[0.98rem]">{item.name}</p>
                            <p className="text-muted text-[0.8rem] mt-[0.15rem]">{item.role}</p>
                        </div>
                    </div>
                </div>
            )}

            {item.variant === "framed" && (
                <div className="flex gap-[1.4rem] items-start max-[720px]:flex-col max-[720px]:items-center max-[720px]:text-center">
                    <div className="flex-none bg-panel2 border border-line rounded-[0.6rem] px-[0.6rem] pt-[0.6rem] pb-[0.9rem] flex flex-col items-center gap-[0.6rem] shadow-[0_12px_26px_-16px_rgba(5,5,15,0.3)] [transform:rotate(-4deg)]">
                        <span className="w-16 h-16 rounded-[0.4rem] flex items-center justify-center text-white font-bold font-mono text-[1.2rem]" style={{ background: item.accent }}>{item.initial}</span>
                        <p className="font-bold text-ink text-[0.72rem] whitespace-nowrap">{item.name}</p>
                    </div>
                    <div className="flex flex-col gap-[0.6rem] pt-[0.3rem]">
                        <p className="text-muted text-[0.8rem]">{item.role}</p>
                        <blockquote className="text-muted text-[0.95rem] leading-[1.9] m-0 italic">{item.quote}</blockquote>
                        <div className="flex gap-[3px]">
                            {stars.map((f, i) => <StarIcon key={i} filled={f} />)}
                        </div>
                    </div>
                </div>
            )}

            {item.variant === "minimal" && (
                <div className="bg-panel2 -m-8 p-8 rounded-[1.1rem]">
                    <blockquote className="text-ink text-[1.05rem] leading-[1.9] m-0 mb-[1.1rem]">{item.quote}</blockquote>
                    <span className="block w-10 h-[3px] rounded-full mb-[1.1rem]" style={{ background: item.accent }} />
                    <div className="flex items-center justify-between gap-[0.85rem]">
                        <div>
                            <p className="font-bold text-ink text-[0.98rem]">{item.name}</p>
                            <p className="text-muted text-[0.8rem] mt-[0.15rem]">{item.role}</p>
                        </div>
                        <div className="flex gap-[3px]">
                            {stars.map((f, i) => <StarIcon key={i} filled={f} />)}
                        </div>
                    </div>
                </div>
            )}

            {item.variant === "beam" && (
                <div className="text-center overflow-visible">
                    <span
                        className="block h-[5px] -mx-8 -mb-6 w-[calc(100%+4rem)]"
                        style={{ background: `linear-gradient(90deg, var(--color-accent-soft), ${item.accent}, var(--color-accent2))` }}
                    />
                    <div className="flex justify-center mb-[0.9rem]">
                        <span className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold font-mono text-[1.3rem] border-4 border-panel shadow-[0_8px_20px_-8px_rgba(5,5,15,0.35)]" style={{ background: item.accent }}>{item.initial}</span>
                    </div>
                    <p className="font-bold text-ink text-[0.98rem] text-center">{item.name}</p>
                    <p className="text-muted text-[0.8rem] text-center mb-4">{item.role}</p>
                    <blockquote className="text-muted text-[0.95rem] leading-[1.9] m-0 text-center mb-[1.1rem]">{item.quote}</blockquote>
                    <div className="flex gap-[3px] justify-center">
                        {stars.map((f, i) => <StarIcon key={i} filled={f} />)}
                    </div>
                </div>
            )}
        </article>
    );
}
