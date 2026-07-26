// models/SocialLink.js
import mongoose from "mongoose";

const SocialLinkSchema = new mongoose.Schema(
    {
        label: { type: String, required: true, trim: true }, // اسم الوسيلة (مش شرط ثنائي اللغة، زي الأصل)
        href: { type: String, required: true, trim: true },
        // preset: أيقونة جاهزة من ICON_LIBRARY (icons.jsx)
        // custom: صورة مرفوعة على Cloudinary — عشان تقدر تضيف أي أيقونة
        // مش موجودة في المكتبة الجاهزة
        iconType: { type: String, enum: ["preset", "custom"], default: "preset" },
        iconKey: { type: String, trim: true }, // مطلوب لو iconType === "preset"
        image: {
            url: { type: String },
            publicId: { type: String },
        }, // مطلوب لو iconType === "custom"
        order: { type: Number, required: true, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

SocialLinkSchema.index({ order: 1 });

export default mongoose.models.SocialLink || mongoose.model("SocialLink", SocialLinkSchema);