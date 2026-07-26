// lib/auth/requireAdmin.js
import { verifyAdminToken } from "./jwt";

// Route-level check, in addition to middleware.js. Belt and suspenders —
// if middleware.js is ever changed, individual routes still protect
// themselves. Returns the decoded token payload, or null.
export async function requireAdmin(req) {
    const token = req.cookies.get("admin_session")?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
}
