// app/api/admin/about/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AboutContent from "@/models/AboutContent";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function validateStats(stats) {
    if (!Array.isArray(stats) || stats.length === 0) {
        return "At least one stat is required";
    }
    for (const s of stats) {
        if (!s?.value?.toString().trim() || !s?.labelEn?.trim() || !s?.labelAr?.trim()) {
            return "Each stat needs a value and a label in both languages";
        }
    }
    return null;
}

function normalizeStats(stats) {
    return stats.map((s) => ({
        value: s.value.toString().trim(),
        label: { en: s.labelEn.trim(), ar: s.labelAr.trim() },
    }));
}

export async function GET(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const items = await AboutContent.find().sort({ createdAt: -1 });
    return NextResponse.json({ items });
}

export async function POST(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { eyebrowEn, eyebrowAr, titleEn, titleAr, bodyEn, bodyAr, stats, isActive } = body;

    if (!eyebrowEn || !eyebrowAr || !titleEn || !titleAr || !bodyEn || !bodyAr) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const statsError = validateStats(stats);
    if (statsError) return NextResponse.json({ error: statsError }, { status: 400 });

    // Only one entry can be active — turn the others off first.
    if (isActive) {
        await AboutContent.updateMany({}, { $set: { isActive: false } });
    }

    const item = await AboutContent.create({
        eyebrow: { en: eyebrowEn, ar: eyebrowAr },
        title: { en: titleEn, ar: titleAr },
        body: { en: bodyEn, ar: bodyAr },
        stats: normalizeStats(stats),
        isActive: !!isActive,
    });

    return NextResponse.json({ item }, { status: 201 });
}