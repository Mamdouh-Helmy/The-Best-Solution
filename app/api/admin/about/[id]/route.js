// app/api/admin/about/[id]/route.js
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

export async function PATCH(req, { params }) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    // ✅ استخدام await مع params
    const { id } = await params;
    const body = await req.json();
    const { eyebrowEn, eyebrowAr, titleEn, titleAr, bodyEn, bodyAr, stats, isActive } = body;

    const setOps = {};
    if (eyebrowEn !== undefined) setOps["eyebrow.en"] = eyebrowEn;
    if (eyebrowAr !== undefined) setOps["eyebrow.ar"] = eyebrowAr;
    if (titleEn !== undefined) setOps["title.en"] = titleEn;
    if (titleAr !== undefined) setOps["title.ar"] = titleAr;
    if (bodyEn !== undefined) setOps["body.en"] = bodyEn;
    if (bodyAr !== undefined) setOps["body.ar"] = bodyAr;

    if (stats !== undefined) {
        const statsError = validateStats(stats);
        if (statsError) return NextResponse.json({ error: statsError }, { status: 400 });
        setOps.stats = normalizeStats(stats);
    }

    if (isActive === true) {
        await AboutContent.updateMany({ _id: { $ne: id } }, { $set: { isActive: false } });
        setOps.isActive = true;
    } else if (isActive === false) {
        setOps.isActive = false;
    }

    if (Object.keys(setOps).length === 0) {
        return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const item = await AboutContent.findByIdAndUpdate(id, { $set: setOps }, { new: true });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ item });
}

export async function DELETE(req, { params }) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    // ✅ استخدام await مع params
    const { id } = await params;

    const deleted = await AboutContent.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true });
}