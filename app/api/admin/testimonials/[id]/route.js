// app/api/admin/testimonials/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function PATCH(req, { params }) {
  const admin = await requireAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const {
    nameEn,
    nameAr,
    roleEn,
    roleAr,
    quoteEn,
    quoteAr,
    rating,
    isPublished,
    order,
  } = body;

  const target = await Testimonial.findById(id);
  if (!target)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const setOps = {};
  if (isPublished !== undefined) setOps.isPublished = !!isPublished;
  if (order !== undefined) setOps.order = order;

  if (rating !== undefined) {
    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }
    setOps.rating = ratingNum;
  }

  if (nameEn !== undefined || nameAr !== undefined) {
    setOps.name = {
      en: (nameEn ?? target.name.en).trim(),
      ar: (nameAr ?? target.name.ar).trim(),
    };
  }
  if (roleEn !== undefined || roleAr !== undefined) {
    setOps.role = {
      en: (roleEn ?? target.role.en).trim(),
      ar: (roleAr ?? target.role.ar).trim(),
    };
  }
  if (quoteEn !== undefined || quoteAr !== undefined) {
    setOps.quote = {
      en: (quoteEn ?? target.quote.en).trim(),
      ar: (quoteAr ?? target.quote.ar).trim(),
    };
  }

  if (Object.keys(setOps).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const item = await Testimonial.findByIdAndUpdate(
    id,
    { $set: setOps },
    { returnDocument: "after" },
  );
  return NextResponse.json({ item });
}

export async function DELETE(req, { params }) {
  const admin = await requireAdmin(req);
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;

  const deleted = await Testimonial.findByIdAndDelete(id);
  if (!deleted)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
