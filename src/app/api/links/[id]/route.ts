import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { linkUpdateSchema } from "@/lib/validators";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireApiAuth();
  if (error) return error;

  const { id } = await params;
  const { data, error: dbError } = await supabase
    .from("trackable_links")
    .select("*")
    .eq("id", id)
    .single();

  if (dbError || !data) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireApiAuth();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const parsed = linkUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { data, error: dbError } = await supabase
    .from("trackable_links")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, supabase } = await requireApiAuth();
  if (error) return error;

  const { id } = await params;
  const { error: dbError } = await supabase
    .from("trackable_links")
    .delete()
    .eq("id", id);

  if (dbError) {
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }

  return NextResponse.json({ message: "Link deleted" });
}
