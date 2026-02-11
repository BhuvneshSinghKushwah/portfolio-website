import { createClient } from "@/lib/supabase/server";
import { ProjectsList } from "./ProjectsList";
import type { Project } from "@/types/database";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").order("sort_order");

  return <ProjectsList projects={(data ?? []) as Project[]} />;
}
