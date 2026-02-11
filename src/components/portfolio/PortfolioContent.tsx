import { BentoGrid } from "./BentoGrid";
import { HeroCard } from "./HeroCard";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { ProjectCard } from "./ProjectCard";
import { SkillCategoryCard } from "./SkillCategoryCard";
import { EducationCard } from "./EducationCard";
import { ContactForm } from "./ContactForm";
import { PersonalizedGreeting } from "./PersonalizedGreeting";
import type { PersonalInfo, Experience, Project, Skill, Education } from "@/types/database";

interface PortfolioContentProps {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  education: Education[];
  greeting?: { name: string; company?: string };
}

/** Composes all portfolio sections into the bento grid layout with staggered indices and section dividers. */
export function PortfolioContent({
  personalInfo,
  experiences,
  projects,
  skills,
  education,
  greeting,
}: PortfolioContentProps) {
  let idx = 0;

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {greeting && (
        <PersonalizedGreeting name={greeting.name} company={greeting.company} />
      )}
      <BentoGrid>
        <HeroCard info={personalInfo} />
        <ExperienceTimeline experiences={experiences} />

        <div className="section-label col-span-full py-2">Projects</div>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} index={idx++} />
        ))}

        <div className="section-label col-span-full py-2">Skills</div>
        {skills.map((skill) => (
          <SkillCategoryCard key={skill.id} skill={skill} index={idx++} />
        ))}

        <EducationCard education={education} index={idx++} />
        <ContactForm />
      </BentoGrid>

      <footer className="mt-16 border-t border-accent/10 pt-8 text-center text-xs text-muted/50 font-mono">
        <p>// &copy; {new Date().getFullYear()} {personalInfo.full_name} — EOF</p>
      </footer>
    </main>
  );
}
