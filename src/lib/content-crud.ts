import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { z } from "zod";

type TableName = "personal_info" | "experiences" | "projects" | "skills" | "education";

/** Creates standard GET (list) and POST (create) handlers for a content table. */
export function createListCreateHandlers(table: TableName, schema: z.ZodSchema) {
  async function GET() {
    const { error, supabase } = await requireApiAuth();
    if (error) return error;

    const query = supabase.from(table).select("*");
    if (table !== "personal_info") {
      query.order("sort_order");
    }

    const { data, error: dbError } = await query;
    if (dbError) {
      return NextResponse.json({ error: `Failed to fetch ${table}` }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  async function POST(request: NextRequest) {
    const { error, supabase } = await requireApiAuth();
    if (error) return error;

    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
    }

    const { data, error: dbError } = await supabase
      .from(table)
      .insert(parsed.data as Record<string, unknown>)
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ error: `Failed to create ${table} entry` }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  }

  return { GET, POST };
}

/** Creates standard GET (single), PATCH (update), and DELETE handlers for a content table. */
export function createItemHandlers(table: TableName, _schema: z.ZodSchema) {
  async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error, supabase } = await requireApiAuth();
    if (error) return error;

    const { id } = await params;
    const { data, error: dbError } = await supabase
      .from(table)
      .select("*")
      .eq("id", id)
      .single();

    if (dbError || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  }

  async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error, supabase } = await requireApiAuth();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();

    const { data, error: dbError } = await supabase
      .from(table)
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ error: `Failed to update ${table} entry` }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error, supabase } = await requireApiAuth();
    if (error) return error;

    const { id } = await params;
    const { error: dbError } = await supabase.from(table).delete().eq("id", id);

    if (dbError) {
      return NextResponse.json({ error: `Failed to delete ${table} entry` }, { status: 500 });
    }

    return NextResponse.json({ message: "Deleted" });
  }

  return { GET, PATCH, DELETE };
}
