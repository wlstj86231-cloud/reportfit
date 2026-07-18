"use client";

import { FormEvent, useMemo, useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isMissingConfig = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("reason") === "missing";
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (response.ok) {
      window.location.href = "/";
      return;
    }

    const data = (await response.json().catch(() => ({}))) as { message?: string };
    setMessage(data.message ?? "로그인에 실패했습니다.");
    setIsLoading(false);
  }

  return (
    <main className="login-shell">
      <section className="login-panel" aria-label="reportools 로그인">
        <div className="login-mark">
          <ShieldCheck size={28} />
        </div>
        <span className="eyebrow">private sourcing workspace</span>
        <h1>reportools</h1>
        <p>비밀번호를 입력해야 도매꾹 상품 분석 화면이 열립니다.</p>

        <form onSubmit={submit}>
          <label htmlFor="password">비밀번호</label>
          <div className="input-with-icon">
            <LockKeyhole size={18} />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              autoFocus
            />
          </div>
          <button className="primary-button" type="submit" disabled={isLoading || !password}>
            {isLoading ? "확인 중" : "들어가기"}
          </button>
        </form>

        {isMissingConfig ? (
          <div className="notice error">서버에 REPORTOOLS_PASSWORD 환경변수를 먼저 설정해야 합니다.</div>
        ) : null}
        {message ? <div className="notice error">{message}</div> : null}
      </section>
    </main>
  );
}
