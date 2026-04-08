"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, CircleUserRound, LogOut, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <Button
        type="button"
        variant="subtle"
        size="sm"
        className="rounded-full pl-0 pr-3"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-surface-strong text-text-inverse">
          <CircleUserRound className="size-4" />
        </span>
        <span className="hidden text-sm md:inline">Profile</span>
        <ChevronDown className="size-4 text-text-soft" />
      </Button>

      {open ? (
        <div
          role="menu"
          aria-label="Profile actions"
          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-52 rounded-2xl border border-border bg-surface p-2 shadow-card"
        >
          <Link
            href="/profile"
            role="menuitem"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-strong transition hover:bg-surface-muted"
            onClick={() => setOpen(false)}
          >
            <Settings className="size-4 text-brand" />
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-text-strong transition hover:bg-surface-muted"
            onClick={() => setOpen(false)}
          >
            <LogOut className="size-4 text-text-soft" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
