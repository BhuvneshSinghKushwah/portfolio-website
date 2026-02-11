import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Verifies the request has an authenticated Supabase user. Returns the user or an error response. */
export async function requireApiAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase };
  }

  return { user, error: null, supabase };
}
