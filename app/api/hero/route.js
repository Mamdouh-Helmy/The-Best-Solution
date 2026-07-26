//api/hero/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HeroContent from "@/models/HeroContent";

export async function GET() {
    await connectDB();
    const item = await HeroContent.findOne({ isActive: true }).sort({ updatedAt: -1 });
    // null when nothing has been set yet — the home page falls back to
    // its default translation strings in that case.
    return NextResponse.json({ item: item || null });
}
