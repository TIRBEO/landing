import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CustomerTicketDetail } from "./CustomerTicketDetail";
import { NewTicketDialog } from "./NewTicketDialog";
import { TicketBadge } from "./TicketBadge";
import {
  CATEGORY_BADGE_CLASS,
  CATEGORY_LABELS,
  PRIORITY_BADGE_CLASS,
  PRIORITY_LABELS,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
  displayName,
  formatRelative,
  initials,
  ticketNumber,
} from "@/lib/tickets";
import { Ticket as TicketIcon, Plus, LogOut, Inbox, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

function StatChip({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="border-2 border-foreground bg-card shadow-brutal-sm">
      <div className={`h-2 w-full border-b-2 border-foreground ${color}`} />
      <div className="p-3">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-3xl font-black leading-none">{value}</p>
      </div>
    </div>
  );
}

interface CustomerWorkspaceProps {
  user: Doc<"users">;
  onSignOut: () => void;
}

export function CustomerWorkspace({
  user,
  onSignOut,
}: CustomerWorkspaceProps) {
  const tickets = useQuery(api.tickets.listMine);
  const [selectedId, setSelectedId] = useState<Id<"tickets"> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const open = tickets?.filter((t) => t.status === "open").length ?? 0;
  const inProgress =
    tickets?.filter(
      (t) =>
        t.status === "in_progress" || t.status === "waiting_on_customer",
    ).length ?? 0;
  const resolved =
    tickets?.filter(
      (t) => t.status === "resolved" || t.status === "closed",
    ).length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b-2 border-foreground bg-background">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="flex items-center gap-2.5"
          >
            <span className="flex size-9 items-center justify-center border-2 border-foreground bg-foreground text-background shadow-brutal-sm">
              <TicketIcon className="size-5" />
            </span>
            <span className="text-lg font-black uppercase tracking-tight">
              Tirbeo
            </span>
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 border-2 border-foreground bg-card px-2 py-1.5 shadow-brutal-sm sm:flex">
              <Avatar className="size-7">
                <AvatarFallback>{initials(user)}</AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <p className="text-xs font-bold uppercase tracking-wide">
                  {displayName(user)}
                </p>
                <p className="max-w-40 truncate text-[11px] text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="hidden items-center gap-1.5 border-2 border-foreground bg-card px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide shadow-brutal-sm transition-all duration-100 hover:-translate-y-[1px] hover:bg-background hover:shadow-brutal sm:flex"
            >
              <ExternalLink className="size-3.5" />
              tirbeo.app
            </Link>
            <Button variant="outline" size="sm" onClick={onSignOut}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        {selectedId ? (
          <CustomerTicketDetail
            ticketId={selectedId}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Customer portal
                </p>
                <h1 className="mt-1 text-3xl font-black uppercase tracking-tight sm:text-4xl">
                  My Tickets
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Track your requests and replies in one place.
                </p>
              </div>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="size-4" />
                New Ticket
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatChip label="Total" value={tickets?.length ?? 0} color="bg-nb-blue" />
              <StatChip label="Open" value={open} color="bg-nb-yellow" />
              <StatChip label="In Progress" value={inProgress} color="bg-nb-orange" />
              <StatChip label="Resolved" value={resolved} color="bg-nb-green" />
            </div>

            {tickets === undefined ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-36 animate-pulse border-2 border-foreground bg-muted shadow-brutal-sm"
                  />
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <Empty className="border-2 border-dashed border-foreground/50">
                <EmptyHeader>
                  <EmptyMedia variant="icon" className="bg-nb-yellow">
                    <Inbox className="size-6" />
                  </EmptyMedia>
                  <EmptyTitle className="text-xl font-black uppercase">
                    No tickets yet
                  </EmptyTitle>
                  <EmptyDescription>
                    Something broken? File your first ticket and we&apos;ll take
                    it from there.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="size-4" />
                    Create a ticket
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {tickets.map((t) => (
                  <button
                    key={t._id}
                    type="button"
                    onClick={() => setSelectedId(t._id)}
                    className="flex flex-col gap-2 border-2 border-foreground bg-card p-4 text-left shadow-brutal-sm transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {ticketNumber(t.number)}
                      </span>
                      <TicketBadge
                        label={STATUS_LABELS[t.status]}
                        className={STATUS_BADGE_CLASS[t.status]}
                      />
                    </div>
                    <p className="font-bold leading-snug">{t.subject}</p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {t.description}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="flex gap-1.5">
                        <TicketBadge
                          label={PRIORITY_LABELS[t.priority]}
                          className={PRIORITY_BADGE_CLASS[t.priority]}
                        />
                        <TicketBadge
                          label={CATEGORY_LABELS[t.category]}
                          className={CATEGORY_BADGE_CLASS[t.category]}
                        />
                      </div>
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatRelative(t.updatedAt)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <NewTicketDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
