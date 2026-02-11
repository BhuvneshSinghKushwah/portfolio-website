"use client";

import { ContentListPage } from "@/components/admin/ContentListPage";
import type { Project } from "@/types/database";

interface ProjectsListProps {
  projects: Project[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <ContentListPage
      title="Projects"
      items={projects}
      tableName="projects"
      newHref="/admin/content/projects/new"
      editHref={(id) => `/admin/content/projects/${id}`}
      renderItem={(item) => {
        const proj = item as unknown as Project;
        return (
          <div>
            <p className="font-medium text-foreground">{proj.name}</p>
            <p className="text-sm text-muted">{proj.tagline} · {proj.year}</p>
          </div>
        );
      }}
    />
  );
}
