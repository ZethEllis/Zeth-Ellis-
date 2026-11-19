"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type NavItem = { href: string; label: string; hint?: string };

/** A menu button that opens a small list of links. Opens on click or tap; closes on outside click, Escape, or navigation. */
export default function NavDropdown({
  label,
  items,
  footer,
  align = "left",
}: {
  label: ReactNode;
  items: NavItem[];
  footer?: ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="sm:relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-1.5 hover:text-brand-600 ${open ? "text-brand-600" : ""}`}
      >
        {label}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          // On phones the menu spans the header width; on larger screens it hangs under its button.
          className={`absolute inset-x-4 top-full z-20 mt-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg sm:inset-x-auto sm:mt-2 sm:w-60 ${
            align === "right" ? "sm:right-0" : "sm:left-0"
          }`}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-brand-50"
            >
              <span className="block font-medium text-slate-900">{item.label}</span>
              {item.hint && <span className="block text-xs text-slate-500">{item.hint}</span>}
            </Link>
          ))}
          {footer && <div className="mt-1 border-t border-slate-100 pt-1">{footer}</div>}
        </div>
      )}
    </div>
  );
}
