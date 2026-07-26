// models/Testimonial.js
import mongoose from "mongoose";

const BilingualString = {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
};

const TestimonialSchema = new mongoose.Schema(
    {
        name: BilingualString,
        role: BilingualString,
        quote: BilingualString,
        rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
        // بيتحكم في ترتيب ظهور الكارت جوه سلايدر الـ scroll، وفي إظهاره
        // للعميل من عدمه — نفس المنطق المستخدم في Project.order.
        order: { type: Number, required: true, default: 0 },
        isPublished: { type: Boolean, default: true },
    },
    { timestamps: true }
);

TestimonialSchema.index({ order: 1 });

export default mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);