// app/api/admin/admins/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;

export async function GET(req) {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const items = await Admin.find().select("-passwordHash").sort({ createdAt: -1 });
    return NextResponse.json({ items });
}

export async function POST(req) {
    const requester = await requireAdmin(req);
    if (!requester) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { username, password, name, image } = body;

    if (!username?.trim() || !password) {
        return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        return NextResponse.json(
            { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
            { status: 400 }
        );
    }

    try {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const item = await Admin.create({
            username: username.toLowerCase().trim(),
            passwordHash,
            name: name?.trim() || "",
            image: {
                url: image?.url || "",
                publicId: image?.publicId || "",
            },
        });

        const { passwordHash: _omit, ...safe } = item.toObject();
        return NextResponse.json({ item: safe }, { status: 201 });
    } catch (err) {
        if (err?.code === 11000) {
            return NextResponse.json({ error: "That username is already taken" }, { status: 409 });
        }
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}