// app/api/admin/messages/unread-count/route.js
// endpoint خفيف مخصوص للـ polling بتاع جرس الإشعارات — من غير ما نجيب
// الليست كلها كل شوية.
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/models/Message";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const unreadCount = await Message.countDocuments({ isRead: false });
    return NextResponse.json({ unreadCount });
}