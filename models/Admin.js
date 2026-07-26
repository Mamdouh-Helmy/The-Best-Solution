// models/Admin.js
import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        // Display name shown in the admins list / topbar — optional, falls
        // back to username in the UI when empty.
        name: { type: String, trim: true, default: "" },
        // Avatar stored on Cloudinary. We keep the publicId alongside the
        // url so we can delete the asset from Cloudinary later (on replace
        // or on admin deletion) without having to parse it out of the URL.
        image: {
            url: { type: String, default: "" },
            publicId: { type: String, default: "" },
        },
        failedAttempts: { type: Number, default: 0 },
        lockUntil: { type: Date, default: null },
        lastLoginAt: { type: Date, default: null },
    },
    { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);