"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import type { Project } from "@/types/database";

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project;

  const [form, setForm] = useState({
    name: project?.name ?? "",
    tagline: project?.tagline ?? "",
    description: project?.description ?? "",
    github_url: project?.github_url ?? "",
    live_url: project?.live_url ?? "",
    tech_tags: project?.tech_tags?.join(", ") ?? "",
    year: project?.year ?? "",
    sort_order: project?.sort_order ?? 0,
    is_visible: project?.is_visible ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const url = isEditing ? `/api/content/projects/${project.id}` : "/api/content/projects";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tech_tags: form.tech_tags.split(",").map((t) => t.trim()).filter(Boolean),
          live_url: form.live_url || null,
        }),
      });

      if (!res.ok) {
        setToast({ message: "Failed to save", type: "error" });
        return;
      }

      setToast({ message: isEditing ? "Updated!" : "Created!", type: "success" });
      setTimeout(() => router.push("/admin/content/projects"), 1000);
    } catch {
      setToast({ message: "Network error", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        {isEditing ? "Edit Project" : "Add Project"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
        <Input label="GitHub URL" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
        <Input label="Live URL (optional)" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
        <Input label="Tech Tags (comma-separated)" placeholder="Python, Docker, FastAPI" value={form.tech_tags} onChange={(e) => setForm({ ...form, tech_tags: e.target.value })} />
        <Input label="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
        <Input label="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />

        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} className="rounded" />
          Visible on portfolio
        </label>

        <Button type="submit" disabled={saving} size="lg">
          {saving ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
        </Button>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
