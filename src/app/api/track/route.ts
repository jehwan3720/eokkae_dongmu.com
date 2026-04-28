import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json();
    const ua = req.headers.get("user-agent") ?? "";
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "";
    const device = /mobile|android|iphone|ipad|ipod/i.test(ua) ? "mobile" : "desktop";

    const service = createServiceClient();
    await service.from("page_views").insert({
      path,
      referrer: referrer || null,
      user_agent: ua,
      ip,
      device,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
