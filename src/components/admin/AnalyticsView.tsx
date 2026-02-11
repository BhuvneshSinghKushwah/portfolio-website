"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { TrackableLink, LinkVisit } from "@/types/database";

interface AnalyticsViewProps {
  link: TrackableLink;
  visits: LinkVisit[];
}

const COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

/** Renders charts and a visit log table for a single trackable link. */
export function AnalyticsView({ link, visits }: AnalyticsViewProps) {
  const dailyVisits = getDailyVisits(visits);
  const countryData = getGroupedData(visits, "country");
  const deviceData = getGroupedData(visits, "device_type");
  const browserData = getGroupedData(visits, "browser");

  const metadata = link.metadata || {};

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Analytics: <code className="text-accent">/l/{link.slug}</code>
        </h1>
        {Object.keys(metadata).length > 0 && (
          <p className="mt-1 text-sm text-muted">
            {Object.entries(metadata).map(([k, v]) => `${k}: ${v}`).join(" | ")}
          </p>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBox label="Total Visits" value={visits.length} />
        <StatBox
          label="Unique Countries"
          value={new Set(visits.map((v) => v.country).filter(Boolean)).size}
        />
        <StatBox
          label="Avg Duration"
          value={(() => {
            const durations = visits
              .filter((v) => v.exited_at)
              .map((v) => (new Date(v.exited_at!).getTime() - new Date(v.visited_at).getTime()) / 1000);
            return durations.length ? `${Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)}s` : "—";
          })()}
        />
        <StatBox
          label="Last Visit"
          value={visits.length ? new Date(visits[0].visited_at).toLocaleDateString() : "—"}
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Visits Over Time">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyVisits}>
              <XAxis dataKey="date" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#141414", border: "1px solid #262626", borderRadius: "8px" }}
                labelStyle={{ color: "#ededed" }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="By Country">
          <PieChartWidget data={countryData} />
        </ChartCard>

        <ChartCard title="By Device">
          <PieChartWidget data={deviceData} />
        </ChartCard>

        <ChartCard title="By Browser">
          <PieChartWidget data={browserData} />
        </ChartCard>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-foreground">Visit Log</h2>
      <div className="overflow-x-auto rounded-xl border border-card-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-card-border bg-card-bg">
            <tr>
              <th className="px-4 py-3 font-medium text-muted">Time</th>
              <th className="px-4 py-3 font-medium text-muted">Country</th>
              <th className="px-4 py-3 font-medium text-muted">City</th>
              <th className="px-4 py-3 font-medium text-muted">Device</th>
              <th className="px-4 py-3 font-medium text-muted">Browser</th>
              <th className="px-4 py-3 font-medium text-muted">OS</th>
              <th className="px-4 py-3 font-medium text-muted">Duration</th>
              <th className="px-4 py-3 font-medium text-muted">Referrer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {visits.map((v) => (
              <tr key={v.id} className="hover:bg-card-bg/50">
                <td className="whitespace-nowrap px-4 py-3 text-foreground">
                  {new Date(v.visited_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-muted">{v.country || "—"}</td>
                <td className="px-4 py-3 text-muted">{v.city || "—"}</td>
                <td className="px-4 py-3 text-muted">{v.device_type || "—"}</td>
                <td className="px-4 py-3 text-muted">{v.browser || "—"}</td>
                <td className="px-4 py-3 text-muted">{v.os || "—"}</td>
                <td className="px-4 py-3 text-muted">
                  {v.exited_at
                    ? `${Math.round((new Date(v.exited_at).getTime() - new Date(v.visited_at).getTime()) / 1000)}s`
                    : "—"}
                </td>
                <td className="max-w-[150px] truncate px-4 py-3 text-muted">
                  {v.referrer || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-5">
      <h3 className="mb-4 text-sm font-medium text-muted">{title}</h3>
      {children}
    </div>
  );
}

function PieChartWidget({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-muted">No data</p>;
  }

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="50%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#141414", border: "1px solid #262626", borderRadius: "8px" }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-sm">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-muted">
              {d.name}: {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getDailyVisits(visits: LinkVisit[]) {
  const map: Record<string, number> = {};
  visits.forEach((v) => {
    const date = new Date(v.visited_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    map[date] = (map[date] || 0) + 1;
  });
  return Object.entries(map)
    .map(([date, count]) => ({ date, count }))
    .reverse();
}

function getGroupedData(visits: LinkVisit[], key: keyof LinkVisit) {
  const map: Record<string, number> = {};
  visits.forEach((v) => {
    const val = (v[key] as string) || "Unknown";
    map[val] = (map[val] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}
