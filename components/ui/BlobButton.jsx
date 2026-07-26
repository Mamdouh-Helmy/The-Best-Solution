"use client";

import { useId } from "react";

// SVG blob button — the blob shape is a real hand-drawn SVG path used as the
// button's actual background (not a CSS border-radius trick), matching the
// organic asymmetric shapes in the reference images.
//
// Accepts standard button props (type, disabled, onClick, aria-*, ...) so it
// can be dropped into a <form> as a real submit button.
function BlobButton({ children, variant = "solid", type = "button", disabled = false, className = "", ...rest }) {
    const id = useId();
    const isSolid = variant === "solid";

    return (
        <button
            type={type}
            disabled={disabled}
            aria-disabled={disabled}
            className={`group relative inline-flex items-center justify-center min-w-[220px] transition-transform duration-300 active:scale-[0.97] ${
                disabled ? "opacity-70 cursor-default" : "cursor-pointer hover:-translate-y-1"
            } ${className}`}
            {...rest}
        >
            <svg
                className="absolute inset-0 w-full h-full drop-shadow-lg"
                viewBox="0 0 260 90"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id={`blob-${id}`} x1="0" y1="0" x2="260" y2="90" gradientUnits="userSpaceOnUse">
                        {isSolid ? (
                            <>
                                <stop offset="0%" stopColor="var(--color-accent-soft)" />
                                <stop offset="100%" stopColor="var(--color-accent2)" />
                            </>
                        ) : (
                            <>
                                <stop offset="0%" stopColor="var(--color-panel)" />
                                <stop offset="100%" stopColor="var(--color-panel)" />
                            </>
                        )}
                    </linearGradient>
                </defs>

                {isSolid ? (
                    // Wide blob with a raised bump on top — echoes reference image 1
                    <path
                        d="M18,55
               C6,40 10,20 32,14
               C46,10 54,20 68,17
               C80,14 84,2 100,4
               C116,6 116,20 132,18
               C160,15 210,10 236,26
               C254,37 254,55 240,66
               C220,82 180,80 150,78
               C110,76 70,80 42,76
               C22,73 10,68 18,55 Z"
                        fill={`url(#blob-${id})`}
                    />
                ) : (
                    // Twisted peanut / blob shape — echoes reference image 2
                    <path
                        d="M20,45
               C10,30 18,10 42,8
               C70,5 90,18 110,10
               C140,-2 180,4 210,14
               C238,23 254,38 248,52
               C242,68 216,72 190,66
               C160,59 130,72 100,74
               C70,76 34,74 22,60
               C18,56 18,50 20,45 Z"
                        fill={`url(#blob-${id})`}
                        stroke="var(--color-line)"
                        strokeWidth="2"
                    />
                )}
            </svg>

            <span
                className="relative z-10 px-9 py-4 font-body font-semibold whitespace-nowrap"
                style={{ color: isSolid ? "#fff" : "var(--color-ink)" }}
            >
                {children}
            </span>

            {!disabled && (
                <>
                    {/* small floating accent dot */}
                    <span
                        className="absolute -top-1.5 right-6 w-2.5 h-2.5 rounded-full opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
                        style={{ backgroundColor: "var(--color-accent2)", transitionDelay: "60ms" }}
                    />
                    {/* small floating accent pill */}
                    <span
                        className="absolute -top-2 left-10 w-4 h-2.5 rounded-full opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                        style={{ backgroundColor: "var(--color-accent-soft)", transitionDelay: "120ms" }}
                    />
                </>
            )}
        </button>
    );
}

export default BlobButton;