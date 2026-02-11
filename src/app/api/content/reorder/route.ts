import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { reorderSchema } from "@/lib/validators";

export async function PATCH(request: NextRequest) {
  const { error, supabase } = await requireApiAuth();
  if (error) return error;

  const body = await request.json();
  const parsed = reorderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
  }

  const updates = parsed.data.items.map((item) =>
    supabase
      .from(parsed.data.table)
      .update({ sort_order: item.sort_order })
      .eq("id", item.id)
  );

  const results = await Promise.all(updates);
  const failed = results.some((r) => r.error);

  if (failed) {
    return NextResponse.json({ error: "Some updates failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "Reorder successful" });
}
