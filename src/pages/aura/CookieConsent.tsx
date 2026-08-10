import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Check, Cookie, Settings2, ShieldCheck, X } from "lucide-react";
import {
  ALL_CATEGORIES,
  CATEGORY_META,
  getConsentCategories,
  setConsentCategories,
  type ConsentCategory,
} from "../../lib/consent";

/* ══════════════════════════════════════════════════════════════════════════
   TIRBEO — cookie consent banner (dark editorial theme)
   Two views: the quick banner (Accept all / Essential only) and a settings
   view with per-category toggles, opened via "Manage cookies".
   ══════════════════════════════════════════════════════════════════════════ */

type View = "quick" | "settings";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<View>("quick");
  const [enabled, setEnabled] = useState<ConsentCategory[]>(["essential"]);

  useEffect(() => {
    // Only auto-show when no consent has been recorded yet.
    if (getConsentCategories().length === 0) {
      const t = window.setTimeout(() => setVisible(true), 1200);
      return () => window.clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    // Reopen on demand from footer "Manage cookies" links — straight to settings.
    function onManage() {
      const cats = getConsentCategories();
      setEnabled(cats.length > 0 ? cats : ["essential"]);
      setView("settings");
      setVisible(true);
    }
    window.addEventListener("tirbeo:manage-cookies", onManage);
    return () => window.removeEventListener("tirbeo:manage-cookies", onManage);
  }, []);

  function dismiss() {
    setVisible(false);
  }

  function toggle(category: ConsentCategory) {
    if (CATEGORY_META[category].locked) return;
    setEnabled((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  }

  function save() {
    setConsentCategories(enabled);
    dismiss();
  }

  function acceptAll() {
    setConsentCategories([...ALL_CATEGORIES]);
    dismiss();
  }

  function essentialOnly() {
    setConsentCategories(["essential"]);
    dismiss();
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 md:bottom-6 inset-x-4 md:inset-x-0 z-50 flex justify-center px-0 md:px-6"
          role="region"
          aria-label="Cookie consent"
        >
          <div className="liquid-glass w-full max-w-2xl rounded-2xl p-5 md:p-6">
            <button
              type="button"
              onClick={essentialOnly}
              aria-label="Dismiss — essential cookies only"
              title="Dismiss — essential cookies only"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 transition-all hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            {view === "quick" ? (
              <div className="flex items-start gap-4 pr-8">
                <span className="hidden sm:flex w-11 h-11 shrink-0 rounded-full icon-chip icon-chip--violet items-center justify-center">
                  <Cookie className="w-5 h-5 text-[#c4b5fd]" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">Cookies on Tirbeo</h3>
                    <ShieldCheck className="w-4 h-4 text-[#ffffff]/60" />
                  </div>
                  <p className="mt-2 text-white/55 text-sm leading-[1.7]">
                    We use cookies to keep the site working and understand how it's
                    used — nothing for advertising, ever. You can choose what we
                    may store.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={acceptAll}
                      className="rounded-full btn-gradient text-white text-sm font-medium px-5 py-2.5"
                    >
                      Accept all
                    </button>
                    <button
                      type="button"
                      onClick={essentialOnly}
                      className="rounded-full border border-white/15 text-white text-sm font-medium px-5 py-2.5 transition-all hover:bg-white/5"
                    >
                      Essential only
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const cats = getConsentCategories();
                        setEnabled(cats.length > 0 ? cats : ["essential"]);
                        setView("settings");
                      }}
                      className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      Customize
                    </button>
                    <Link
                      to="/cookies"
                      className="accent-underline text-sm text-white/60 hover:text-white transition-colors"
                    >
                      Cookie policy
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pr-8">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full icon-chip icon-chip--violet flex items-center justify-center">
                    <Settings2 className="w-4 h-4 text-[#c4b5fd]" />
                  </span>
                  <div>
                    <h3 className="text-white font-semibold">Cookie settings</h3>
                    <p className="text-[11px] text-white/45">Choose what we may store.</p>
                  </div>
                </div>

                <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
                  {ALL_CATEGORIES.map((cat) => {
                    const meta = CATEGORY_META[cat];
                    const on = enabled.includes(cat);
                    return (
                      <div key={cat} className="flex items-start justify-between gap-4 py-3.5">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {meta.label}
                            {meta.locked && (
                              <span className="ml-2 px-1.5 py-0.5 rounded-full border border-white/10 text-[9px] uppercase tracking-[0.12em] text-white/40">
                                Always on
                              </span>
                            )}
                          </p>
                          <p className="mt-0.5 text-[11px] text-white/45 leading-[1.5] max-w-xs">
                            {meta.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={on}
                          aria-label={meta.label}
                          disabled={meta.locked}
                          onClick={() => toggle(cat)}
                          className={`relative w-10 h-6 rounded-full transition-colors duration-300 shrink-0 ${
                            meta.locked ? "opacity-60" : ""
                          } ${on ? "btn-gradient" : "bg-white/10"}`}
                        >
                          <span
                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
                              on ? "left-[18px]" : "left-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={save}
                    className="rounded-full btn-gradient text-white text-sm font-medium px-5 py-2.5"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Save preferences
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="rounded-full border border-white/15 text-white text-sm font-medium px-5 py-2.5 transition-all hover:bg-white/5"
                  >
                    Accept all
                  </button>
                  <Link
                    to="/cookies"
                    className="accent-underline text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Cookie policy
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
