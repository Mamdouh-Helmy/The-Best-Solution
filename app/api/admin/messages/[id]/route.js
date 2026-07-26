// app/api/admin/messages/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/models/Message";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function PATCH(req, { params }) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const { isRead } = await req.json();

    if (isRead === undefined) {
        return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const setOps = { isRead: !!isRead };

    const item = await Message.findByIdAndUpdate(id, { $set: setOps }, { returnDocument: "after" });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ item });
}

export async function DELETE(req, { params }) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;

    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true });
}