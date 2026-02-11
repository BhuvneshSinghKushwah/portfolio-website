"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";

/** Client-side contact form with honeypot spam protection and rate-limit-aware error handling. */
export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "", honeypot: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setToast({ message: data.error || "Something went wrong", type: "error" });
        }
        return;
      }

      setToast({ message: "Message sent! I'll get back to you soon.", type: "success" });
      setForm({ name: "", email: "", message: "", honeypot: "" });
    } catch {
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card colSpan={2} className="relative overflow-hidden">
      <h2 className="section-label mb-4">Get in Touch</h2>
      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Name"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            required
          />
        </div>
        <Textarea
          label="Message"
          placeholder="What would you like to say?"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          error={errors.message}
          required
        />
        <input
          type="text"
          name="honeypot"
          value={form.honeypot}
          onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <Button type="submit" disabled={loading} size="lg">
          {loading ? "[ SENDING... ]" : "[ SEND MESSAGE ]"}
        </Button>
      </form>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Card>
  );
}
