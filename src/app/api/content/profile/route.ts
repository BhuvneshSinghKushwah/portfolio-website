import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { profileSchema } from "@/lib/validators";

export async function GET() {
  const { error, supabase } = await requireApiAuth();
  if (error) return error;

  const { data, error: dbError } = await supabase
    .from("personal_info")
    .select("*")
    .limit(1)
    .single();

  if (dbError) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const { error, supabase } = await requireApiAuth();
  if (error) return error;

  const body = await request.json();
  const parsed = profileSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("personal_info")
    .select("id")
    .limit(1)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { data, error: dbError } = await supabase
    .from("personal_info")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", existing.id)
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json(data);
}
