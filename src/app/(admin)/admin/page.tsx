import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [linksRes, visitsRes, visits7dRes, contactsRes] = await Promise.all([
    supabase.from("trackable_links").select("id", { count: "exact", head: true }),
    supabase.from("link_visits").select("id", { count: "exact", head: true }),
    supabase
      .from("link_visits")
      .select("id", { count: "exact", head: true })
      .gte("visited_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  const stats = [
    { label: "Total Links", value: linksRes.count ?? 0, href: "/admin/links" },
    { label: "Total Visits", value: visitsRes.count ?? 0, href: "/admin/links" },
    { label: "Visits (7d)", value: visits7dRes.count ?? 0, href: "/admin/links" },
    { label: "Unread Contacts", value: contactsRes.count ?? 0, href: "/admin/contacts" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-card-border bg-card-bg p-6 transition-colors hover:border-accent/50"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/links/new"
          className="rounded-xl border border-dashed border-card-border bg-card-bg p-6 text-center transition-colors hover:border-accent"
        >
          <p className="text-lg font-medium text-foreground">Create New Link</p>
          <p className="text-sm text-muted">Generate a trackable portfolio link</p>
        </Link>
        <Link
          href="/admin/content"
          className="rounded-xl border border-dashed border-card-border bg-card-bg p-6 text-center transition-colors hover:border-accent"
        >
          <p className="text-lg font-medium text-foreground">Manage Content</p>
          <p className="text-sm text-muted">Edit portfolio sections</p>
        </Link>
      </div>
    </div>
  );
}
