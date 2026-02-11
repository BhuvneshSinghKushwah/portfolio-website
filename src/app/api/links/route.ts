import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { linkCreateSchema } from "@/lib/validators";
import { generateSlug } from "@/lib/slug";

export async function GET() {
  const { error, supabase } = await requireApiAuth();
  if (error) return error;

  const { data, error: dbError } = await supabase
    .from("link_analytics_summary")
    .select("*")
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { error, supabase } = await requireApiAuth();
  if (error) return error;

  const body = await request.json();
  const parsed = linkCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
  }

  const slug = parsed.data.slug || generateSlug();

  const { data, error: dbError } = await supabase
    .from("trackable_links")
    .insert({
      slug,
      metadata: parsed.data.metadata,
      is_active: parsed.data.is_active,
    })
    .select()
    .single();

  if (dbError) {
    if (dbError.code === "23505") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
