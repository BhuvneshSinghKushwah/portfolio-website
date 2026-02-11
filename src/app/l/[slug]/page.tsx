import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPortfolioData } from "@/lib/portfolio-data";
import { parseUserAgent } from "@/lib/user-agent";
import { hashIP } from "@/lib/hash";
import { PortfolioContent } from "@/components/portfolio/PortfolioContent";
import { SessionTracker } from "@/components/portfolio/SessionTracker";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Fetches trackable link by slug, records the visit server-side, and renders the portfolio with optional personalized greeting. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Bhuvnesh Singh Kushwah | Portfolio`,
    robots: { index: false, follow: false },
    openGraph: {
      title: "Bhuvnesh Singh Kushwah | Backend Engineer",
      description: "Backend Engineer specializing in scalable systems and cloud infrastructure.",
    },
    alternates: { canonical: `/l/${slug}` },
  };
}

export default async function TrackableLinkPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: link } = await supabase
    .from("trackable_links")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!link) notFound();

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const ua = headerStore.get("user-agent") ?? null;
  const referer = headerStore.get("referer") ?? null;
  const country = headerStore.get("x-vercel-ip-country") ?? null;
  const city = headerStore.get("x-vercel-ip-city") ?? null;
  const region = headerStore.get("x-vercel-ip-country-region") ?? null;

  const { device_type, browser, os } = parseUserAgent(ua);
  const hashedIp = await hashIP(ip);

  const { data: visit } = await supabase
    .from("link_visits")
    .insert({
      link_id: link.id,
      ip_address: hashedIp,
      country,
      city,
      region,
      referrer: referer,
      user_agent: ua,
      device_type,
      browser,
      os,
    })
    .select("id")
    .single();

  const { personalInfo, experiences, projects, skills, education } =
    await getPortfolioData();

  if (!personalInfo) notFound();

  const metadata = link.metadata as Record<string, string>;
  const greeting = metadata?.name
    ? { name: metadata.name, company: metadata.company }
    : undefined;

  return (
    <>
      <SessionTracker visitId={visit?.id ?? null} />
      <PortfolioContent
        personalInfo={personalInfo}
        experiences={experiences}
        projects={projects}
        skills={skills}
        education={education}
        greeting={greeting}
      />
    </>
  );
}
