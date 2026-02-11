import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { LinkAnalyticsSummary } from "@/types/database";

export default async function LinksPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("link_analytics_summary")
    .select("*")
    .order("created_at", { ascending: false });

  const links = (data ?? []) as LinkAnalyticsSummary[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Trackable Links</h1>
        <Link
          href="/admin/links/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Create Link
        </Link>
      </div>

      {links.length === 0 ? (
        <p className="text-muted">No links created yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-card-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-card-border bg-card-bg">
              <tr>
                <th className="px-4 py-3 font-medium text-muted">Slug</th>
                <th className="px-4 py-3 font-medium text-muted">Metadata</th>
                <th className="px-4 py-3 font-medium text-muted">Visits</th>
                <th className="px-4 py-3 font-medium text-muted">Countries</th>
                <th className="px-4 py-3 font-medium text-muted">Avg Duration</th>
                <th className="px-4 py-3 font-medium text-muted">Status</th>
                <th className="px-4 py-3 font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-card-bg/50">
                  <td className="px-4 py-3">
                    <code className="rounded bg-background px-2 py-0.5 text-xs text-accent">
                      /l/{link.slug}
                    </code>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-muted">
                    {Object.entries(link.metadata || {})
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-foreground">{link.total_visits}</td>
                  <td className="px-4 py-3 text-foreground">{link.unique_countries}</td>
                  <td className="px-4 py-3 text-foreground">
                    {link.avg_session_duration
                      ? `${Math.round(link.avg_session_duration)}s`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        link.is_active
                          ? "bg-success/10 text-success"
                          : "bg-error/10 text-error"
                      }`}
                    >
                      {link.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/analytics/${link.id}`}
                      className="text-accent hover:underline"
                    >
                      Analytics
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
