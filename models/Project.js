// models/Project.js
import mongoose from "mongoose";

const BilingualString = {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
};

const ProjectSchema = new mongoose.Schema(
    {
        // Shown in the editor tab / gutter — a filename, so it stays a
        // single value across languages (e.g. "codeschool.tsx").
        fileName: { type: String, required: true, trim: true },
        // Tech-stack label ("Next.js · i18n") — also language-neutral.
        techLabel: { type: String, required: true, trim: true },
        tag: BilingualString,
        title: BilingualString,
        desc: BilingualString,
        href: { type: String, required: true, trim: true, default: "#" },
        linkLabel: { type: String, required: true, trim: true },
        image: {
            url: { type: String, default: "" },
            publicId: { type: String, default: "" },
        },
        // Controls both the left→right order in the coverflow and
        // whether the card shows publicly at all.
        order: { type: Number, required: true, default: 0 },
        isPublished: { type: Boolean, default: true },
    },
    { timestamps: true }
);

ProjectSchema.index({ order: 1 });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);