// app/api/admin/testimonials/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function validateBilingual(en, ar, label) {
    if (!en?.trim() || !ar?.trim()) return `${label} is required in both languages`;
    return null;
}

export async function GET(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const items = await Testimonial.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ items });
}

export async function POST(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { nameEn, nameAr, roleEn, roleAr, quoteEn, quoteAr, rating, isPublished } = body;

    const errors = [
        validateBilingual(nameEn, nameAr, "Name"),
        validateBilingual(roleEn, roleAr, "Role"),
        validateBilingual(quoteEn, quoteAr, "Quote"),
    ].filter(Boolean);
    if (errors.length) return NextResponse.json({ error: errors[0] }, { status: 400 });

    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
        return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // العنصر الجديد بينضم في آخر الترتيب افتراضيًا.
    const last = await Testimonial.findOne().sort({ order: -1 }).select("order");
    const nextOrder = last ? last.order + 1 : 0;

    const item = await Testimonial.create({
        name: { en: nameEn.trim(), ar: nameAr.trim() },
        role: { en: roleEn.trim(), ar: roleAr.trim() },
        quote: { en: quoteEn.trim(), ar: quoteAr.trim() },
        rating: ratingNum,
        order: nextOrder,
        isPublished: isPublished !== false,
    });

    return NextResponse.json({ item }, { status: 201 });
}