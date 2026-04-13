"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { Button } from "@/components/site/button";
import { cn } from "@/lib/cn";

type HomepageMarkdownContextValue = {
  close: () => void;
  isOpen: boolean;
  open: () => void;
};

const HomepageMarkdownContext =
  createContext<HomepageMarkdownContextValue | null>(null);

function MarkdownCloseControl({
  closeHref,
  onClose,
}: {
  closeHref?: string;
  onClose?: () => void;
}) {
  const className =
    "inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-400/90 text-[0.65rem] font-black leading-none text-white transition-transform duration-200 hover:scale-105";

  if (onClose) {
    return (
      <button
        aria-label="close markdown view"
        className={className}
        onClick={onClose}
        type="button"
      >
        x
      </button>
    );
  }

  if (closeHref) {
    return (
      <Link aria-label="close markdown view" className={className} href={closeHref}>
        x
      </Link>
    );
  }

  return <span className="h-4 w-4 rounded-full bg-rose-400/90" />;
}

export function HomepageMarkdownPanel({
  closeHref,
  onClose,
  open = true,
  overlay = false,
  source,
}: {
  closeHref?: string;
  onClose?: () => void;
  open?: boolean;
  overlay?: boolean;
  source: string;
}) {
  if (!open) {
    return null;
  }

  const lines = source.split("\n");

  return (
    <div
      className={cn(
        overlay
          ? "fixed inset-0 z-[80] overflow-y-auto bg-[rgba(237,244,249,0.82)] px-4 py-4 backdrop-blur-md sm:px-6 sm:py-6"
          : "min-h-screen px-4 py-4 sm:px-6"
      )}
    >
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[2rem] border border-slate-700/40 bg-[linear-gradient(180deg,rgba(13,25,39,0.98),rgba(16,33,53,0.96))] shadow-[0_28px_70px_rgba(8,18,31,0.28)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <MarkdownCloseControl closeHref={closeHref} onClose={onClose} />
              <span className="h-5 w-5 rounded-full bg-amber-300/90" />
              <span className="h-5 w-5 rounded-full bg-emerald-400/90" />
            </div>
            <span className="font-mono text-[0.72rem] font-medium tracking-[0.06em] text-slate-400">
              content/archive/index/current.md
            </span>
          </div>

          <pre className="overflow-x-hidden px-4 py-5 text-[0.84rem] leading-7 text-slate-200 sm:px-6 sm:py-6">
            <code>
              {lines.map((line, index) => (
                <span
                  className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 sm:grid-cols-[2.5rem_minmax(0,1fr)]"
                  key={`${index}-${line}`}
                >
                  <span className="text-right text-slate-500">{index + 1}</span>
                  <span className="min-w-0 whitespace-pre-wrap break-words">
                    {line || " "}
                  </span>
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export function HomepageMarkdownShell({
  children,
  source,
}: {
  children: ReactNode;
  source: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.history.state?.pagequarryMarkdownOpen) {
      window.history.back();
      return;
    }

    setIsOpen(false);
  };

  const open = () => {
    if (typeof window === "undefined" || isOpen) {
      return;
    }

    window.history.pushState(
      { ...(window.history.state ?? {}), pagequarryMarkdownOpen: true },
      "",
      window.location.href
    );
    setIsOpen(true);
  };

  useEffect(() => {
    const handlePopState = () => {
      setIsOpen(Boolean(window.history.state?.pagequarryMarkdownOpen));
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <HomepageMarkdownContext.Provider value={{ close, isOpen, open }}>
      {children}
      <HomepageMarkdownPanel onClose={close} open={isOpen} overlay source={source} />
    </HomepageMarkdownContext.Provider>
  );
}

export function HomepageMarkdownTrigger() {
  const context = useContext(HomepageMarkdownContext);

  if (!context) {
    return null;
  }

  return (
    <Button onClick={context.open} type="button" variant="ghost">
      <span>Look Under the Hood</span>
      <span className="rounded-full bg-slate-900/8 px-2 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-slate-600">
        Markdown
      </span>
    </Button>
  );
}
