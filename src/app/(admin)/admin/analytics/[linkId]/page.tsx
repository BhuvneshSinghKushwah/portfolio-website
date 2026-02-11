import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AnalyticsView } from "@/components/admin/AnalyticsView";
import type { TrackableLink, LinkVisit } from "@/types/database";

interface PageProps {
  params: Promise<{ linkId: string }>;
}

export default async function AnalyticsPage({ params }: PageProps) {
  const { linkId } = await params;
  const supabase = await createClient();

  const [linkRes, visitsRes] = await Promise.all([
    supabase.from("trackable_links").select("*").eq("id", linkId).single(),
    supabase
      .from("link_visits")
      .select("*")
      .eq("link_id", linkId)
      .order("visited_at", { ascending: false }),
  ]);

  if (!linkRes.data) notFound();

  return (
    <AnalyticsView
      link={linkRes.data as TrackableLink}
      visits={(visitsRes.data ?? []) as LinkVisit[]}
    />
  );
}
