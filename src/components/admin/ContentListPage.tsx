"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useState } from "react";

export interface ContentItem {
  id: string;
  sort_order: number;
  is_visible: boolean;
}

interface ContentListPageProps {
  title: string;
  items: ContentItem[];
  tableName: string;
  newHref: string;
  editHref: (id: string) => string;
  renderItem: (item: ContentItem) => React.ReactNode;
}

/** Reusable admin list page with visibility toggle and reorder support. */
export function ContentListPage({
  title,
  items,
  tableName,
  newHref,
  editHref,
  renderItem,
}: ContentListPageProps) {
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function toggleVisibility(id: string, currentlyVisible: boolean) {
    setToggling(id);
    const res = await fetch(`/api/content/${tableName}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_visible: !currentlyVisible }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      setToast({ message: "Failed to update", type: "error" });
    }
    setToggling(null);
  }

  async function moveItem(id: string, direction: "up" | "down") {
    const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((i) => i.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;

    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const reordered = sorted.map((item, i) => ({
      id: item.id,
      sort_order: i === idx ? sorted[swapIdx].sort_order : i === swapIdx ? sorted[idx].sort_order : item.sort_order,
    }));

    await fetch("/api/content/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: tableName, items: reordered }),
    });

    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <Link href={newHref}>
          <Button>Add New</Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-muted">No items yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 rounded-xl border p-4 ${
                item.is_visible ? "border-card-border bg-card-bg" : "border-card-border/50 bg-card-bg/30 opacity-60"
              }`}
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveItem(item.id, "up")}
                  disabled={idx === 0}
                  className="text-xs text-muted hover:text-foreground disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveItem(item.id, "down")}
                  disabled={idx === items.length - 1}
                  className="text-xs text-muted hover:text-foreground disabled:opacity-30"
                >
                  ▼
                </button>
              </div>

              <div className="flex-1">{renderItem(item)}</div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVisibility(item.id, item.is_visible)}
                  disabled={toggling === item.id}
                  className={`rounded-md px-2 py-1 text-xs ${
                    item.is_visible ? "text-success" : "text-muted"
                  }`}
                >
                  {item.is_visible ? "Visible" : "Hidden"}
                </button>
                <Link href={editHref(item.id)} className="text-sm text-accent hover:underline">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
