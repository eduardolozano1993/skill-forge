"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, CircleUserRound, LogOut, Settings } from "lucide-react";

import { signOutAction } from "@/app/(auth)/sign-in/actions";
import { Button } from "@/components/ui/button";

type ProfileMenuProps = {
  user: {
    displayName: string;
    email: string;
  };
};

export function ProfileMenu({ user }: ProfileMenuProps) {
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
        <span className="hidden text-sm md:inline">{user.displayName}</span>
        <ChevronDown className="size-4 text-text-soft" />
      </Button>

      {open ? (
        <div
          role="menu"
          aria-label="Profile actions"
          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 isolate w-52 rounded-2xl border border-border bg-[#1b2230] p-2 shadow-card backdrop-blur-none"
        >
          <div className="rounded-xl bg-[#1b2230] px-4 py-3">
            <p className="text-sm font-medium text-text-strong">{user.displayName}</p>
            <p className="text-xs text-text-soft">{user.email}</p>
          </div>
          <Link
            href="/profile"
            role="menuitem"
            className="flex w-full items-center gap-3 rounded-xl bg-[#1b2230] px-4 py-3 text-sm font-medium text-text-strong transition hover:bg-[#222b3a]"
            onClick={() => setOpen(false)}
          >
            <Settings className="size-4 text-brand" />
            Settings
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-3 rounded-xl bg-[#1b2230] px-4 py-3 text-left text-sm font-medium text-text-strong transition hover:bg-[#222b3a]"
            >
              <LogOut className="size-4 text-text-soft" />
              Logout
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
