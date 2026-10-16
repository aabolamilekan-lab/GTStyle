import prisma from "@/lib/prisma";
import { MetalType, Prisma } from "@prisma/client";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { serializeProducts } from "@/lib/utils/serialize";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    collection?: string;
    metal?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, collection, metal, minPrice, maxPrice, sort } = await searchParams;

  const minPriceCents = minPrice ? parseInt(minPrice, 10) : undefined;
  const maxPriceCents = maxPrice ? parseInt(maxPrice, 10) : undefined;

  // Build Prisma where query
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
  };

  if (category) {
    where.category = { slug: category };
  }

  if (collection) {
    where.collection = { slug: collection };
  }

  if (metal || minPriceCents !== undefined || maxPriceCents !== undefined) {
    where.variants = {
      some: {
        isActive: true,
        ...(metal && Object.values(MetalType).includes(metal as MetalType)
          ? { metalType: metal as MetalType }
          : {}),
        ...(minPriceCents !== undefined || maxPriceCents !== undefined
          ? {
              priceCents: {
                ...(minPriceCents !== undefined && !isNaN(minPriceCents) ? { gte: minPriceCents } : {}),
                ...(maxPriceCents !== undefined && !isNaN(maxPriceCents) ? { lte: maxPriceCents } : {}),
              },
            }
          : {}),
      },
    };
  }

  // Determine sorting
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") {
    orderBy = { basePriceCents: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { basePriceCents: "desc" };
  }

  // Fetch products and categories
  const [rawProducts, categories, activeCategory, activeCollection] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: {
          where: {
            isActive: true,
            ...(metal && Object.values(MetalType).includes(metal as MetalType)
              ? { metalType: metal as MetalType }
              : {}),
          },
        },
        category: true,
        collection: true,
        specifications: true,
      },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    category ? prisma.category.findUnique({ where: { slug: category } }) : null,
    collection ? prisma.collection.findUnique({ where: { slug: collection } }) : null,
  ]);

  const products = serializeProducts(rawProducts);

  const pageTitle = activeCategory?.name || activeCollection?.name || "High Jewelry Catalog";
  const pageSubtitle =
    activeCategory?.description ||
    activeCollection?.description ||
    "Curate certified natural solitaires, seamless tennis ribbons, and bespoke gemstone pendants. Directly secured via concierge bank transfer with zero gateway friction.";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-champagne font-sans">
          GTStyle Fine Jewelry Digital Atelier
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-alabaster font-light tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans max-w-2xl mx-auto">
          {pageSubtitle}
        </p>
      </div>

      {/* Filterable Catalog Subsystem */}
      <ShopCatalog
        products={products}
        categories={categories}
        activeCategoryName={activeCategory?.name || activeCollection?.name}
      />
    </div>
  );
}
