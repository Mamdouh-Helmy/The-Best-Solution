// app/api/admin/social/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SocialLink from "@/models/SocialLink";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { validateSocialPayload } from "@/lib/validation/social";

export async function GET(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const items = await SocialLink.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ items });
}

export async function POST(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const { isValid, errors, values } = validateSocialPayload(body);
    if (!isValid) return NextResponse.json({ error: Object.values(errors)[0], errors }, { status: 400 });

    const last = await SocialLink.findOne().sort({ order: -1 }).select("order");
    const nextOrder = last ? last.order + 1 : 0;

    const item = await SocialLink.create({
        ...values,
        order: nextOrder,
        isActive: body.isActive !== false,
    });

    return NextResponse.json({ item }, { status: 201 });
}