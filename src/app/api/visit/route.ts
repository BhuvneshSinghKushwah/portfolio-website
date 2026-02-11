import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseUserAgent } from "@/lib/user-agent";
import { hashIP } from "@/lib/hash";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const linkId = body.link_id;

  if (!linkId) {
    return NextResponse.json({ error: "link_id required" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const ua = request.headers.get("user-agent") ?? null;
  const referer = request.headers.get("referer") ?? body.referrer ?? null;
  const country = request.headers.get("x-vercel-ip-country") ?? null;
  const city = request.headers.get("x-vercel-ip-city") ?? null;
  const region = request.headers.get("x-vercel-ip-country-region") ?? null;

  const { device_type, browser, os } = parseUserAgent(ua);
  const hashedIp = await hashIP(ip);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("link_visits")
    .insert({
      link_id: linkId,
      ip_address: hashedIp,
      country,
      city,
      region,
      referrer: referer,
      user_agent: ua,
      device_type,
      browser,
      os,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to record visit" }, { status: 500 });
  }

  return NextResponse.json({ visit_id: data.id });
}
