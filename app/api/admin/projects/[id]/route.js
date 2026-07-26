// app/api/admin/projects/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import cloudinary from "@/lib/cloudinary";

export async function PATCH(req, { params }) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
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
        order,
    } = body;

    const target = await Project.findById(id);
    if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const setOps = {};
    if (fileName !== undefined) setOps.fileName = fileName.trim();
    if (techLabel !== undefined) setOps.techLabel = techLabel.trim();
    if (href !== undefined) setOps.href = href.trim() || "#";
    if (linkLabel !== undefined) setOps.linkLabel = linkLabel.trim();
    if (isPublished !== undefined) setOps.isPublished = !!isPublished;
    if (order !== undefined) setOps.order = order;

    if (tagEn !== undefined || tagAr !== undefined) {
        setOps.tag = {
            en: (tagEn ?? target.tag.en).trim(),
            ar: (tagAr ?? target.tag.ar).trim(),
        };
    }
    if (titleEn !== undefined || titleAr !== undefined) {
        setOps.title = {
            en: (titleEn ?? target.title.en).trim(),
            ar: (titleAr ?? target.title.ar).trim(),
        };
    }
    if (descEn !== undefined || descAr !== undefined) {
        setOps.desc = {
            en: (descEn ?? target.desc.en).trim(),
            ar: (descAr ?? target.desc.ar).trim(),
        };
    }

    // Replacing the screenshot — clean up the old Cloudinary asset.
    if (image !== undefined) {
        const oldPublicId = target.image?.publicId;
        if (oldPublicId && oldPublicId !== image?.publicId) {
            await cloudinary.uploader.destroy(oldPublicId).catch((err) => {
                console.error("Failed to remove old project image from Cloudinary:", err);
            });
        }
        setOps.image = { url: image?.url || "", publicId: image?.publicId || "" };
    }

    if (Object.keys(setOps).length === 0) {
        return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const item = await Project.findByIdAndUpdate(id, { $set: setOps }, { new: true });
    return NextResponse.json({ item });
}

export async function DELETE(req, { params }) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;

    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (deleted.image?.publicId) {
        await cloudinary.uploader.destroy(deleted.image.publicId).catch((err) => {
            console.error("Failed to remove project image from Cloudinary:", err);
        });
    }

    return NextResponse.json({ ok: true });
}