import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2, Send, Sparkles, StickyNote } from "lucide-react";

interface ReplyBoxProps {
  ticketId: Id<"tickets">;
  isAgent: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export function ReplyBox({
  ticketId,
  isAgent,
  disabled,
  disabledReason,
}: ReplyBoxProps) {
  const reply = useMutation(api.tickets.reply);
  const draftReply = useAction(api.ai.draftReply);
  const [body, setBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [drafting, setDrafting] = useState(false);

  const send = async () => {
    if (!body.trim() || sending) return;
    setSending(true);
    try {
      await reply({ ticketId, body: body.trim(), isInternal });
      toast.success(isInternal ? "Internal note added" : "Reply sent", {
        description: isInternal
          ? "Only visible to your support team."
          : "The customer can now see your message.",
      });
      setBody("");
      setIsInternal(false);
    } catch (err) {
      toast.error("Could not send message", {
        description:
          err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  const draftWithAi = async () => {
    if (drafting || disabled) return;
    setDrafting(true);
    try {
      const { draft, source } = await draftReply({ ticketId });
      setIsInternal(false);
      setBody(draft);
      toast.success("AI draft ready", {
        description:
          source === "openai"
            ? "Generated from the ticket context — review and edit before sending."
            : "Smart draft ready (add an OPENAI_API_KEY for AI-written replies) — review and edit before sending.",
      });
    } catch (err) {
      toast.error("Could not draft reply", {
        description:
          err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setDrafting(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-2 border-foreground bg-card p-3 shadow-brutal-sm transition-colors",
        isInternal && "bg-nb-yellow",
      )}
    >
      {isInternal && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest">
          <StickyNote className="size-3.5" />
          Internal note — visible to your team only
        </div>
      )}
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            send();
          }
        }}
        placeholder={
          disabled
            ? disabledReason ?? "Messaging is disabled."
            : isInternal
              ? "Write a private note for your team…"
              : isAgent
                ? "Reply to the customer… (⌘/Ctrl + Enter to send)"
                : "Type your reply… (⌘/Ctrl + Enter to send)"
        }
        disabled={disabled || sending || drafting}
        className={cn(
          "min-h-20 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0",
          isInternal && "bg-transparent",
        )}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isAgent && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={draftWithAi}
              disabled={disabled || sending || drafting}
            >
              {drafting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4 text-nb-purple" />
              )}
              {drafting ? "Drafting…" : "Draft with AI"}
            </Button>
          )}
          {isAgent ? (
            <label className="flex cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-wide">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="size-4 cursor-pointer accent-foreground"
              />
              Internal note
            </label>
          ) : (
            <span className="text-xs text-muted-foreground">
              Visible to you and the support team
            </span>
          )}
        </div>
        <Button
          size="sm"
          onClick={send}
          disabled={disabled || sending || !body.trim()}
        >
          {sending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isInternal ? (
            <StickyNote className="size-4" />
          ) : (
            <Send className="size-4" />
          )}
          {sending ? "Sending…" : isInternal ? "Add Note" : "Send"}
        </Button>
      </div>
    </div>
  );
}
