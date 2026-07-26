// app/api/testimonials/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";

export async function GET() {
    await connectDB();
    const items = await Testimonial.find({ isPublished: true }).sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ items });
}