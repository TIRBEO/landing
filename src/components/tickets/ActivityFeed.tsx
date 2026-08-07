import type { Doc } from "@/convex/_generated/dataModel";
import { activityLabel, displayName, formatRelative } from "@/lib/tickets";

interface ActivityFeedProps {
  activity: Doc<"ticketActivity">[];
  people?: Record<string, Doc<"users"> | null>;
}

export function ActivityFeed({ activity, people }: ActivityFeedProps) {
  if (activity.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity yet.</p>;
  }
  return (
    <ol className="relative flex flex-col gap-4 border-l-2 border-foreground pl-4">
      {[...activity]
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((a) => {
          const actor = people?.[a.actorId] ?? null;
          const label = activityLabel(
            a.action,
            a.detail,
            displayName(actor ?? null),
          );
          return (
            <li key={a._id} className="relative">
              <span className="absolute top-1.5 -left-[21px] size-3 rounded-none border-2 border-foreground bg-nb-yellow" />
              <p className="text-sm leading-snug font-medium">{label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatRelative(a.createdAt)}
              </p>
            </li>
          );
        })}
    </ol>
  );
}
