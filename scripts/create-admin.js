// Usage: node scripts/create-admin.js <username> <password>
// This is a one-off CLI script — there is intentionally no public
// "register admin" API route. Run it manually whenever you need to
// create the admin account or rotate its password.

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

async function main() {
    const [, , username, password] = process.argv;

    if (!username || !password) {
        console.error("Usage: node scripts/create-admin.js <username> <password>");
        process.exit(1);
    }
    if (password.length < 12) {
        console.error("Password must be at least 12 characters.");
        process.exit(1);
    }
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI is not set in the environment.");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const passwordHash = await bcrypt.hash(password, 12);
    await Admin.findOneAndUpdate(
        { username: username.toLowerCase() },
        {
            username: username.toLowerCase(),
            passwordHash,
            failedAttempts: 0,
            lockUntil: null,
        },
        { upsert: true }
    );

    console.log(`Admin created/updated: ${username}`);
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
