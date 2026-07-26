// app/api/admin/social/upload/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { uploadImage } from "@/lib/cloudinary";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let formData;
    try {
        formData = await req.formData();
    } catch {
        return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    const file = formData.get("file");
    if (!file || typeof file === "string") {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!file.type?.startsWith("image/")) {
        return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "Image must be under 2MB" }, { status: 400 });
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadImage(buffer, "social-icons");
        return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
    } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }
}