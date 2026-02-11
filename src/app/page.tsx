import { getPortfolioData } from "@/lib/portfolio-data";
import { PortfolioContent } from "@/components/portfolio/PortfolioContent";

export const revalidate = 60;

export default async function HomePage() {
  const { personalInfo, experiences, projects, skills, education } =
    await getPortfolioData();

  if (!personalInfo) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Portfolio data not configured yet.</p>
      </main>
    );
  }

  return (
    <PortfolioContent
      personalInfo={personalInfo}
      experiences={experiences}
      projects={projects}
      skills={skills}
      education={education}
    />
  );
}
