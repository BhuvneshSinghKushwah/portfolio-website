import { createClient } from "@/lib/supabase/server";
import { ExperiencesList } from "./ExperiencesList";
import type { Experience } from "@/types/database";

export default async function ExperiencesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("experiences").select("*").order("sort_order");

  return <ExperiencesList experiences={(data ?? []) as Experience[]} />;
}
