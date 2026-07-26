import { seededRandom, round } from "./utils";
import { waveBottomPx } from "./utils";

const TW = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/";
export const ICON = {
    cloud: `${TW}2601.svg`,
    treeDeciduous: `${TW}1f333.svg`,
    treeEvergreen: `${TW}1f332.svg`,
    seedling: `${TW}1f331.svg`,
    butterfly: `${TW}1f98b.svg`,
    herb: `${TW}1f33f.svg`,
    rice: `${TW}1f33e.svg`,
    blossom: `${TW}1f33c.svg`,
};

const STAR_COUNT = 60;
const CLOUD_COUNT = 8;

export const STARS = Array.from({ length: STAR_COUNT }).map((_, i) => ({
    id: i,
    top: round(seededRandom(i * 3.1 + 1) * 65),
    left: round(seededRandom(i * 7.7 + 2) * 100),
    size: round(seededRandom(i * 5.3 + 3) * 1.8 + 0.8, 3),
    delay: round(seededRandom(i * 2.9 + 4) * 4, 3),
    duration: round(seededRandom(i * 4.4 + 5) * 2.5 + 2, 3),
}));

export const CLOUDS = Array.from({ length: CLOUD_COUNT }).map((_, i) => {
    const depth = seededRandom(i * 6.6 + 11);
    return {
        id: i,
        top: round(2 + seededRandom(i * 1.3 + 12) * 46),
        scale: round(1.3 - depth * 0.85, 3),
        opacity: round(0.95 - depth * 0.45, 3),
        duration: round(55 + depth * 70 + seededRandom(i * 8.8 + 13) * 20, 2),
        delay: round(-seededRandom(i * 9.9 + 14) * 130, 2),
        flip: seededRandom(i * 2.2 + 15) > 0.5,
        blur: depth > 0.55 ? 1 : 0,
    };
});

export const METEORS = [
    { top: 8, left: 60, angle: 32, length: 90, distance: 300, duration: 1.1, delay: 0 },
    { top: 22, left: 74, angle: 40, length: 65, distance: 230, duration: 0.9, delay: 3.4 },
    { top: 13, left: 40, angle: 26, length: 115, distance: 360, duration: 1.3, delay: 6.8 },
    { top: 30, left: 84, angle: 36, length: 75, distance: 260, duration: 1, delay: 10.2 },
];

export const FLYING_BIRDS = [
    { top: 20, duration: 26, delay: 0, scale: 0.8 },
    { top: 32, duration: 34, delay: -8, scale: 0.6 },
    { top: 14, duration: 40, delay: -20, scale: 0.5 },
    { top: 26, duration: 30, delay: -14, scale: 0.7 },
];

export const TREES = [
    { left: 3, icon: ICON.treeDeciduous, scale: 1.1, sway: 0 },
    { left: 11, icon: ICON.seedling, scale: 0.7, sway: 0.6 },
    { left: 21, icon: ICON.treeEvergreen, scale: 0.95, sway: 0.3 },
    { left: 79, icon: ICON.treeEvergreen, scale: 1, sway: 0.4 },
    { left: 89, icon: ICON.treeDeciduous, scale: 1.05, sway: 0.15 },
    { left: 96, icon: ICON.seedling, scale: 0.65, sway: 0.7 },
].map((t) => ({ ...t, bottom: round(waveBottomPx(t.left) - 20, 2) })); // bottom اتحسب مرة واحدة هنا بدل ما يتحسب جوه JSX كل render

export const GRASS_TUFTS = Array.from({ length: 22 }).map((_, i) => {
    const xp = (i / 22) * 100 + (i % 2 === 0 ? 1.5 : -1.5);
    return {
        id: i,
        left: round(xp),
        bottom: round(waveBottomPx(xp) - 6, 2),
        icon: i % 3 === 0 ? ICON.rice : ICON.herb,
        scale: round(0.7 + ((i * 37) % 40) / 100, 3),
        flip: i % 2 === 0,
    };
});

export const FLOWERS = [8, 27, 46, 64, 83].map((xp, i) => ({
    id: i,
    left: xp,
    bottom: round(waveBottomPx(xp) - 2, 2),
}));

export const STANDING_BIRDS = [
    { left: 38, bottom: round(waveBottomPx(38) - 14, 2), delay: 0, flip: false },
    { left: 58, bottom: round(waveBottomPx(58) - 14, 2), delay: 1.1, flip: true },
];

function buildBunnyKeyframes() {
    const hopStops = [
        { t: 0, left: -14 },
        { t: 48, left: 35 },
        { t: 50, left: 37 },
        { t: 52, left: 39 },
        { t: 100, left: 112 },
    ];

    const leftAt = (t) => {
        for (let i = 0; i < hopStops.length - 1; i++) {
            const a = hopStops[i];
            const b = hopStops[i + 1];
            if (t >= a.t && t <= b.t) {
                const ratio = (t - a.t) / (b.t - a.t || 1);
                return a.left + (b.left - a.left) * ratio;
            }
        }
        return hopStops[hopStops.length - 1].left;
    };

    const steps = 48;
    const frames = [];
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * 100;
        const left = leftAt(t);
        const clampedX = Math.min(100, Math.max(0, left));
        const bottom = waveBottomPx(clampedX) - 16;
        const flip = t >= 51 ? -1 : 1;
        frames.push(
            `${t.toFixed(2)}% { left: ${left.toFixed(2)}%; bottom: ${bottom.toFixed(1)}px; transform: scaleX(${flip}); }`
        );
    }

    return `@keyframes bunnyHop {\n${frames.join("\n")}\n}`;
}

// ده كان أصلاً آمن (بيستخدم toFixed) لأنه نص جوه <style> tag مش
// attribute بيتقارن بالـ CSSOM، فمفيش داعي نلمسه.
export const BUNNY_KEYFRAMES = buildBunnyKeyframes();

export const CODE_TOKENS = [
    { t: "#include", c: "kw" },
    { t: " ", c: "pl" },
    { t: "<bits/stdc++.h>", c: "str" },
    { t: "\n", c: "pl" },
    { t: "using", c: "kw" },
    { t: " ", c: "pl" },
    { t: "namespace", c: "kw" },
    { t: " ", c: "pl" },
    { t: "std", c: "ty" },
    { t: ";\n\n", c: "pl" },
    { t: "int", c: "ty" },
    { t: " ", c: "pl" },
    { t: "main", c: "fn" },
    { t: "(", c: "pu" },
    { t: ")", c: "pu" },
    { t: " {\n", c: "pl" },
    { t: "    ", c: "pl" },
    { t: "vector", c: "ty" },
    { t: "<", c: "pu" },
    { t: "int", c: "ty" },
    { t: ">", c: "pu" },
    { t: " nums ", c: "pl" },
    { t: "=", c: "pu" },
    { t: " ", c: "pl" },
    { t: "{", c: "pu" },
    { t: "5", c: "nu" },
    { t: ", ", c: "pu" },
    { t: "3", c: "nu" },
    { t: ", ", c: "pu" },
    { t: "8", c: "nu" },
    { t: ", ", c: "pu" },
    { t: "1", c: "nu" },
    { t: ", ", c: "pu" },
    { t: "9", c: "nu" },
    { t: "}", c: "pu" },
    { t: ";\n", c: "pl" },
    { t: "    ", c: "pl" },
    { t: "sort", c: "fn" },
    { t: "(nums.begin(), nums.end())", c: "pl" },
    { t: ";\n\n", c: "pl" },
    { t: "    ", c: "pl" },
    { t: "cout", c: "fn" },
    { t: " ", c: "pl" },
    { t: "<<", c: "pu" },
    { t: " ", c: "pl" },
    { t: '"The Best Solution"', c: "str" },
    { t: " ", c: "pl" },
    { t: "<<", c: "pu" },
    { t: " ", c: "pl" },
    { t: "endl", c: "fn" },
    { t: ";\n", c: "pl" },
    { t: "    ", c: "pl" },
    { t: "return", c: "kw" },
    { t: " ", c: "pl" },
    { t: "0", c: "nu" },
    { t: ";\n", c: "pl" },
    { t: "}", c: "pl" },
];

export const CODE_LEN = CODE_TOKENS.reduce((a, tk) => a + tk.t.length, 0);
export const SOURCE_CODE = CODE_TOKENS.map((tk) => tk.t).join("");

export const TOKEN_COLORS = {
    kw: "#ff79c6", ty: "#8be9fd", fn: "#50fa7b", str: "#f1fa8c",
    nu: "#bd93f9", pu: "#e7e9f3", pl: "#e7e9f3", cm: "#6272a4",
};

export const KEYWORDS = new Set([
    "if", "else", "for", "while", "do", "switch", "case", "break", "continue",
    "return", "class", "struct", "public", "private", "protected", "namespace",
    "using", "template", "typename", "const", "static", "virtual", "override",
    "new", "delete", "try", "catch", "throw", "true", "false", "nullptr",
    "this", "sizeof", "typedef", "enum", "union", "friend", "inline",
    "explicit", "operator", "default", "goto", "auto", "constexpr",
    "mutable", "volatile",
]);

export const TYPES = new Set([
    "int", "long", "short", "char", "float", "double", "bool", "void",
    "size_t", "string", "vector", "map", "unordered_map", "set",
    "unordered_set", "pair", "array", "list", "deque", "stack", "queue",
    "priority_queue",
]);

export const TOKEN_RE =
    /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])*')|(#\s*\w+)|(\b\d+\.?\d*\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_])/g;

export const TITLE_TEXT = "The Best Solution";
export const LAYER_COUNT = 6;
export const LAYER_DEPTH_STEP = 5;
export const DEGREES_PER_PIXEL = 0.6;
export const HOVER_LIFT_Z = 40;
export const COLOR_INDIGO = "#6366F1";
export const COLOR_PINK = "#F472B6";