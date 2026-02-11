"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

export default function NewLinkPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [metaFields, setMetaFields] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function addField() {
    setMetaFields([...metaFields, { key: "", value: "" }]);
  }

  function removeField(index: number) {
    setMetaFields(metaFields.filter((_, i) => i !== index));
  }

  function updateField(index: number, field: "key" | "value", val: string) {
    const updated = [...metaFields];
    updated[index][field] = val;
    setMetaFields(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const metadata: Record<string, string> = {};
    metaFields.forEach(({ key, value }) => {
      if (key.trim()) metadata[key.trim()] = value.trim();
    });

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim() || undefined,
          metadata,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error, type: "error" });
        return;
      }

      setToast({ message: `Link created: /l/${data.slug}`, type: "success" });
      setTimeout(() => router.push("/admin/links"), 1500);
    } catch {
      setToast({ message: "Network error", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Create Trackable Link</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Custom Slug (optional)"
          placeholder="e.g. john-google"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-muted">Metadata</label>
            <button
              type="button"
              onClick={addField}
              className="text-sm text-accent hover:underline"
            >
              + Add Field
            </button>
          </div>
          <div className="space-y-2">
            {metaFields.map((field, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Key (e.g. name)"
                  value={field.key}
                  onChange={(e) => updateField(i, "key", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value (e.g. John)"
                  value={field.value}
                  onChange={(e) => updateField(i, "value", e.target.value)}
                  className="flex-1"
                />
                {metaFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField(i)}
                    className="px-2 text-muted hover:text-error"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Creating..." : "Create Link"}
        </Button>
      </form>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
