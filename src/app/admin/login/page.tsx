"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    router.push("/admin/applications");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-10">
          <p className="text-[0.6875rem] font-semibold tracking-[0.18em] uppercase text-[#1B3F7A] mb-1">
            어깨동무
          </p>
          <h1 className="text-[1.5rem] font-bold tracking-tight text-[#1A2535]">
            관리자 로그인
          </h1>
        </div>

        {/* 폼 카드 */}
        <div
          className="bg-white rounded-[4px] px-8 py-8"
          style={{ boxShadow: "0 1px 4px rgba(15,31,61,0.08), 0 8px 24px rgba(15,31,61,0.06)" }}
        >
          <form onSubmit={handleLogin} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.75rem] font-semibold text-[#5A6472] tracking-wide">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eokkae0202@gmail.com"
                required
                className="w-full px-4 py-[0.6875rem] text-[0.875rem] text-[#1A2535] bg-[#F8F9FB] border border-[#E8EAED] rounded-[3px] outline-none focus:border-[#1B3F7A] focus:ring-2 focus:ring-[#1B3F7A]/10 transition-all duration-200 placeholder:text-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.75rem] font-semibold text-[#5A6472] tracking-wide">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-[0.6875rem] text-[0.875rem] text-[#1A2535] bg-[#F8F9FB] border border-[#E8EAED] rounded-[3px] outline-none focus:border-[#1B3F7A] focus:ring-2 focus:ring-[#1B3F7A]/10 transition-all duration-200"
              />
            </div>

            {error && (
              <p className="text-[0.75rem] text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-[0.875rem] bg-[#1B3F7A] text-white text-[0.875rem] font-bold tracking-tight rounded-[3px] hover:bg-[#163260] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[0.75rem] text-[#B0B8C1]">
          어깨동무 내부 관리 시스템
        </p>
      </div>
    </div>
  );
}
