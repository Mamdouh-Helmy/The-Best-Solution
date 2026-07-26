//api/admin/hero/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HeroContent from "@/models/HeroContent";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const items = await HeroContent.find().sort({ createdAt: -1 });
    return NextResponse.json({ items });
}

export async function POST(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { eyebrowEn, eyebrowAr, title, subtitleEn, subtitleAr, isActive } = body;

    if (!eyebrowEn || !eyebrowAr || !title || !subtitleEn || !subtitleAr) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Only one entry can be active — turn the others off first.
    if (isActive) {
        await HeroContent.updateMany({}, { $set: { isActive: false } });
    }

    const item = await HeroContent.create({
        eyebrow: { en: eyebrowEn, ar: eyebrowAr },
        title,
        subtitle: { en: subtitleEn, ar: subtitleAr },
        isActive: !!isActive,
    });

    return NextResponse.json({ item }, { status: 201 });
}
