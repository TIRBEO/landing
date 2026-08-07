import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Check, Loader2, Send } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter() {
  const subscribe = useMutation(api.waitlist.subscribe);
  const [step, setStep] = useState<"email" | "note">("email");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      toast.error("Check your email", {
        description: "Please enter a valid email address to continue.",
      });
      return;
    }
    setStep("note");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const { alreadySubscribed } = await subscribe({
        email: email.trim(),
        note: note.trim() || undefined,
      });
      setDone(true);
      toast.success(
        alreadySubscribed
          ? "You're already on the list!"
          : "You're on the list!",
        {
          description: "We'll email you before the public launch.",
        },
      );
    } catch (err) {
      toast.error("Could not subscribe", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-20">
      <div className="relative overflow-hidden border-2 border-foreground bg-nb-yellow px-6 py-14 text-center shadow-brutal-lg sm:px-12">
        <div
          className="absolute -top-10 -left-10 size-28 rotate-12 border-2 border-foreground bg-nb-blue"
          aria-hidden
        />
        <div
          className="absolute -right-10 -bottom-10 size-28 -rotate-12 border-2 border-foreground bg-nb-pink"
          aria-hidden
        />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest">
            Never miss an update
          </p>
          <h2 className="mx-auto mt-2 max-w-xl text-3xl font-black uppercase tracking-tight sm:text-5xl">
            Subscribe for launch announcements.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm font-medium text-foreground/70">
            No spam. Unsubscribe anytime. Early access members get invitations
            ahead of the public launch with exclusive features.
          </p>

          {done ? (
            <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 border-2 border-foreground bg-card px-4 py-3 text-sm font-black uppercase tracking-wide shadow-brutal-sm">
              <Check className="size-4" />
              You're on the list — see you at launch.
            </div>
          ) : step === "email" ? (
            <form
              onSubmit={onContinue}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="bg-card"
                disabled={loading}
              />
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="shrink-0 bg-foreground text-background hover:bg-foreground/90"
              >
                Continue
                <ArrowRight className="size-4" />
              </Button>
            </form>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-3 border-2 border-foreground bg-card px-3 py-2 text-left shadow-brutal-sm">
                <span className="flex min-w-0 items-center gap-2 text-sm font-bold">
                  <Check className="size-4 shrink-0 text-nb-green" />
                  <span className="truncate">{email}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="shrink-0 text-[11px] font-black uppercase tracking-widest text-foreground/60 underline underline-offset-2 hover:text-foreground"
                >
                  Edit
                </button>
              </div>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="One line about what you're building — it may appear in Early believers."
                rows={3}
                maxLength={160}
                className="resize-none bg-card"
                disabled={loading}
              />
              <p className="text-left text-[11px] font-bold uppercase tracking-widest text-foreground/60">
                Optional — your note could show up in Early believers.
              </p>
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                Join the waitlist
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
