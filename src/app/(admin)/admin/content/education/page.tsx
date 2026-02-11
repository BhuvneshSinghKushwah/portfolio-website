"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import type { Education } from "@/types/database";

/** Education management page with inline editing and add form. */
export default function EducationPage() {
  const router = useRouter();
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({
    institution: "",
    degree: "",
    location: "",
    grade: "",
    year: "",
    sort_order: 0,
    is_visible: true,
  });

  useEffect(() => {
    fetch("/api/content/education")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setItems(data); })
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    setSaving("new");
    const res = await fetch("/api/content/education", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newForm, sort_order: items.length }),
    });
    setSaving(null);

    if (res.ok) {
      const created = await res.json();
      setItems([...items, created]);
      setShowNew(false);
      setNewForm({ institution: "", degree: "", location: "", grade: "", year: "", sort_order: 0, is_visible: true });
      setToast({ message: "Added!", type: "success" });
    } else {
      setToast({ message: "Failed", type: "error" });
    }
  }

  async function toggleVisibility(edu: Education) {
    const res = await fetch(`/api/content/education/${edu.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_visible: !edu.is_visible }),
    });

    if (res.ok) {
      const updated = await res.json();
      setItems(items.map((i) => (i.id === edu.id ? updated : i)));
    }
  }

  if (loading) return <p className="text-muted">Loading education...</p>;

  return (
    <div className="max-w-xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Education</h1>
        <Button onClick={() => setShowNew(!showNew)}>
          {showNew ? "Cancel" : "Add New"}
        </Button>
      </div>

      {showNew && (
        <div className="mb-6 rounded-xl border border-dashed border-card-border bg-card-bg p-5 space-y-3">
          <Input label="Degree" value={newForm.degree} onChange={(e) => setNewForm({ ...newForm, degree: e.target.value })} required />
          <Input label="Institution" value={newForm.institution} onChange={(e) => setNewForm({ ...newForm, institution: e.target.value })} required />
          <Input label="Location" value={newForm.location} onChange={(e) => setNewForm({ ...newForm, location: e.target.value })} />
          <Input label="Grade" placeholder="e.g. 8.7 CGPA" value={newForm.grade} onChange={(e) => setNewForm({ ...newForm, grade: e.target.value })} />
          <Input label="Year" placeholder="e.g. Jul 2024" value={newForm.year} onChange={(e) => setNewForm({ ...newForm, year: e.target.value })} />
          <Button onClick={handleAdd} disabled={saving === "new"}>
            {saving === "new" ? "Adding..." : "Add Education"}
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {items.map((edu) => (
          <div
            key={edu.id}
            className={`rounded-xl border p-4 ${
              edu.is_visible ? "border-card-border bg-card-bg" : "border-card-border/50 bg-card-bg/30 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-foreground">{edu.degree}</p>
                <p className="text-sm text-muted">{edu.institution}</p>
                <p className="text-sm text-muted/60">{edu.location} · {edu.year}</p>
                {edu.grade && <p className="text-sm text-accent">{edu.grade}</p>}
              </div>
              <button
                onClick={() => toggleVisibility(edu)}
                className={`text-xs ${edu.is_visible ? "text-success" : "text-muted"}`}
              >
                {edu.is_visible ? "Visible" : "Hidden"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
