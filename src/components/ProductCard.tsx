import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative text-center">
      {/* Product image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className="flex aspect-square w-full items-center justify-center p-3"
          style={{ backgroundColor: "rgb(245,245,245)" }}
        >
          <span
            className="text-center text-sm"
            style={{ color: "rgba(25,28,31,0.3)" }}
          >
            {product.brand}
          </span>
        </div>
      </Link>

      {/* Product info */}
      <div className="mt-3">
        <p
          className="mb-[6px] text-[14px] font-semibold uppercase"
          style={{ letterSpacing: "2.1px", color: "rgb(25,28,31)" }}
        >
          {product.brand}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="block text-[14px] leading-[1.3] hover:underline"
          style={{ fontWeight: 200, color: "rgb(0,0,0)" }}
        >
          {product.name}
        </Link>
        <p
          className="mt-1 text-[12px]"
          style={{ fontWeight: 200, color: "rgb(89,89,89)" }}
        >
          Condition: {product.condition}
        </p>
        <p
          className="mt-[10px] text-[16px] font-medium"
          style={{ color: "rgb(25,28,31)" }}
        >
          ${product.price.toLocaleString("en-US")}
        </p>
        {product.estRetail > 0 && (
          <div className="mt-1 flex items-center justify-center gap-2">
            <span
              className="text-[12px] font-medium"
              style={{ color: "rgb(25,28,31)" }}
            >
              Est. Retail ${product.estRetail.toLocaleString("en-US")}
            </span>
            {product.savingsPercent > 0 && (
              <span
                className="text-[12px] font-semibold"
                style={{ color: "rgb(0,128,0)" }}
              >
                {product.savingsPercent}% below retail
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
