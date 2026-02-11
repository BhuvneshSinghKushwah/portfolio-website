import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** Verifies the current user is authenticated; redirects to login if not. Returns the user. */
export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/** Checks if the current request has an authenticated user without redirecting. */
export async function getOptionalUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
