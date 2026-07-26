// lib/db.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in your .env.local file");
}

// في Next.js dev mode الملفات بتتعمل reload كتير، فلو عملنا connect
// عادي هيتكرر الاتصال كل مرة ويعمل تحذير/تسريب اتصالات. بنكاش
// الاتصال على global عشان يفضل نفس الاتصال طول الوقت.
let cached = global._mongoose;

if (!cached) {
    cached = global._mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, { bufferCommands: false })
            .then((mongooseInstance) => mongooseInstance);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;
