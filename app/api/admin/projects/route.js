// app/api/admin/projects/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function validateBilingual(en, ar, label) {
    if (!en?.trim() || !ar?.trim()) return `${label} is required in both languages`;
    return null;
}

export async function GET(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const items = await Project.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ items });
}

export async function POST(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const {
        fileName,
        techLabel,
        tagEn,
        tagAr,
        titleEn,
        titleAr,
        descEn,
        descAr,
        href,
        linkLabel,
        image,
        isPublished,
    } = body;

    if (!fileName?.trim() || !techLabel?.trim() || !linkLabel?.trim()) {
        return NextResponse.json(
            { error: "File name, tech label and link label are required" },
            { status: 400 }
        );
    }

    const errors = [
        validateBilingual(tagEn, tagAr, "Tag"),
        validateBilingual(titleEn, titleAr, "Title"),
        validateBilingual(descEn, descAr, "Description"),
    ].filter(Boolean);
    if (errors.length) return NextResponse.json({ error: errors[0] }, { status: 400 });

    // New projects join the end of the order by default.
    const last = await Project.findOne().sort({ order: -1 }).select("order");
    const nextOrder = last ? last.order + 1 : 0;

    const item = await Project.create({
        fileName: fileName.trim(),
        techLabel: techLabel.trim(),
        tag: { en: tagEn.trim(), ar: tagAr.trim() },
        title: { en: titleEn.trim(), ar: titleAr.trim() },
        desc: { en: descEn.trim(), ar: descAr.trim() },
        href: href?.trim() || "#",
        linkLabel: linkLabel.trim(),
        image: { url: image?.url || "", publicId: image?.publicId || "" },
        order: nextOrder,
        isPublished: isPublished !== false,
    });

    return NextResponse.json({ item }, { status: 201 });
}