import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AgentTicketDetail } from "./AgentTicketDetail";
import { TicketBadge } from "./TicketBadge";
import {
  CATEGORY_BADGE_CLASS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  PRIORITY_BADGE_CLASS,
  PRIORITY_LABELS,
  PRIORITY_ORDER,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
  STATUS_ORDER,
  displayName,
  formatRelative,
  ticketNumber,
} from "@/lib/tickets";
import {
  Filter,
  Inbox,
  Loader2,
  Search,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { useState } from "react";

const ALL = "all";

function QueueRow({
  ticket,
  agents,
  selected,
  onSelect,
}: {
  ticket: Doc<"tickets">;
  agents: Doc<"users">[];
  selected: boolean;
  onSelect: () => void;
}) {
  const assignee = agents.find((a) => a._id === ticket.assigneeId);
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full flex-col gap-1.5 border-2 border-foreground p-3 text-left transition-all duration-100 ${
        selected
          ? "bg-foreground text-background shadow-brutal"
          : "bg-card shadow-brutal-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[11px] font-bold uppercase tracking-widest ${
            selected ? "text-background/70" : "text-muted-foreground"
          }`}
        >
          {ticketNumber(ticket.number)}
        </span>
        <TicketBadge
          label={PRIORITY_LABELS[ticket.priority]}
          className={
            selected
              ? "bg-nb-yellow text-foreground"
              : PRIORITY_BADGE_CLASS[ticket.priority]
          }
        />
      </div>
      <p className="truncate text-sm font-bold">{ticket.subject}</p>
      <p className={`line-clamp-1 text-xs ${selected ? "text-background/70" : "text-muted-foreground"}`}>
        {ticket.description}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <TicketBadge
            label={STATUS_LABELS[ticket.status]}
            className={selected ? "bg-background text-foreground" : STATUS_BADGE_CLASS[ticket.status]}
          />
          {assignee && (
            <span
              className={`flex min-w-0 items-center gap-1 text-[11px] font-bold uppercase tracking-wide ${
                selected ? "text-background/70" : "text-muted-foreground"
              }`}
            >
              <User className="size-3 shrink-0" />
              <span className="truncate">{displayName(assignee)}</span>
            </span>
          )}
        </div>
        <span className={`shrink-0 text-[11px] ${selected ? "text-background/70" : "text-muted-foreground"}`}>
          {formatRelative(ticket.updatedAt)}
        </span>
      </div>
    </button>
  );
}

export function AgentQueue() {
  const agents = useQuery(api.users.listAgents);
  const [status, setStatus] = useState(ALL);
  const [priority, setPriority] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [assignee, setAssignee] = useState(ALL);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<Id<"tickets"> | null>(null);

  const tickets = useQuery(api.tickets.listAll, {
    status: status === ALL ? undefined : (status as "open"),
    priority: priority === ALL ? undefined : (priority as "low"),
    category: category === ALL ? undefined : (category as "billing"),
    assignee: assignee === ALL ? undefined : (assignee as string),
    search: search.trim() || undefined,
  });

  const hasFilters =
    status !== ALL ||
    priority !== ALL ||
    category !== ALL ||
    assignee !== ALL ||
    search.trim() !== "";

  const clearFilters = () => {
    setStatus(ALL);
    setPriority(ALL);
    setCategory(ALL);
    setAssignee(ALL);
    setSearch("");
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Agent console
        </p>
        <h1 className="mt-1 text-3xl font-black uppercase tracking-tight sm:text-4xl">
          Queue
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 border-2 border-foreground bg-card p-3 shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center border-2 border-foreground bg-nb-blue">
            <SlidersHorizontal className="size-4" />
          </span>
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subject, description or TKT number…"
              className="pl-8"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              {STATUS_ORDER.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All priorities</SelectItem>
              {PRIORITY_ORDER.map((p) => (
                <SelectItem key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {CATEGORY_ORDER.map((c) => (
                <SelectItem key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={assignee} onValueChange={setAssignee}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Everyone</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              <SelectItem value="me">Assigned to me</SelectItem>
              {agents?.map((a) => (
                <SelectItem key={a._id} value={a._id}>
                  {displayName(a)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="w-fit"
            onClick={clearFilters}
          >
            <Filter className="size-3.5" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(320px,400px)_1fr]">
        {/* List */}
        <div className={`flex flex-col gap-3 ${selectedId ? "hidden lg:flex" : ""}`}>
          {tickets === undefined ? (
            <div className="flex items-center justify-center gap-2 border-2 border-foreground bg-card p-8 shadow-brutal-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading queue…
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center gap-2 border-2 border-dashed border-foreground/50 bg-card p-8 text-center shadow-brutal-sm">
              <Inbox className="size-8" />
              <p className="font-black uppercase">No tickets match</p>
              <p className="text-sm text-muted-foreground">
                Adjust your filters to see more tickets.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {tickets.length} ticket{tickets.length === 1 ? "" : "s"}
              </p>
              {tickets.map((t) => (
                <QueueRow
                  key={t._id}
                  ticket={t}
                  agents={agents ?? []}
                  selected={selectedId === t._id}
                  onSelect={() => setSelectedId(t._id)}
                />
              ))}
            </>
          )}
        </div>

        {/* Detail */}
        <div className={selectedId ? "" : "hidden lg:block"}>
          {selectedId ? (
            <AgentTicketDetail
              ticketId={selectedId}
              onBack={() => setSelectedId(null)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-foreground/50 bg-card p-12 text-center shadow-brutal-sm">
              <SlidersHorizontal className="size-10" />
              <p className="text-lg font-black uppercase tracking-tight">
                Select a ticket
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Pick a ticket from the queue to triage it, reply to the
                customer, and leave internal notes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
