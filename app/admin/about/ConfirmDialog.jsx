// app/admin/about/ConfirmDialog.jsx
"use client";

export default function ConfirmDialog({ open, title, body, confirmLabel, cancelLabel, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-sm rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="font-display text-lg font-semibold text-[var(--color-ink)]">{title}</h3>
                <p className="mt-2 font-body text-sm leading-6 text-[var(--color-muted)]">{body}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-xl px-4 py-2 font-body text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-xl bg-red-500/90 px-4 py-2 font-body text-sm font-medium text-white hover:bg-red-500 transition-colors"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}