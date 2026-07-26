import { memo } from "react";

// حقل فورم واحد (label + input-wrap + shake/invalid state)، بيفرق
// بين input و textarea بـ prop `multiline`. الحقول التلاتة (name/
// contact/message) كانت مكررة بنفس البنية دي — دلوقتي component واحد.
function FormField({
    id,
    label,
    value,
    onChange,
    onBlur,
    onShakeEnd,
    isShaking,
    isInvalid,
    placeholder,
    inputRef,
    multiline = false,
    rows,
    ...inputProps
}) {
    const Tag = multiline ? "textarea" : "input";
    return (
        <div className="sig-field">
            <label htmlFor={id}>{label}</label>
            <div
                className={`sig-input-wrap ${isShaking ? "is-shaking" : ""}`}
                data-invalid={isInvalid}
                onAnimationEnd={onShakeEnd}
            >
                <Tag
                    id={id}
                    ref={inputRef}
                    required
                    rows={multiline ? rows : undefined}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    aria-invalid={isInvalid}
                    className="caret-accent2"
                    {...inputProps}
                />
            </div>
        </div>
    );
}

export default memo(FormField);