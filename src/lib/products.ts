import { seedProducts } from "./seed-data";
import type { Product, ProductFilters, FilterGroup } from "@/types/product";

// ─── helpers ──────────────────────────────────────────────────────────────────

function matchesFilters(p: Product, filters: ProductFilters): boolean {
  if (filters.query) {
    const q = filters.query.toLowerCase();
    const haystack = [p.name, p.brand, p.description, p.color, p.material, p.bagType]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (filters.brand && p.brand !== filters.brand) return false;
  if (filters.condition && p.condition !== filters.condition) return false;
  if (filters.color && p.color !== filters.color) return false;
  if (filters.material && p.material !== filters.material) return false;
  if (filters.bagType && p.bagType !== filters.bagType) return false;
  if (filters.priceMin !== undefined && p.price < filters.priceMin) return false;
  if (filters.priceMax !== undefined && p.price > filters.priceMax) return false;
  return true;
}

function sortProducts(products: Product[], sort?: ProductFilters["sort"]): Product[] {
  const list = [...products];
  if (sort === "price-asc") return list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return list.sort((a, b) => b.price - a.price);
  // "newest" — keep seed order (most recently added first)
  return list;
}

// ─── public API (same signatures as the SQLite version) ───────────────────────

export function getProducts(filters: ProductFilters = {}): {
  products: Product[];
  total: number;
} {
  const pageSize = filters.pageSize ?? 24;
  const page = filters.page ?? 1;

  const filtered = seedProducts.filter((p) => matchesFilters(p, filters));
  const sorted = sortProducts(filtered, filters.sort);
  const total = sorted.length;
  const products = sorted.slice((page - 1) * pageSize, page * pageSize);

  return { products, total };
}

export function getProductBySlug(slug: string): Product | null {
  return seedProducts.find((p) => p.slug === slug) ?? null;
}

export function getAllProducts(): Product[] {
  return [...seedProducts];
}

export interface CategoryItem {
  name: string;
  image: string;
  href: string;
  count: number;
}

// Preferred display order — only categories that have ≥1 product are returned
const CATEGORY_ORDER = [
  "Crossbody Bags",
  "Shoulder Bags",
  "Handbags",
  "Totes",
  "Backpacks",
  "Clutches",
  "Bucket Bags",
  "Belt Bags",
  "Hobo Bags",
  "Satchels",
];

export function getCategories(): CategoryItem[] {
  const map = new Map<string, { count: number; image: string }>();
  for (const p of seedProducts) {
    if (!map.has(p.bagType)) {
      map.set(p.bagType, { count: 0, image: p.images[0] ?? "" });
    }
    map.get(p.bagType)!.count += 1;
  }
  return CATEGORY_ORDER.filter((name) => (map.get(name)?.count ?? 0) > 0).map(
    (name) => ({
      name,
      image: map.get(name)!.image,
      href: `/collections/all-bags?bagType=${encodeURIComponent(name)}`,
      count: map.get(name)!.count,
    })
  );
}

export function getFacets(_filters: ProductFilters = {}): FilterGroup[] {
  // Counts are always global (across the full catalogue) for discoverability
  function countBy(key: keyof Product): FilterGroup["options"] {
    const map = new Map<string, number>();
    for (const p of seedProducts) {
      const val = String(p[key]);
      map.set(val, (map.get(val) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ label, count }));
  }

  const priceTiers = [
    { label: "Under $500", min: 0, max: 500 },
    { label: "$500 – $1,000", min: 500, max: 1000 },
    { label: "$1,000 – $2,500", min: 1000, max: 2500 },
    { label: "$2,500 – $5,000", min: 2500, max: 5000 },
    { label: "Over $5,000", min: 5000, max: Infinity },
  ];

  const priceOptions = priceTiers.map(({ label, min, max }) => ({
    label,
    count: seedProducts.filter((p) => p.price >= min && p.price < max).length,
  }));

  return [
    { name: "Designers", options: countBy("brand") },
    { name: "Condition", options: countBy("condition") },
    { name: "Bag Type", options: countBy("bagType") },
    { name: "Price", options: priceOptions },
    { name: "Color", options: countBy("color") },
    { name: "Material", options: countBy("material") },
  ];
}
