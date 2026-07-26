// app/api/projects/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

export async function GET() {
    await connectDB();
    const items = await Project.find({ isPublished: true }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ items });
}