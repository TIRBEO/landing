import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CATEGORY_BADGE_CLASS,
  CATEGORY_LABELS,
  PRIORITY_BADGE_CLASS,
  PRIORITY_LABELS,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
} from "@/lib/tickets";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Clock, Gauge, Star, TrendingUp, UserX } from "lucide-react";

function KpiCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="border-2 border-foreground bg-card shadow-brutal-sm">
      <div className={`h-2 w-full border-b-2 border-foreground ${color}`} />
      <div className="flex items-start justify-between gap-2 p-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-3xl font-black leading-none">{value}</p>
          {sub && (
            <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
          )}
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center border-2 border-foreground bg-background">
          {icon}
        </span>
      </div>
    </div>
  );
}

function Breakdown({
  title,
  data,
  labels,
  colorClass,
  total,
}: {
  title: string;
  data: Record<string, number>;
  labels: Record<string, string>;
  colorClass: Record<string, string>;
  total: number;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    return (
      <div className="border-2 border-foreground bg-card p-4 shadow-brutal-sm">
        <p className="text-sm font-black uppercase tracking-wide">{title}</p>
        <p className="mt-2 text-sm text-muted-foreground">No data yet.</p>
      </div>
    );
  }
  return (
    <div className="border-2 border-foreground bg-card p-4 shadow-brutal-sm">
      <p className="mb-4 text-sm font-black uppercase tracking-wide">{title}</p>
      <div className="flex flex-col gap-3">
        {entries.map(([k, v]) => (
          <div key={k}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wide">
                {labels[k] ?? k}
              </span>
              <span className="font-bold">{v}</span>
            </div>
            <div className="h-3 w-full border-2 border-foreground bg-background">
              <div
                className={`h-full ${colorClass[k] ?? "bg-muted"}`}
                style={{ width: total > 0 ? `${Math.max((v / total) * 100, 4)}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AgentOverview() {
  const stats = useQuery(api.tickets.stats);

  if (stats === undefined) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Agent console
        </p>
        <h1 className="mt-1 text-3xl font-black uppercase tracking-tight sm:text-4xl">
          Overview
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          icon={<TrendingUp className="size-4" />}
          label="Open"
          value={String(stats.open)}
          color="bg-nb-blue"
        />
        <KpiCard
          icon={<TrendingUp className="size-4" />}
          label="In Progress"
          value={String(stats.inProgress)}
          color="bg-nb-yellow"
        />
        <KpiCard
          icon={<Clock className="size-4" />}
          label="Waiting"
          value={String(stats.waitingOnCustomer)}
          color="bg-nb-orange"
        />
        <KpiCard
          icon={<UserX className="size-4" />}
          label="Unassigned"
          value={String(stats.unassigned)}
          color="bg-nb-pink"
        />
        <KpiCard
          icon={<TrendingUp className="size-4" />}
          label="Resolved"
          value={String(stats.resolved)}
          color="bg-nb-green"
        />
        <KpiCard
          icon={<TrendingUp className="size-4" />}
          label="Closed"
          value={String(stats.closed)}
          color="bg-muted"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <KpiCard
          icon={<Gauge className="size-4" />}
          label="Avg first response"
          value={stats.avgFirstResponseHours === null ? "—" : `${stats.avgFirstResponseHours}h`}
          sub={`Across ${stats.total} tickets`}
          color="bg-nb-blue"
        />
        <KpiCard
          icon={<TrendingUp className="size-4" />}
          label="Resolution rate"
          value={`${stats.resolutionRate}%`}
          sub="Resolved + closed / total"
          color="bg-nb-green"
        />
        <KpiCard
          icon={<Star className="size-4" />}
          label="Avg satisfaction"
          value={stats.avgSatisfaction === null ? "—" : `${stats.avgSatisfaction} / 5`}
          sub={`${stats.satisfactionCount} ratings`}
          color="bg-nb-yellow"
        />
      </div>

      <div className="border-2 border-foreground bg-card p-4 shadow-brutal-sm">
        <p className="mb-4 text-sm font-black uppercase tracking-wide">
          Tickets created · last 14 days
        </p>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.days} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#17150f33" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#6b6557" }}
                tickLine={false}
                axisLine={{ stroke: "#17150f" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#6b6557" }}
                tickLine={false}
                axisLine={{ stroke: "#17150f" }}
              />
              <Tooltip
                cursor={{ fill: "#ffd93d33" }}
                contentStyle={{
                  border: "2px solid #17150f",
                  borderRadius: 0,
                  boxShadow: "4px 4px 0 0 #17150f",
                  fontFamily: "inherit",
                  fontSize: 12,
                }}
                labelStyle={{ fontWeight: 800, textTransform: "uppercase" }}
              />
              <Bar dataKey="count" name="Tickets" fill="#4d96ff" stroke="#17150f" strokeWidth={2} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Breakdown
          title="By priority"
          data={stats.byPriority}
          labels={PRIORITY_LABELS}
          colorClass={PRIORITY_BADGE_CLASS}
          total={stats.total}
        />
        <Breakdown
          title="By category"
          data={stats.byCategory}
          labels={CATEGORY_LABELS}
          colorClass={CATEGORY_BADGE_CLASS}
          total={stats.total}
        />
        <Breakdown
          title="By status"
          data={stats.byStatus}
          labels={STATUS_LABELS}
          colorClass={STATUS_BADGE_CLASS}
          total={stats.total}
        />
      </div>
    </div>
  );
}
