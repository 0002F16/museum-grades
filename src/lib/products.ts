import { getDb } from "./db";
import type { Product, ProductFilters, FilterGroup } from "@/types/product";

interface DbRow {
  id: string;
  slug: string;
  brand: string;
  name: string;
  price: number;
  est_retail: number;
  savings_pct: number;
  condition: string;
  color: string;
  material: string;
  bag_type: string;
  images: string;
  description: string;
  item_number: string;
  exterior: string;
  hardware: string;
  interior: string;
  comes_with: string;
  size_base: string;
  size_height: string;
  size_depth: string;
  size_drop: string;
}

function rowToProduct(row: DbRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    name: row.name,
    price: row.price,
    estRetail: row.est_retail,
    savingsPercent: row.savings_pct,
    condition: row.condition as Product["condition"],
    color: row.color,
    material: row.material,
    bagType: row.bag_type,
    images: JSON.parse(row.images) as string[],
    description: row.description,
    itemNumber: row.item_number,
    exterior: row.exterior,
    hardware: row.hardware,
    interior: row.interior,
    comesWith: row.comes_with,
    size: {
      base: row.size_base,
      height: row.size_height,
      depth: row.size_depth,
      drop: row.size_drop,
    },
  };
}

export function getProducts(filters: ProductFilters = {}): {
  products: Product[];
  total: number;
} {
  const db = getDb();
  const conditions: string[] = [];
  const params: Record<string, string | number> = {};

  if (filters.query) {
    const q = `%${filters.query}%`;
    conditions.push("(name LIKE @q OR brand LIKE @q OR description LIKE @q OR color LIKE @q OR material LIKE @q OR bag_type LIKE @q)");
    params.q = q;
  }
  if (filters.brand) {
    conditions.push("brand = @brand");
    params.brand = filters.brand;
  }
  if (filters.condition) {
    conditions.push("condition = @condition");
    params.condition = filters.condition;
  }
  if (filters.color) {
    conditions.push("color = @color");
    params.color = filters.color;
  }
  if (filters.material) {
    conditions.push("material = @material");
    params.material = filters.material;
  }
  if (filters.bagType) {
    conditions.push("bag_type = @bagType");
    params.bagType = filters.bagType;
  }
  if (filters.priceMin !== undefined) {
    conditions.push("price >= @priceMin");
    params.priceMin = filters.priceMin;
  }
  if (filters.priceMax !== undefined) {
    conditions.push("price <= @priceMax");
    params.priceMax = filters.priceMax;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const sortMap: Record<string, string> = {
    newest: "created_at DESC",
    "price-asc": "price ASC",
    "price-desc": "price DESC",
  };
  const orderBy = sortMap[filters.sort ?? "newest"] ?? "created_at DESC";

  const pageSize = filters.pageSize ?? 24;
  const page = filters.page ?? 1;
  const offset = (page - 1) * pageSize;

  const total = (
    db.prepare(`SELECT COUNT(*) as c FROM products ${where}`).get(params) as { c: number }
  ).c;

  const rows = db
    .prepare(`SELECT * FROM products ${where} ORDER BY ${orderBy} LIMIT @limit OFFSET @offset`)
    .all({ ...params, limit: pageSize, offset }) as DbRow[];

  return { products: rows.map(rowToProduct), total };
}

export function getProductBySlug(slug: string): Product | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug) as DbRow | undefined;
  return row ? rowToProduct(row) : null;
}

export function getAllProducts(): Product[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM products ORDER BY created_at DESC").all() as DbRow[];
  return rows.map(rowToProduct);
}

export function getFacets(filters: ProductFilters = {}): FilterGroup[] {
  const db = getDb();

  // Count helper
  function countBy(column: string): FilterGroup["options"] {
    const rows = db
      .prepare(`SELECT ${column} as label, COUNT(*) as count FROM products GROUP BY ${column} ORDER BY count DESC`)
      .all() as { label: string; count: number }[];
    return rows.map((r) => ({ label: r.label, count: r.count }));
  }

  // Price tier counts
  const priceTiers = [
    { label: "Under $500", min: 0, max: 500 },
    { label: "$500 – $1,000", min: 500, max: 1000 },
    { label: "$1,000 – $2,500", min: 1000, max: 2500 },
    { label: "$2,500 – $5,000", min: 2500, max: 5000 },
    { label: "Over $5,000", min: 5000, max: 999999 },
  ];

  const priceOptions = priceTiers.map(({ label, min, max }) => {
    const count = (
      db
        .prepare("SELECT COUNT(*) as c FROM products WHERE price >= @min AND price < @max")
        .get({ min, max }) as { c: number }
    ).c;
    return { label, count };
  });

  // Check active price filter to label counts correctly
  void filters; // facets always show global counts for discoverability

  return [
    { name: "Designers", options: countBy("brand") },
    { name: "Condition", options: countBy("condition") },
    { name: "Bag Type", options: countBy("bag_type") },
    { name: "Price", options: priceOptions },
    { name: "Color", options: countBy("color") },
    { name: "Material", options: countBy("material") },
  ];
}
