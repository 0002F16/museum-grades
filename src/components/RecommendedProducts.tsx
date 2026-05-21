"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

interface RecommendedProductsProps {
  products: Product[];
  title: string;
}

export function RecommendedProducts({
  products,
  title,
}: RecommendedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 500;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <h2
        className="mb-6 text-[24px] font-medium"
        style={{ color: "rgb(25,28,31)" }}
      >
        {title}
      </h2>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product) => (
            <div key={product.id} className="w-[220px] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
          aria-label="Previous"
        >
          <ChevronLeft
            className="h-5 w-5"
            style={{ color: "rgb(25,28,31)" }}
          />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
          aria-label="Next"
        >
          <ChevronRight
            className="h-5 w-5"
            style={{ color: "rgb(25,28,31)" }}
          />
        </button>
      </div>
    </div>
  );
}
