import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityFeed } from "./ActivityFeed";
import { ReplyBox } from "./ReplyBox";
import { TicketBadge } from "./TicketBadge";
import { TicketThread } from "./TicketThread";
import { TriagePanel } from "./TriagePanel";
import {
  CATEGORY_BADGE_CLASS,
  CATEGORY_LABELS,
  PRIORITY_BADGE_CLASS,
  PRIORITY_LABELS,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
  displayName,
  formatDate,
  formatRelative,
  initials,
  ticketNumber,
} from "@/lib/tickets";
import { ArrowLeft, Mail, Star, User } from "lucide-react";

interface AgentTicketDetailProps {
  ticketId: Id<"tickets">;
  onBack?: () => void;
}

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}

export function AgentTicketDetail({
  ticketId,
  onBack,
}: AgentTicketDetailProps) {
  const data = useQuery(api.tickets.get, { ticketId });
  const agents = useQuery(api.users.listAgents);

  if (data === undefined || agents === undefined) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-40" />
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <Skeleton className="h-64" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border-2 border-foreground bg-card p-6 text-center shadow-brutal-sm">
        <p className="font-bold">Ticket not found.</p>
        {onBack && (
          <Button variant="outline" className="mt-3" onClick={onBack}>
            <ArrowLeft className="size-4" /> Back to queue
          </Button>
        )}
      </div>
    );
  }

  const { ticket, messages, activity, people, customer, assignee } = data;
  const closed = ticket.status === "closed";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="outline" size="icon-sm" onClick={onBack}>
              <ArrowLeft className="size-4" />
            </Button>
          )}
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
        <span className="text-xs text-muted-foreground">
          Updated {formatRelative(ticket.updatedAt)}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        {/* Triage + customer */}
        <div className="flex flex-col gap-4">
          <TriagePanel ticket={ticket} agents={agents} />

          <div className="border-2 border-foreground bg-card p-4 shadow-brutal-sm">
            <p className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide">
              <User className="size-4" /> Customer
            </p>
            <div className="flex items-center gap-2.5">
              <Avatar className="size-10">
                <AvatarFallback>{initials(customer)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 leading-tight">
                <p className="truncate font-bold">{displayName(customer)}</p>
                <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <Mail className="size-3 shrink-0" />
                  {customer?.email ?? "no email"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <MetaRow
                label="Assignee"
                value={assignee ? displayName(assignee) : "Unassigned"}
              />
              <MetaRow label="Opened" value={formatDate(ticket.createdAt)} />
              {ticket.firstResponseAt && (
                <MetaRow
                  label="First response"
                  value={formatRelative(ticket.firstResponseAt)}
                />
              )}
              {ticket.resolvedAt && (
                <MetaRow
                  label="Resolved"
                  value={formatDate(ticket.resolvedAt)}
                />
              )}
              {ticket.satisfaction !== undefined && (
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Satisfaction
                  </span>
                  <span className="flex items-center gap-1 font-bold">
                    <Star className="size-3.5 fill-nb-yellow text-foreground" />
                    {ticket.satisfaction}/5
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conversation */}
        <Card className="gap-4">
          <CardHeader className="gap-2">
            <CardTitle className="text-xl font-black tracking-tight">
              {ticket.subject}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Opened {formatDate(ticket.createdAt)}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {messages.length === 0 && (
              <div className="border-2 border-dashed border-foreground/40 p-4">
                <p className="text-sm font-medium">{ticket.description}</p>
              </div>
            )}
            <TicketThread
              messages={messages}
              isAgent={true}
              people={people}
            />

            <div className="border-t-2 border-foreground pt-4">
              <p className="mb-3 text-sm font-black uppercase tracking-wide">
                Activity
              </p>
              <ActivityFeed activity={activity} people={people} />
            </div>

            {closed ? (
              <div className="border-2 border-foreground bg-muted p-3 text-sm text-muted-foreground">
                This ticket is closed. Reopen it from the triage panel to
                continue the conversation.
              </div>
            ) : (
              <ReplyBox ticketId={ticketId} isAgent={true} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
