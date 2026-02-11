"use client";

import { ContentListPage } from "@/components/admin/ContentListPage";
import type { Experience } from "@/types/database";

interface ExperiencesListProps {
  experiences: Experience[];
}

export function ExperiencesList({ experiences }: ExperiencesListProps) {
  return (
    <ContentListPage
      title="Experiences"
      items={experiences}
      tableName="experiences"
      newHref="/admin/content/experiences/new"
      editHref={(id) => `/admin/content/experiences/${id}`}
      renderItem={(item) => {
        const exp = item as unknown as Experience;
        return (
          <div>
            <p className="font-medium text-foreground">{exp.company}</p>
            <p className="text-sm text-muted">
              {exp.role} · {exp.start_date} – {exp.end_date}
            </p>
          </div>
        );
      }}
    />
  );
}
