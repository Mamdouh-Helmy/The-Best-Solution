//api/admin/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db"; // your existing mongoose connector
import Admin from "@/models/Admin";
import { signAdminToken } from "@/lib/auth/jwt";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

        await connectDB();
        const admin = await Admin.findOne({ username: username.toLowerCase().trim() });

        // Same generic error whether the username doesn't exist or the
        // password is wrong — never reveal which one it was.
        const genericError = () =>
            NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

        if (!admin) return genericError();

        if (admin.lockUntil && admin.lockUntil > new Date()) {
            const minsLeft = Math.ceil((admin.lockUntil - new Date()) / 60000);
            return NextResponse.json(
                { error: `Account temporarily locked. Try again in ${minsLeft} min.` },
                { status: 429 }
            );
        }

        const valid = await bcrypt.compare(password, admin.passwordHash);

        if (!valid) {
            admin.failedAttempts += 1;
            if (admin.failedAttempts >= MAX_ATTEMPTS) {
                admin.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60000);
                admin.failedAttempts = 0;
            }
            await admin.save();
            return genericError();
        }

        admin.failedAttempts = 0;
        admin.lockUntil = null;
        admin.lastLoginAt = new Date();
        await admin.save();

        const token = await signAdminToken({ sub: admin._id.toString(), username: admin.username });

        const res = NextResponse.json({ ok: true });
        res.cookies.set("admin_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 8, // 8 hours
        });
        return res;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
