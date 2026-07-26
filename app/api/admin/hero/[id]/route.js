// api/admin/hero/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HeroContent from "@/models/HeroContent";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function PATCH(req, { params }) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    
    // ✅ Await the params object first
    const { id } = await params;
    const body = await req.json();
    const { eyebrowEn, eyebrowAr, title, subtitleEn, subtitleAr, isActive } = body;

    // Dot-notation $set so we only touch the fields that were actually
    // sent — writing the whole `eyebrow` object would wipe out the other
    // language if only one was provided.
    const setOps = {};
    if (eyebrowEn !== undefined) setOps["eyebrow.en"] = eyebrowEn;
    if (eyebrowAr !== undefined) setOps["eyebrow.ar"] = eyebrowAr;
    if (title !== undefined) setOps.title = title;
    if (subtitleEn !== undefined) setOps["subtitle.en"] = subtitleEn;
    if (subtitleAr !== undefined) setOps["subtitle.ar"] = subtitleAr;

    if (isActive === true) {
        await HeroContent.updateMany({ _id: { $ne: id } }, { $set: { isActive: false } });
        setOps.isActive = true;
    } else if (isActive === false) {
        setOps.isActive = false;
    }

    if (Object.keys(setOps).length === 0) {
        return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const item = await HeroContent.findByIdAndUpdate(id, { $set: setOps }, { new: true });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ item });
}

export async function DELETE(req, { params }) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    
    // ✅ Await the params object first
    const { id } = await params;

    const deleted = await HeroContent.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true });
}