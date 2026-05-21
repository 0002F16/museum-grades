import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";

export function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return params.then(({ slug }) => {
    const product = getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  });
}
