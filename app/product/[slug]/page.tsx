import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductConfigurator } from "@/components/product/ProductConfigurator";
import { ProductSpecsAccordion } from "@/components/product/ProductSpecsAccordion";
import { serializeProduct } from "@/lib/utils/serialize";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product || !product.isPublished) {
    return {
      title: "Jewelry Piece Not Found | GTStyle Fine Jewelry",
    };
  }

  const heroImage = product.images[0]?.url;

  return {
    title: `${product.name} | GTStyle Fine Jewelry`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | GTStyle Fine Jewelry`,
      description: product.description.slice(0, 160),
      images: heroImage ? [{ url: heroImage }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const rawProduct = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: {
        where: { isActive: true },
        orderBy: [{ metalType: "asc" }, { priceCents: "asc" }],
      },
      category: true,
      collection: true,
      specifications: true,
    },
  });

  if (!rawProduct || !rawProduct.isPublished) {
    notFound();
  }

  const product = serializeProduct(rawProduct);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-sans uppercase tracking-widest text-neutral-400">
        <Link
          href="/shop"
          className="inline-flex items-center space-x-1.5 hover:text-champagne transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Atelier Vault</span>
        </Link>
        <span>/</span>
        <Link
          href={`/shop?category=${product.category.slug}`}
          className="hover:text-champagne transition-colors"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-neutral-200 truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main 2-Column Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Interactive Macro Zoom Gallery */}
        <div className="lg:sticky lg:top-28">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Column: Title, Configurator & Gemological Vault */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-400 mb-2 font-sans">
              <span>{product.category.name}</span>
              {product.collection && (
                <>
                  <span>•</span>
                  <span className="text-champagne">{product.collection.name}</span>
                </>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-alabaster font-light tracking-wide leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Product Description */}
          <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans border-y border-neutral-800/80 py-5 space-y-3">
            <p>{product.description}</p>
            {product.storyHtml && (
              <div
                className="text-neutral-400 italic font-serif text-sm border-l-2 border-champagne/40 pl-3.5 py-1"
                dangerouslySetInnerHTML={{ __html: product.storyHtml }}
              />
            )}
          </div>

          {/* Interactive Variant Configurator & Laser Engraving */}
          <ProductConfigurator
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              basePriceCents: product.basePriceCents,
              allowsCustomEngraving: product.allowsCustomEngraving,
              maxEngravingLength: product.maxEngravingLength,
              category: product.category,
              images: product.images,
            }}
            variants={product.variants}
          />

          {/* The 4Cs Gemological Vault & Atelier Accordion */}
          <div className="pt-4">
            <ProductSpecsAccordion
              specifications={product.specifications}
              productName={product.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
