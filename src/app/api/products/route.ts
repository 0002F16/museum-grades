import { NextRequest, NextResponse } from "next/server";
import { getProducts, getFacets } from "@/lib/products";
import type { ProductFilters } from "@/types/product";

export function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const filters: ProductFilters = {};
  if (sp.get("q")) filters.query = sp.get("q")!;
  if (sp.get("brand")) filters.brand = sp.get("brand")!;
  if (sp.get("condition")) filters.condition = sp.get("condition")!;
  if (sp.get("color")) filters.color = sp.get("color")!;
  if (sp.get("material")) filters.material = sp.get("material")!;
  if (sp.get("bagType")) filters.bagType = sp.get("bagType")!;
  if (sp.get("priceMin")) filters.priceMin = Number(sp.get("priceMin"));
  if (sp.get("priceMax")) filters.priceMax = Number(sp.get("priceMax"));
  if (sp.get("sort")) filters.sort = sp.get("sort") as ProductFilters["sort"];
  if (sp.get("page")) filters.page = Number(sp.get("page"));
  if (sp.get("pageSize")) filters.pageSize = Number(sp.get("pageSize"));

  const { products, total } = getProducts(filters);
  const facets = getFacets(filters);

  return NextResponse.json({ products, total, facets });
}
