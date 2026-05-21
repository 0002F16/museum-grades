"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "All Bags", href: "/collections/all-bags" },
  { label: "Designers", href: "/collections/all-bags#designers" },
] as const;

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus the input whenever the search bar opens
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  function openSearch() {
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    closeSearch();
  }

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch();
    }
    if (searchOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement Bar */}
      <div
        className="flex h-[41px] w-full items-center justify-center px-4"
        style={{ backgroundColor: "rgb(26, 28, 31)" }}
      >
        <p className="text-sm font-normal tracking-wider text-white">
          The world&apos;s finest pre-owned luxury handbags, curated with care.
        </p>
      </div>

      {/* Navigation Bar */}
      <nav
        className="relative flex h-[62px] items-center justify-between border-b bg-white px-6"
        style={{ borderBottomColor: "rgb(229, 229, 229)" }}
      >
        {/* Logo — hidden when search is open on mobile */}
        <Link
          href="/"
          className={cn(
            "text-xl font-bold uppercase tracking-[3px] transition-opacity",
            searchOpen && "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
          )}
          style={{ color: "rgb(25, 28, 31)" }}
        >
          Museum Grades
        </Link>

        {/* Center Nav Links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  "text-base font-normal transition-colors",
                  "hover:[color:rgb(25,28,31)]"
                )}
                style={{ color: "rgba(25, 28, 31, 0.75)" }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: search icon or expanded search bar */}
        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bags, designers…"
                className="w-[200px] border-b bg-transparent pb-1 text-[14px] outline-none transition-all focus:w-[280px] md:w-[260px] md:focus:w-[360px]"
                style={{
                  borderBottomColor: "rgb(25,28,31)",
                  color: "rgb(25,28,31)",
                }}
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex-shrink-0"
              >
                <Search className="size-5" style={{ color: "rgb(25,28,31)" }} />
              </button>
              <button
                type="button"
                aria-label="Close search"
                onClick={closeSearch}
                className="flex-shrink-0"
              >
                <X className="size-5" style={{ color: "rgb(25,28,31)" }} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              aria-label="Open search"
              onClick={openSearch}
            >
              <Search className="size-6" style={{ color: "rgb(25, 28, 31)" }} />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
