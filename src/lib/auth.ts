/**
 * Authentication & Session Management Module
 * Provides cryptographic password hashing and tamper-proof signed session tokens.
 */

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "ponchomukh-secure-salt-2026-production-key";

// Helper: Convert string to BufferSource
function stringToBufferSource(str: string): BufferSource {
  return new TextEncoder().encode(str) as unknown as BufferSource;
}

// Helper: Convert ArrayBuffer to Hex
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Hash password securely with SHA-256 and salt
 */
export async function hashPassword(password: string, salt: string = "ponchomukh_salt"): Promise<string> {
  const combined = `${password}:${salt}:${AUTH_SECRET}`;
  const data = stringToBufferSource(combined);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(hashBuffer);
}

/**
 * Verify plaintext password against stored hash
 */
export async function verifyPassword(password: string, storedHash?: string | null): Promise<boolean> {
  if (!storedHash) return false;
  
  // Also check direct match for seeds or legacy hashes
  if (password === storedHash) return true;
  
  const computed = await hashPassword(password);
  return computed === storedHash;
}

/**
 * Generate HMAC-SHA256 signature for a payload
 */
async function signPayload(payloadStr: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    stringToBufferSource(AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    stringToBufferSource(payloadStr)
  );

  return bufferToHex(signature);
}

/**
 * Create a signed, tamper-proof session token: payloadBase64.signatureHex
 */
export async function createAdminToken(user: { id: string; email: string; role: string; name?: string }): Promise<string> {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name || "",
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const payloadStr = JSON.stringify(payload);
  const payloadBase64 = typeof Buffer !== "undefined"
    ? Buffer.from(payloadStr).toString("base64url")
    : btoa(payloadStr).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const signature = await signPayload(payloadBase64);
  return `${payloadBase64}.${signature}`;
}

/**
 * Verify and decode session token
 */
export async function verifyAdminToken(token?: string | null): Promise<{ userId: string; email: string; role: string; name: string } | null> {
  if (!token || !token.includes(".")) return null;

  try {
    const [payloadBase64, providedSignature] = token.split(".");
    if (!payloadBase64 || !providedSignature) return null;

    const expectedSignature = await signPayload(payloadBase64);
    if (expectedSignature !== providedSignature) {
      return null; // Tampered token
    }

    const payloadStr = typeof Buffer !== "undefined"
      ? Buffer.from(payloadBase64, "base64url").toString("utf-8")
      : atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));

    const payload = JSON.parse(payloadStr);

    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }

    if (!["ADMIN", "SUPER_ADMIN", "STAFF"].includes(payload.role)) {
      return null; // Insufficient role
    }

    return payload;
  } catch (error) {
    console.error("verifyAdminToken error:", error);
    return null;
  }
}
