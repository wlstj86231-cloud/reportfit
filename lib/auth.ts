export const AUTH_COOKIE = "reportools_session";

export function hasPasswordConfig(): boolean {
  return Boolean(process.env.REPORTOOLS_PASSWORD);
}

export async function createSessionValue(password: string): Promise<string> {
  return sha256(`reportools:${password}`);
}

export async function getExpectedSessionValue(): Promise<string | null> {
  const password = process.env.REPORTOOLS_PASSWORD;
  if (!password) return null;
  return createSessionValue(password);
}

export async function verifyPassword(input: string): Promise<boolean> {
  const password = process.env.REPORTOOLS_PASSWORD;
  return Boolean(password) && input === password;
}

async function sha256(value: string): Promise<string> {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
