"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-[0.8125rem] font-medium text-[#8A95A3] border border-[#E8EAED] rounded-[3px] hover:text-[#1A2535] hover:border-[#C0C6CE] transition-colors duration-150"
    >
      로그아웃
    </button>
  );
}
