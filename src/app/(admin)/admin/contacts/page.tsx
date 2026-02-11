import { createClient } from "@/lib/supabase/server";
import { ContactsTable } from "@/components/admin/ContactsTable";
import type { ContactSubmission } from "@/types/database";

export default async function ContactsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Contact Submissions</h1>
      <ContactsTable contacts={(data ?? []) as ContactSubmission[]} />
    </div>
  );
}
