// app/api/admin/upload/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import cloudinary from "@/lib/cloudinary";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function uploadBuffer(buffer, folder) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
    });
}

// Uploads a single image (used for admin avatars). Send as multipart
// form-data with the file under the "file" field.
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

    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: "Only JPEG, PNG, WEBP or GIF images are allowed" }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json({ error: "Image must be smaller than 5MB" }, { status: 400 });
    }

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const result = await uploadBuffer(buffer, "admins");

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }
}

// Deletes a previously uploaded image, e.g. when the user cancels out of
// an add/edit form after already uploading a new avatar.
export async function DELETE(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { publicId } = await req.json().catch(() => ({}));
    if (!publicId) return NextResponse.json({ error: "publicId is required" }, { status: 400 });

    try {
        await cloudinary.uploader.destroy(publicId);
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Cloudinary delete failed:", err);
        return NextResponse.json({ error: "Image delete failed" }, { status: 500 });
    }
}