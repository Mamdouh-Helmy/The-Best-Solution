// ===== الألوان — مبنية بس على اللونين دول =====
const BRAND_A = "#6366F1"; // إندجو
const BRAND_B = "#F472B6"; // بينك

// بيرجع CSS color-mix بين اللونين حسب نسبة (0 = كله A، 1 = كله B)
export function mixBrand(ratio) {
    const pctA = Math.round((1 - Math.max(0, Math.min(1, ratio))) * 100);
    return `color-mix(in oklch, ${BRAND_A} ${pctA}%, ${BRAND_B} ${100 - pctA}%)`;
}

export const GUTTER_LINES = Array.from({ length: 13 }, (_, i) => i + 1);

// ===== ترتيب الديكورات بين المشاريع — بيتبادل تلقائيًا =====
export const DECOR_SEQUENCE = ["rocket", "planet", "satellite", "comet"];

// المشاريع بقت جاية من /api/projects (وتتدار من /admin/projects) بدل
// ما تكون Array ثابتة هنا. كل مشروع راجع من الـ API بشكل ثنائي اللغة
// (title/desc/tag = { en, ar })؛ الدالة دي بتحوّله لشكل مسطّح باللغة
// الحالية عشان EditorCard يستخدمه زي ما هو، وبتدي كل مشروع لون متدرّج
// تلقائي حسب ترتيبه (order) في القايمة.
export function mapApiProjects(items = [], lang = "ar") {
    return items.map((p, i, arr) => ({
        id: p._id,
        fileName: p.fileName,
        lang: p.techLabel,
        tag: p.tag?.[lang] || p.tag?.ar || "",
        title: p.title?.[lang] || p.title?.ar || "",
        desc: p.desc?.[lang] || p.desc?.ar || "",
        href: p.href,
        linkLabel: p.linkLabel,
        image: p.image?.url || "",
        statusColor: mixBrand(arr.length > 1 ? i / (arr.length - 1) : 0),
    }));
}

// بناء السلايدز تلقائيًا: مشروع → ديكور (يتبادل) → مشروع → ...
// اتفصلت كـ pure function (بدل ما تتبني جوه الـ render مباشرة) عشان
// تتلف بـ useMemo وميتكررش حسابها على كل re-render.
export function buildSlides(projects = []) {
    const slides = [];
    projects.forEach((project, i) => {
        slides.push({ type: "project", data: project, projectIndex: i, key: project.id });
        if (i < projects.length - 1) {
            const decorType = DECOR_SEQUENCE[i % DECOR_SEQUENCE.length];
            slides.push({ type: decorType, key: `decor-${i}` });
        }
    });
    return slides;
}