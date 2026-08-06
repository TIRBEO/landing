import { AgentWorkspace } from "@/components/tickets/AgentWorkspace";
import { CustomerWorkspace } from "@/components/tickets/CustomerWorkspace";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { AGENT_ROLE } from "@/lib/tickets";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const ensureInitialAdmin = useMutation(api.users.ensureInitialAdmin);
  const [bootstrapped, setBootstrapped] = useState(false);

  // The very first account to sign up becomes the demo agent.
  useEffect(() => {
    if (!isLoading && user && !bootstrapped) {
      ensureInitialAdmin()
        .catch((err) => console.error("ensureInitialAdmin failed:", err))
        .finally(() => setBootstrapped(true));
    }
  }, [isLoading, user, bootstrapped, ensureInitialAdmin]);

  if (isLoading || !user || !bootstrapped) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <span className="flex size-12 items-center justify-center border-2 border-foreground bg-foreground text-background shadow-brutal">
            <Loader2 className="size-6 animate-spin" />
          </span>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Loading your workspace…
          </p>
        </div>
      </main>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (user.role === AGENT_ROLE) {
    return <AgentWorkspace user={user} onSignOut={handleSignOut} />;
  }

  return <CustomerWorkspace user={user} onSignOut={handleSignOut} />;
}
