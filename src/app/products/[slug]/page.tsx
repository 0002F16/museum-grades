import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ImageGallery } from "@/components/ImageGallery";
import { ProductInfo } from "@/components/ProductInfo";
import { RecommendedProducts } from "@/components/RecommendedProducts";
import { getProductBySlug, getAllProducts } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "All Bags", href: "/collections/all-bags" },
    { label: product.brand, href: `/collections/all-bags?brand=${encodeURIComponent(product.brand)}` },
    { label: product.name },
  ];

  const allProducts = getAllProducts();
  const recommended = allProducts.filter((p) => p.id !== product.id).slice(0, 6);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="px-[42px]">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Product detail */}
        <div className="flex px-[42px] pb-12 gap-0">
          {/* Left: Image gallery */}
          <div className="w-[55%] pr-0">
            <ImageGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Right: Product info */}
          <div className="w-[45%] pl-[50px]">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Recommended products */}
        <div className="px-[42px] pb-12">
          <RecommendedProducts
            products={recommended}
            title="You May Also Like"
          />
        </div>
      </main>
    </>
  );
}
