// lib/auth/jwt.js
import { SignJWT, jwtVerify } from "jose";

// JWT_SECRET must be a long random string (32+ chars), e.g.:
// openssl rand -base64 32
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signAdminToken(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("8h")
        .sign(secret);
}

export async function verifyAdminToken(token) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch {
        return null;
    }
}
