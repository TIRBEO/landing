import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  PRIORITY_LABELS,
  PRIORITY_ORDER,
  STATUS_LABELS,
  STATUS_ORDER,
  displayName,
  type Category,
  type Priority,
  type Status,
} from "@/lib/tickets";
import { Loader2, Plus, RotateCcw, Tag, X } from "lucide-react";
import { useState } from "react";

interface TriagePanelProps {
  ticket: Doc<"tickets">;
  agents: Doc<"users">[];
}

type UpdateArgs = Parameters<
  ReturnType<typeof useMutation<typeof api.tickets.update>>
>[0];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

export function TriagePanel({ ticket, agents }: TriagePanelProps) {
  const update = useMutation(api.tickets.update);
  const [busy, setBusy] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const run = async (key: string, patch: Partial<UpdateArgs>) => {
    setBusy(key);
    try {
      await update({ ticketId: ticket._id, ...patch });
      toast.success("Ticket updated");
    } catch (err) {
      toast.error("Update failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusy(null);
    }
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t || ticket.tags.includes(t)) {
      setTagInput("");
      return;
    }
    run("tags", { tags: [...ticket.tags, t] });
    setTagInput("");
  };

  const removeTag = (t: string) => {
    run("tags", { tags: ticket.tags.filter((x) => x !== t) });
  };

  return (
    <div className="flex flex-col gap-4 border-2 border-foreground bg-card p-4 shadow-brutal-sm">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center border-2 border-foreground bg-nb-yellow">
          <Tag className="size-4" />
        </span>
        <p className="text-sm font-black uppercase tracking-wide">Triage</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Status">
          <Select
            value={ticket.status}
            onValueChange={(v) => run("status", { status: v as Status })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ORDER.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Priority">
          <Select
            value={ticket.priority}
            onValueChange={(v) => run("priority", { priority: v as Priority })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_ORDER.map((p) => (
                <SelectItem key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Category">
          <Select
            value={ticket.category}
            onValueChange={(v) => run("category", { category: v as Category })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_ORDER.map((c) => (
                <SelectItem key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Assignee">
          <Select
            value={ticket.assigneeId ?? "unassigned"}
            onValueChange={(v) =>
              run("assignee", {
                assigneeId:
                  v === "unassigned"
                    ? null
                    : (v as Id<"users">),
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {agents.map((a) => (
                <SelectItem key={a._id} value={a._id}>
                  {displayName(a)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {busy && (
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Saving…
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Tags
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {ticket.tags.length === 0 && (
            <span className="text-xs text-muted-foreground">
              No tags yet.
            </span>
          )}
          {ticket.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 border-2 border-foreground bg-nb-blue px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
            >
              #{t}
              <button
                type="button"
                onClick={() => removeTag(t)}
                className="text-foreground/70 hover:text-foreground"
                aria-label={`Remove tag ${t}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add tag (enter)"
            className="h-8"
          />
          <Button size="sm" variant="outline" onClick={addTag}>
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t-2 border-foreground pt-3">
        {ticket.status !== "resolved" && (
          <Button
            size="sm"
            onClick={() => run("resolve", { status: "resolved" })}
            disabled={busy !== null}
          >
            Mark Resolved
          </Button>
        )}
        {ticket.status !== "closed" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => run("close", { status: "closed" })}
            disabled={busy !== null}
          >
            Close Ticket
          </Button>
        )}
        {(ticket.status === "resolved" || ticket.status === "closed") && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => run("reopen", { status: "in_progress" })}
            disabled={busy !== null}
          >
            <RotateCcw className="size-4" />
            Reopen
          </Button>
        )}
      </div>
    </div>
  );
}
