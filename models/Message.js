// models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        contact: { type: String, required: true, trim: true }, // إيميل أو رقم واتساب
        message: { type: String, required: true, trim: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

MessageSchema.index({ createdAt: -1 });
MessageSchema.index({ isRead: 1 });

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);