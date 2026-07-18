import { NextResponse } from "next/server";
import { AUTH_COOKIE, createSessionValue, hasPasswordConfig, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  if (!hasPasswordConfig()) {
    return NextResponse.json(
      { ok: false, message: "REPORTOOLS_PASSWORD 환경변수가 설정되지 않았습니다." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as { password?: string };
  const password = String(body.password ?? "");

  if (!(await verifyPassword(password))) {
    return NextResponse.json({ ok: false, message: "비밀번호가 맞지 않습니다." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, await createSessionValue(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}
