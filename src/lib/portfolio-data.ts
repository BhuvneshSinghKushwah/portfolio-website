import { createClient } from "@/lib/supabase/server";
import type { PersonalInfo, Experience, Project, Skill, Education } from "@/types/database";

/** Fetches all visible portfolio content from Supabase in a single parallel batch. */
export async function getPortfolioData() {
  const supabase = await createClient();

  const [personalRes, expRes, projRes, skillRes, eduRes] = await Promise.all([
    supabase.from("personal_info").select("*").limit(1).single(),
    supabase.from("experiences").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("projects").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("skills").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("education").select("*").eq("is_visible", true).order("sort_order"),
  ]);

  return {
    personalInfo: personalRes.data as PersonalInfo,
    experiences: (expRes.data || []) as Experience[],
    projects: (projRes.data || []) as Project[],
    skills: (skillRes.data || []) as Skill[],
    education: (eduRes.data || []) as Education[],
  };
}
