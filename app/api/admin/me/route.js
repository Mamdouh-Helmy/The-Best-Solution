// app/api/admin/me/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET(req) {
    const session = await requireAdmin(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // requireAdmin only guarantees a valid session (from the JWT payload),
    // which won't reflect a name/avatar set after the token was issued —
    // so pull the current record for anything display-related.
    await connectDB();
    const id = session._id?.toString?.() || session.id || session.sub;
    const admin = await Admin.findById(id).select("username name image");
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return NextResponse.json({
        admin: {
            id: admin._id.toString(),
            username: admin.username,
            name: admin.name || "",
            image: admin.image?.url ? { url: admin.image.url, publicId: admin.image.publicId } : null,
        },
    });
}