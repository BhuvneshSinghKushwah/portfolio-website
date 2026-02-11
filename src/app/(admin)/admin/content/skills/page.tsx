"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import type { Skill } from "@/types/database";

/** Skills management page - inline editing of categories and their items. */
export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [newItems, setNewItems] = useState("");

  useEffect(() => {
    fetch("/api/content/skills")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setSkills(data); })
      .finally(() => setLoading(false));
  }, []);

  async function handleUpdate(skill: Skill, items: string) {
    setSaving(skill.id);
    const res = await fetch(`/api/content/skills/${skill.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.split(",").map((i) => i.trim()).filter(Boolean),
      }),
    });
    setSaving(null);

    if (res.ok) {
      setToast({ message: "Updated!", type: "success" });
      const updated = await res.json();
      setSkills(skills.map((s) => (s.id === skill.id ? updated : s)));
    } else {
      setToast({ message: "Failed to update", type: "error" });
    }
  }

  async function handleAdd() {
    if (!newCategory.trim()) return;
    setSaving("new");

    const res = await fetch("/api/content/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: newCategory.trim(),
        items: newItems.split(",").map((i) => i.trim()).filter(Boolean),
        sort_order: skills.length,
      }),
    });

    setSaving(null);

    if (res.ok) {
      setToast({ message: "Category added!", type: "success" });
      setNewCategory("");
      setNewItems("");
      const created = await res.json();
      setSkills([...skills, created]);
    } else {
      setToast({ message: "Failed to add", type: "error" });
    }
  }

  async function toggleVisibility(skill: Skill) {
    const res = await fetch(`/api/content/skills/${skill.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_visible: !skill.is_visible }),
    });

    if (res.ok) {
      const updated = await res.json();
      setSkills(skills.map((s) => (s.id === skill.id ? updated : s)));
    }
  }

  if (loading) return <p className="text-muted">Loading skills...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Skills</h1>

      <div className="space-y-4">
        {skills.map((skill) => (
          <SkillEditor
            key={skill.id}
            skill={skill}
            saving={saving === skill.id}
            onSave={(items) => handleUpdate(skill, items)}
            onToggleVisibility={() => toggleVisibility(skill)}
          />
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-card-border bg-card-bg p-5">
        <h2 className="mb-4 font-medium text-foreground">Add New Category</h2>
        <div className="space-y-3">
          <Input
            label="Category Name"
            placeholder="e.g. Cloud & Infrastructure"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Input
            label="Items (comma-separated)"
            placeholder="e.g. AWS, GCP, Azure"
            value={newItems}
            onChange={(e) => setNewItems(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={saving === "new"}>
            {saving === "new" ? "Adding..." : "Add Category"}
          </Button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function SkillEditor({
  skill,
  saving,
  onSave,
  onToggleVisibility,
}: {
  skill: Skill;
  saving: boolean;
  onSave: (items: string) => void;
  onToggleVisibility: () => void;
}) {
  const [items, setItems] = useState(skill.items.join(", "));

  return (
    <div className={`rounded-xl border p-5 ${skill.is_visible ? "border-card-border bg-card-bg" : "border-card-border/50 bg-card-bg/30 opacity-60"}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-foreground">{skill.category}</h3>
        <button
          onClick={onToggleVisibility}
          className={`text-xs ${skill.is_visible ? "text-success" : "text-muted"}`}
        >
          {skill.is_visible ? "Visible" : "Hidden"}
        </button>
      </div>
      <Input
        value={items}
        onChange={(e) => setItems(e.target.value)}
        placeholder="Comma-separated skills"
      />
      <Button onClick={() => onSave(items)} disabled={saving} size="sm" className="mt-2">
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
