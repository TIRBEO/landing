import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityFeed } from "./ActivityFeed";
import { ReplyBox } from "./ReplyBox";
import { TicketBadge } from "./TicketBadge";
import { TicketThread } from "./TicketThread";
import {
  CATEGORY_BADGE_CLASS,
  CATEGORY_LABELS,
  PRIORITY_BADGE_CLASS,
  PRIORITY_LABELS,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
  formatDate,
  formatRelative,
  ticketNumber,
} from "@/lib/tickets";
import { ArrowLeft, Loader2, Star } from "lucide-react";
import { useState } from "react";

function RatingStars({ ticketId }: { ticketId: Id<"tickets"> }) {
  const setSatisfaction = useMutation(api.tickets.setSatisfaction);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const rate = async (n: number) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await setSatisfaction({ ticketId, rating: n });
      toast.success("Thanks for your feedback!", {
        description: `You rated this resolution ${n}/5.`,
      });
    } catch (err) {
      toast.error("Could not save rating", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-sm font-bold uppercase tracking-wide">
        How did we do?
      </p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={submitting}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => rate(n)}
            className="border-2 border-foreground bg-background p-1 shadow-brutal-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            aria-label={`Rate ${n} out of 5`}
          >
            <Star
              className={`size-5 ${n <= hover || submitting ? "fill-nb-yellow text-foreground" : "text-foreground"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

interface CustomerTicketDetailProps {
  ticketId: Id<"tickets">;
  onBack: () => void;
}

export function CustomerTicketDetail({
  ticketId,
  onBack,
}: CustomerTicketDetailProps) {
  const data = useQuery(api.tickets.get, { ticketId });
  const [showActivity, setShowActivity] = useState(false);

  if (data === undefined) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border-2 border-foreground bg-card p-6 text-center shadow-brutal-sm">
        <p className="font-bold">Ticket not found.</p>
        <Button variant="outline" className="mt-3" onClick={onBack}>
          <ArrowLeft className="size-4" /> Back to my tickets
        </Button>
      </div>
    );
  }

  const { ticket, messages, activity, people } = data;
  const closed = ticket.status === "closed";
  const rateable =
    (ticket.status === "resolved" || ticket.status === "closed") &&
    ticket.satisfaction === undefined;

  return (
    <div className="flex flex-col gap-5">
      <Button variant="outline" size="sm" className="w-fit" onClick={onBack}>
        <ArrowLeft className="size-4" /> All tickets
      </Button>

      <Card className="gap-4">
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {ticketNumber(ticket.number)}
            </span>
            <TicketBadge
              label={STATUS_LABELS[ticket.status]}
              className={STATUS_BADGE_CLASS[ticket.status]}
            />
            <TicketBadge
              label={PRIORITY_LABELS[ticket.priority]}
              className={PRIORITY_BADGE_CLASS[ticket.priority]}
            />
            <TicketBadge
              label={CATEGORY_LABELS[ticket.category]}
              className={CATEGORY_BADGE_CLASS[ticket.category]}
            />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">
            {ticket.subject}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Opened {formatDate(ticket.createdAt)} · Last activity{" "}
            {formatRelative(ticket.updatedAt)}
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {messages.length > 0 ? (
            <TicketThread messages={messages} isAgent={false} people={people} />
          ) : (
            <div className="border-2 border-dashed border-foreground/40 p-4">
              <p className="text-sm font-medium">{ticket.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Submitted {formatRelative(ticket.createdAt)} — an agent will
                pick this up soon.
              </p>
            </div>
          )}

          {rateable && <RatingStars ticketId={ticketId} />}

          {ticket.satisfaction !== undefined && (
            <div className="flex items-center gap-2 border-2 border-foreground bg-nb-green/70 p-3 text-sm font-bold">
              <Star className="size-4 fill-foreground" />
              You rated this resolution {ticket.satisfaction}/5 — thanks!
            </div>
          )}

          {!closed && (
            <ReplyBox ticketId={ticketId} isAgent={false} />
          )}
          {closed && (
            <div className="border-2 border-foreground bg-muted p-3 text-sm text-muted-foreground">
              This ticket is closed. No new replies can be sent.
            </div>
          )}

          <div className="border-t-2 border-foreground pt-4">
            <button
              type="button"
              onClick={() => setShowActivity((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              {showActivity ? "Hide" : "Show"} activity
              <Loader2
                className={`size-3 transition-transform ${showActivity ? "rotate-180" : ""}`}
              />
            </button>
            {showActivity && (
              <div className="mt-4">
                <ActivityFeed activity={activity} people={people} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
