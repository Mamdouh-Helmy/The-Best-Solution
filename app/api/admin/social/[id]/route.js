// app/api/admin/social/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SocialLink from "@/models/SocialLink";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { validateSocialPayload } from "@/lib/validation/social";
import { deleteImage } from "@/lib/cloudinary";

export async function PATCH(req, { params }) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const target = await SocialLink.findById(id);
    if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // تحديث سريع (order أو isActive بس) — بيتكتب مباشرة من غير ما يمر
    // على فاليديشن الحقول الكاملة، زي منطق order/isPublished في
    // testimonials.
    const bodyKeys = Object.keys(body);
    const isQuickUpdate = bodyKeys.length > 0 && bodyKeys.every((k) => k === "order" || k === "isActive");

    if (isQuickUpdate) {
        const setOps = {};
        if (body.order !== undefined) setOps.order = body.order;
        if (body.isActive !== undefined) setOps.isActive = !!body.isActive;
        const item = await SocialLink.findByIdAndUpdate(id, { $set: setOps }, { returnDocument: "after" });
        return NextResponse.json({ item });
    }

    // تعديل كامل (من مودال التعديل) — فاليديشن كاملة زي الإنشاء
    const merged = {
        label: body.label ?? target.label,
        href: body.href ?? target.href,
        iconType: body.iconType ?? target.iconType,
        iconKey: body.iconKey ?? target.iconKey,
        image: body.image ?? target.image,
    };

    const { isValid, errors, values } = validateSocialPayload(merged);
    if (!isValid) return NextResponse.json({ error: Object.values(errors)[0], errors }, { status: 400 });

    // لو اتغيّرت الصورة (أو اتحول من custom لـ preset)، امسح الصورة
    // القديمة من Cloudinary عشان ميفضلش storage متراكم من غير استخدام.
    const oldPublicId = target.iconType === "custom" ? target.image?.publicId : undefined;
    const newPublicId = values.iconType === "custom" ? values.image?.publicId : undefined;
    if (oldPublicId && oldPublicId !== newPublicId) {
        await deleteImage(oldPublicId);
    }

    const setOps = { ...values };
    if (body.isActive !== undefined) setOps.isActive = !!body.isActive;

    const item = await SocialLink.findByIdAndUpdate(id, { $set: setOps }, { returnDocument: "after" });
    return NextResponse.json({ item });
}

export async function DELETE(req, { params }) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;

    const deleted = await SocialLink.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (deleted.iconType === "custom" && deleted.image?.publicId) {
        await deleteImage(deleted.image.publicId);
    }

    return NextResponse.json({ ok: true });
}