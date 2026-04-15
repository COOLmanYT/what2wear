import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const API_KEY_PREFIX = "sk_live_";
const API_KEY_BYTES = 32;
const SCRYPT_KEYLEN = 64;
const HASH_SALT_BYTES = 16;
const PREVIEW_CHARS = 4;

export function generateApiKey(): { key: string; preview: string } {
  const token = randomBytes(API_KEY_BYTES).toString("base64url");
  const key = `${API_KEY_PREFIX}${token}`;
  return { key, preview: `${API_KEY_PREFIX}${token.slice(0, PREVIEW_CHARS)}` };
}

export function hashApiKey(apiKey: string): string {
  const salt = randomBytes(HASH_SALT_BYTES).toString("hex");
  const hash = scryptSync(apiKey, salt, SCRYPT_KEYLEN).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyApiKey(apiKey: string, storedHash: string): boolean {
  const [salt, expectedHash] = storedHash.split(":");
  if (!salt || !expectedHash) return false;
  const computedHash = scryptSync(apiKey, salt, SCRYPT_KEYLEN).toString("hex");
  return timingSafeEqual(Buffer.from(computedHash, "hex"), Buffer.from(expectedHash, "hex"));
}
