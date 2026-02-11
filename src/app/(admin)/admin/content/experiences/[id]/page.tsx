import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import type { Experience } from "@/types/database";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return <ExperienceForm experience={data as Experience} />;
}
