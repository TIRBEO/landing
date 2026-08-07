import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_BADGE_CLASS,
  AGENT_ROLE,
  displayName,
  initials,
} from "@/lib/tickets";
import { Loader2, Shield, Users } from "lucide-react";
import { useState } from "react";

function RoleBadge({ role }: { role?: string }) {
  const map: Record<string, { label: string; className: string }> = {
    admin: { label: "Agent", className: "bg-foreground text-background" },
    user: { label: "Customer", className: "bg-nb-blue text-foreground" },
    member: { label: "Member", className: "bg-nb-purple text-foreground" },
  };
  const r = map[role ?? ""] ?? {
    label: "New",
    className: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center rounded-none border-2 border-foreground px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide whitespace-nowrap ${r.className}`}
    >
      {r.label}
    </span>
  );
}

export function CustomersView() {
  const users = useQuery(api.users.listUsers);
  const setRole = useMutation(api.users.setRole);
  const [busyId, setBusyId] = useState<string | null>(null);

  const changeRole = async (userId: string, role: "admin" | "user") => {
    setBusyId(userId);
    try {
      await setRole({ userId: userId as never, role });
      toast.success(
        role === AGENT_ROLE ? "User promoted to agent" : "User demoted to customer",
      );
    } catch (err) {
      toast.error("Could not change role", {
        description:
          err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  };

  if (users === undefined) {
    return (
      <div className="flex items-center justify-center gap-2 border-2 border-foreground bg-card p-10 shadow-brutal-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading users…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Agent console
        </p>
        <h1 className="mt-1 text-3xl font-black uppercase tracking-tight sm:text-4xl">
          Customers
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everyone with an account, their ticket activity, and role.
        </p>
      </div>

      <div className="overflow-hidden border-2 border-foreground bg-card shadow-brutal">
        {/* header */}
        <div className="grid grid-cols-[1fr_auto] items-center gap-2 border-b-2 border-foreground bg-foreground px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-background sm:grid-cols-[1fr_130px_90px_80px_70px_150px]">
          <span>User</span>
          <span className="hidden sm:block">Role</span>
          <span className="hidden text-center sm:block">Total</span>
          <span className="hidden text-center sm:block">Open</span>
          <span className="hidden text-center sm:block">Done</span>
          <span className="hidden text-right sm:block">Manage</span>
        </div>

        {users.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <Users className="size-8" />
            <p className="font-black uppercase">No users yet</p>
            <p className="text-sm text-muted-foreground">
              Once customers sign up they will appear here.
            </p>
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className="grid grid-cols-[1fr_auto] items-center gap-2 border-b-2 border-foreground px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_130px_90px_80px_70px_150px]"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar className="size-9 shrink-0">
                  <AvatarFallback>{initials(u)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-bold">
                    {displayName(u)}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {u.email ?? "—"}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block">
                <RoleBadge role={u.role} />
              </div>
              <span className="hidden text-center text-sm font-bold sm:block">
                {u.ticketStats?.total ?? 0}
              </span>
              <span className="hidden text-center text-sm font-bold sm:block">
                {u.ticketStats?.open ?? 0}
              </span>
              <span className="hidden text-center text-sm font-bold sm:block">
                {u.ticketStats?.resolved ?? 0}
              </span>
              <div className="hidden justify-end sm:flex">
                {u.role === AGENT_ROLE ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyId === u._id}
                    onClick={() => changeRole(u._id, "user")}
                  >
                    {busyId === u._id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Shield className="size-3.5" />
                    )}
                    Make customer
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={busyId === u._id}
                    onClick={() => changeRole(u._id, "admin")}
                  >
                    {busyId === u._id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Shield className="size-3.5" />
                    )}
                    Make agent
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
