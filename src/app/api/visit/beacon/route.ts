import { NextRequest, NextResponse } from "next/server";
import { beaconLimiter } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { beaconSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

  const { success } = await beaconLimiter.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    const text = await request.text();
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
  }

  const parsed = beaconSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid visit_id" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.rpc("record_visit_exit", {
    p_visit_id: parsed.data.visit_id,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to update exit time" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
