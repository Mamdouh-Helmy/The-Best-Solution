// models/AboutContent.js
import mongoose from "mongoose";

const StatSchema = new mongoose.Schema(
    {
        // The number/symbol shown in the orbit badge (e.g. "+5", "+40").
        // Kept as one shared string across languages since these are
        // numerals/symbols, not translatable text.
        value: { type: String, required: true, trim: true },
        label: {
            en: { type: String, required: true, trim: true },
            ar: { type: String, required: true, trim: true },
        },
    },
    { _id: false }
);

const AboutContentSchema = new mongoose.Schema(
    {
        eyebrow: {
            en: { type: String, required: true, trim: true },
            ar: { type: String, required: true, trim: true },
        },
        title: {
            en: { type: String, required: true, trim: true },
            ar: { type: String, required: true, trim: true },
        },
        body: {
            en: { type: String, required: true, trim: true },
            ar: { type: String, required: true, trim: true },
        },
        // Array order = orbit order around the About planet (AboutPlanet
        // spaces them evenly by index).
        stats: {
            type: [StatSchema],
            default: [],
        },
        // Multiple entries can exist (like HeroContent) — only one is
        // ever active at a time, and the public API serves that one.
        isActive: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.AboutContent || mongoose.model("AboutContent", AboutContentSchema);