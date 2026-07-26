// app/api/admin/admins/[id]/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import cloudinary from "@/lib/cloudinary";

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;

export async function PATCH(req, { params }) {
    const requester = await requireAdmin(req);
    if (!requester) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { username, password, name, image } = body;

    const target = await Admin.findById(id);
    if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const setOps = {};

    if (username !== undefined) {
        if (!username.trim()) return NextResponse.json({ error: "Username can't be empty" }, { status: 400 });
        setOps.username = username.toLowerCase().trim();
    }

    if (name !== undefined) setOps.name = name.trim();

    if (password) {
        if (password.length < MIN_PASSWORD_LENGTH) {
            return NextResponse.json(
                { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
                { status: 400 }
            );
        }
        setOps.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    // Replacing the avatar — clean up the old Cloudinary asset so we don't
    // leak storage every time someone updates their picture.
    if (image !== undefined) {
        const oldPublicId = target.image?.publicId;
        if (oldPublicId && oldPublicId !== image?.publicId) {
            await cloudinary.uploader.destroy(oldPublicId).catch((err) => {
                console.error("Failed to remove old avatar from Cloudinary:", err);
            });
        }
        setOps.image = { url: image?.url || "", publicId: image?.publicId || "" };
    }

    if (Object.keys(setOps).length === 0) {
        return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    try {
        const item = await Admin.findByIdAndUpdate(id, { $set: setOps }, { new: true }).select("-passwordHash");
        return NextResponse.json({ item });
    } catch (err) {
        if (err?.code === 11000) {
            return NextResponse.json({ error: "That username is already taken" }, { status: 409 });
        }
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const requester = await requireAdmin(req);
    if (!requester) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;

    const totalAdmins = await Admin.countDocuments();
    if (totalAdmins <= 1) {
        return NextResponse.json({ error: "You can't delete the last remaining admin" }, { status: 400 });
    }

    const requesterId = requester._id?.toString?.() || requester.id;
    if (requesterId === id) {
        return NextResponse.json({ error: "You can't delete your own account" }, { status: 400 });
    }

    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (deleted.image?.publicId) {
        await cloudinary.uploader.destroy(deleted.image.publicId).catch((err) => {
            console.error("Failed to remove avatar from Cloudinary:", err);
        });
    }

    return NextResponse.json({ ok: true });
}