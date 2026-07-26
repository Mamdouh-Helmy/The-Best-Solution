import { LOGO_SEQUENCE } from "./data";
import { LOGO_SHAPES } from "./shapes";
import MorphLetter from "./MorphLetter";

// اللوجو بيترندر من LOGO_SEQUENCE بدل ما كل حرف يتكتب يدويًا.
// مفيش "use client" هنا ولا hooks — العنصر ده بيبقى جزء من bundle
// العميل تلقائيًا لأنه متستورد جوه Header (client component)، بس
// فضل نفسه component نضيف من غير أي حالة داخلية.
export default function Logo() {
    return (
        // dir="ltr" ثابتة عشان اسم البراند يفضل بنفس الترتيب سواء الموقع
        // شغال RTL (عربي) أو LTR (إنجليزي)
        <a
            href="#"
            dir="ltr"
            className="font-display text-lg text-ink shrink-0 inline-flex items-center"
            style={{ perspective: "400px" }}
        >
            {LOGO_SEQUENCE.map((item, i) =>
                item.text !== undefined ? (
                    <span key={i}>{item.text}</span>
                ) : (
                    <MorphLetter key={i} letter={item.letter} Shape={LOGO_SHAPES[item.shapeKey]} delay={item.delay} />
                )
            )}
        </a>
    );
}