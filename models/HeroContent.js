// models/HeroContent.js
import mongoose from "mongoose";

const HeroContentSchema = new mongoose.Schema(
    {
        eyebrow: {
            en: { type: String, required: true, trim: true },
            ar: { type: String, required: true, trim: true },
        },
        // English/Latin only — Hero3DTitle renders each character as a
        // layered 3D glyph, an effect built around Latin letterforms.
        title: { type: String, required: true, trim: true },
        subtitle: {
            en: { type: String, required: true, trim: true },
            ar: { type: String, required: true, trim: true },
        },
        // Only one entry should be active at a time — the public API
        // serves whichever one has isActive: true.
        isActive: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.HeroContent || mongoose.model("HeroContent", HeroContentSchema);
