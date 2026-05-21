"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { seedCategories as categories } from "@/lib/seed-data";

export function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 400;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={cat.href}
            className="mx-[4.8px] flex flex-shrink-0 flex-col items-center"
            style={{ width: "166px" }}
          >
            <div
              className="mb-2 h-[150px] w-full overflow-hidden"
              style={{ backgroundColor: "#f5f5f5" }}
            >
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-sm" style={{ color: "rgba(25,28,31,0.3)" }}>
                  {cat.name}
                </span>
              </div>
            </div>
            <span className="text-[14px] underline" style={{ color: "rgb(25,28,31)" }}>
              {cat.name}
            </span>
          </a>
        ))}
      </div>

      <button
        onClick={() => scroll("left")}
        className="absolute -left-4 top-[60px] flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
        aria-label="Slide left"
      >
        <ChevronLeft className="h-5 w-5" style={{ color: "rgb(25,28,31)" }} />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute -right-4 top-[60px] flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
        aria-label="Slide right"
      >
        <ChevronRight className="h-5 w-5" style={{ color: "rgb(25,28,31)" }} />
      </button>
    </div>
  );
}
