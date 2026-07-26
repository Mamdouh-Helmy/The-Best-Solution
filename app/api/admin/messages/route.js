// app/api/admin/messages/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/models/Message";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 0, 100) || 0;

    let query = Message.find().sort({ createdAt: -1 });
    if (limit) query = query.limit(limit);

    const [items, unreadCount] = await Promise.all([query, Message.countDocuments({ isRead: false })]);

    return NextResponse.json({ items, unreadCount });
}