import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { Project } from "@/types/database";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("projects").select("*").eq("id", id).single();

  if (!data) notFound();

  return <ProjectForm project={data as Project} />;
}
