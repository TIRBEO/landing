import type { Doc } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  displayName,
  formatRelative,
  initials,
} from "@/lib/tickets";
import { cn } from "@/lib/utils";
import { StickyNote } from "lucide-react";

interface TicketThreadProps {
  messages: Doc<"ticketMessages">[];
  isAgent: boolean;
  people?: Record<string, Doc<"users"> | null>;
}

export function TicketThread({
  messages,
  isAgent,
  people,
}: TicketThreadProps) {
  const visible = isAgent
    ? messages
    : messages.filter((m) => !m.isInternal);

  if (visible.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No messages yet. Hit send to start the conversation.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {visible.map((m) => {
        const sender = people?.[m.senderId] ?? null;
        const name = displayName(sender ?? null);
        const isAgentMsg = m.senderRole === "agent";

        if (m.isInternal) {
          return (
            <div
              key={m._id}
              className="border-2 border-foreground bg-nb-yellow p-3 shadow-brutal-sm"
            >
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest">
                <StickyNote className="size-3.5" />
                Internal note · {name}
              </div>
              <p className="text-sm whitespace-pre-wrap">{m.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatRelative(m.createdAt)}
              </p>
            </div>
          );
        }

        return (
          <div
            key={m._id}
            className={cn(
              "flex max-w-[85%] flex-col gap-1.5",
              isAgentMsg ? "items-end self-end" : "items-start self-start",
            )}
          >
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Avatar className="size-5 border">
                <AvatarFallback className="text-[9px]">
                  {initials(sender ?? null)}
                </AvatarFallback>
              </Avatar>
              <span className="font-bold uppercase tracking-wide">
                {isAgentMsg ? `${name} (Support)` : name}
              </span>
              <span>· {formatRelative(m.createdAt)}</span>
            </div>
            <div
              className={cn(
                "border-2 border-foreground px-3 py-2 text-sm whitespace-pre-wrap",
                isAgentMsg
                  ? "bg-foreground text-background"
                  : "bg-card shadow-brutal-sm",
              )}
            >
              {m.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
