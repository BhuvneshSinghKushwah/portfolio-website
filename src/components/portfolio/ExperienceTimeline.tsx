import { Card } from "@/components/ui/Card";
import { ExperienceCard } from "./ExperienceCard";
import type { Experience } from "@/types/database";

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <Card colSpan={2} rowSpan={2} className="overflow-y-auto">
      <h2 className="section-label mb-6">Experience</h2>
      <div>
        {experiences.map((exp, i) => (
          <ExperienceCard
            key={exp.id}
            experience={exp}
            isLast={i === experiences.length - 1}
            index={i}
          />
        ))}
      </div>
    </Card>
  );
}
