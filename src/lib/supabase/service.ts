import { createClient } from "@supabase/supabase-js";

/**
 * Service role 클라이언트 — RLS를 우회하므로 서버 전용.
 * 절대 클라이언트 컴포넌트에서 import 금지.
 */
export const createServiceClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
