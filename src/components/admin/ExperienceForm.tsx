"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import type { Experience } from "@/types/database";

interface ExperienceFormProps {
  experience?: Experience;
}

/** Form for creating or editing an experience entry. Handles bullet-point descriptions as a dynamic list. */
export function ExperienceForm({ experience }: ExperienceFormProps) {
  const router = useRouter();
  const isEditing = !!experience;

  const [form, setForm] = useState({
    company: experience?.company ?? "",
    role: experience?.role ?? "",
    start_date: experience?.start_date ?? "",
    end_date: experience?.end_date ?? "",
    description: experience?.description ?? [""],
    sort_order: experience?.sort_order ?? 0,
    is_visible: experience?.is_visible ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function updateDescription(index: number, value: string) {
    const updated = [...form.description];
    updated[index] = value;
    setForm({ ...form, description: updated });
  }

  function addDescription() {
    setForm({ ...form, description: [...form.description, ""] });
  }

  function removeDescription(index: number) {
    setForm({ ...form, description: form.description.filter((_, i) => i !== index) });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const url = isEditing
      ? `/api/content/experiences/${experience.id}`
      : "/api/content/experiences";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          description: form.description.filter((d) => d.trim()),
        }),
      });

      if (!res.ok) {
        setToast({ message: "Failed to save", type: "error" });
        return;
      }

      setToast({ message: isEditing ? "Updated!" : "Created!", type: "success" });
      setTimeout(() => router.push("/admin/content/experiences"), 1000);
    } catch {
      setToast({ message: "Network error", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        {isEditing ? "Edit Experience" : "Add Experience"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
        <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Start Date" placeholder="e.g. Jan 2023" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
          <Input label="End Date" placeholder="e.g. Present" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
        </div>
        <Input label="Sort Order" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-muted">Description (bullet points)</label>
            <button type="button" onClick={addDescription} className="text-sm text-accent hover:underline">
              + Add Point
            </button>
          </div>
          <div className="space-y-2">
            {form.description.map((desc, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Description point"
                  value={desc}
                  onChange={(e) => updateDescription(i, e.target.value)}
                  className="flex-1"
                />
                {form.description.length > 1 && (
                  <button type="button" onClick={() => removeDescription(i)} className="px-2 text-muted hover:text-error">
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.is_visible}
            onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
            className="rounded"
          />
          Visible on portfolio
        </label>

        <Button type="submit" disabled={saving} size="lg">
          {saving ? "Saving..." : isEditing ? "Update Experience" : "Create Experience"}
        </Button>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
