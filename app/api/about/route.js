// app/api/about/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AboutContent from "@/models/AboutContent";

export async function GET() {
    await connectDB();
    const item = await AboutContent.findOne({ isActive: true }).sort({ updatedAt: -1 });
    // null when nothing has been set active yet — the About section
    // falls back to its default translation strings + DEFAULT_STATS in
    // that case, same pattern as the Hero section.
    return NextResponse.json({ item: item || null });
}