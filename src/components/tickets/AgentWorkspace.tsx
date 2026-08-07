import { useState } from "react";
import type { Doc } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AgentOverview } from "./AgentOverview";
import { AgentQueue } from "./AgentQueue";
import { CustomersView } from "./CustomersView";
import { displayName, initials } from "@/lib/tickets";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Ticket as TicketIcon,
  Users,
} from "lucide-react";
import { Link } from "react-router";

type Tab = "overview" | "queue" | "customers";

const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { id: "queue", label: "Queue", icon: <Inbox className="size-4" /> },
  { id: "customers", label: "Customers", icon: <Users className="size-4" /> },
];

function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center border-2 border-foreground bg-foreground text-background shadow-brutal-sm">
        <TicketIcon className="size-5" />
      </span>
      <span className="text-lg font-black uppercase tracking-tight">Tirbeo</span>
    </span>
  );
}

function ViewSiteLink({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "flex items-center justify-center gap-2 border-2 border-foreground bg-background px-3 py-2 text-xs font-bold uppercase tracking-wide shadow-brutal-sm transition-all duration-100 hover:-translate-y-[1px] hover:shadow-brutal",
        className,
      )}
    >
      <ExternalLink className="size-3.5" />
      tirbeo.app
    </Link>
  );
}

interface AgentWorkspaceProps {
  user: Doc<"users">;
  onSignOut: () => void;
}

export function AgentWorkspace({
  user,
  onSignOut,
}: AgentWorkspaceProps) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r-2 border-foreground bg-card lg:flex">
          <div className="flex items-center border-b-2 border-foreground p-4">
            <Brand />
          </div>
          <nav className="flex flex-col gap-2 p-3">
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setTab(n.id)}
                className={cn(
                  "flex items-center gap-2.5 border-2 border-foreground px-3 py-2.5 text-sm font-bold uppercase tracking-wide transition-all duration-100",
                  tab === n.id
                    ? "bg-foreground text-background shadow-brutal"
                    : "bg-background shadow-brutal-sm hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                )}
              >
                {n.icon}
                {n.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto border-t-2 border-foreground p-3">
            <div className="flex items-center gap-2.5 border-2 border-foreground bg-background p-2.5 shadow-brutal-sm">
              <Avatar className="size-9">
                <AvatarFallback>{initials(user)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-xs font-bold uppercase tracking-wide">
                  {displayName(user)}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <ViewSiteLink className="mt-2 w-full" />
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={onSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="sticky top-0 z-40 flex items-center justify-between border-b-2 border-foreground bg-background px-4 py-3 lg:hidden">
            <Brand />
            <div className="flex items-center gap-2">
              <ViewSiteLink />
              <Button variant="outline" size="sm" onClick={onSignOut}>
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          </div>

          {/* Mobile nav */}
          <div className="border-b-2 border-foreground bg-card p-2 lg:hidden">
            <div className="grid grid-cols-3 gap-2">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setTab(n.id)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 border-2 border-foreground px-2 py-2 text-xs font-bold uppercase tracking-wide",
                    tab === n.id
                      ? "bg-foreground text-background"
                      : "bg-background shadow-brutal-sm",
                  )}
                >
                  {n.icon}
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          <main className="mx-auto w-full max-w-6xl p-4 py-6 sm:p-6">
            {tab === "overview" && <AgentOverview />}
            {tab === "queue" && <AgentQueue />}
            {tab === "customers" && <CustomersView />}
          </main>
        </div>
      </div>
    </div>
  );
}
