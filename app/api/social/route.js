// app/api/social/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SocialLink from "@/models/SocialLink";

export async function GET() {
    await connectDB();
    const items = await SocialLink.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ items });
}