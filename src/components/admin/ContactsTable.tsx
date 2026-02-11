"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ContactSubmission } from "@/types/database";

interface ContactsTableProps {
  contacts: ContactSubmission[];
}

/** Admin contacts table with toggle-read functionality. */
export function ContactsTable({ contacts }: ContactsTableProps) {
  const router = useRouter();
  const [toggling, setToggling] = useState<string | null>(null);

  async function toggleRead(id: string, currentlyRead: boolean) {
    setToggling(id);
    const supabase = createClient();
    await supabase
      .from("contact_submissions")
      .update({ is_read: !currentlyRead })
      .eq("id", id);
    setToggling(null);
    router.refresh();
  }

  if (contacts.length === 0) {
    return <p className="text-muted">No contact submissions yet.</p>;
  }

  return (
    <div className="space-y-4">
      {contacts.map((c) => (
        <div
          key={c.id}
          className={`rounded-xl border p-5 ${
            c.is_read ? "border-card-border bg-card-bg/50" : "border-accent/30 bg-card-bg"
          }`}
        >
          <div className="mb-2 flex items-start justify-between">
            <div>
              <p className="font-medium text-foreground">{c.name}</p>
              <p className="text-sm text-muted">{c.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted">
                {new Date(c.created_at).toLocaleDateString()}
              </span>
              <button
                onClick={() => toggleRead(c.id, c.is_read)}
                disabled={toggling === c.id}
                className={`rounded-md px-2 py-1 text-xs transition-colors ${
                  c.is_read
                    ? "text-muted hover:text-foreground"
                    : "bg-accent/10 text-accent hover:bg-accent/20"
                }`}
              >
                {c.is_read ? "Mark Unread" : "Mark Read"}
              </button>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-sm text-muted/80">{c.message}</p>
        </div>
      ))}
    </div>
  );
}
