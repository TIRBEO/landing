import { Button } from "@/components/ui/button";
import { Ticket, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="relative">
          <div className="absolute inset-0 translate-x-3 translate-y-3 border-2 border-foreground bg-nb-yellow" />
          <div className="relative border-2 border-foreground bg-card px-10 py-8 shadow-brutal-lg sm:px-14 sm:py-10">
            <p className="text-7xl font-black tracking-tight sm:text-8xl">
              4<span className="text-nb-blue">0</span>4
            </p>
          </div>
        </div>
        <p className="mt-10 text-lg font-black uppercase tracking-tight">
          Page not found
        </p>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
          This ticket doesn&apos;t exist in our system. Let&apos;s get you back
          to the help desk.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link to="/">
              <Home className="size-4" />
              Back home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">
              <Ticket className="size-4" />
              My tickets
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
