import Link from "next/link";

const sections = [
  { href: "/admin/content/profile", label: "Personal Info", description: "Name, title, bio, social links" },
  { href: "/admin/content/experiences", label: "Experiences", description: "Work history and roles" },
  { href: "/admin/content/projects", label: "Projects", description: "Portfolio projects" },
  { href: "/admin/content/skills", label: "Skills", description: "Technical skill categories" },
  { href: "/admin/content/education", label: "Education", description: "Education history" },
];

export default function ContentOverviewPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Content Management</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-xl border border-card-border bg-card-bg p-6 transition-colors hover:border-accent/50"
          >
            <h2 className="text-lg font-medium text-foreground">{section.label}</h2>
            <p className="mt-1 text-sm text-muted">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
