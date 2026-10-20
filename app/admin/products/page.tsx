import Link from "next/link";
import { PlusCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { AdminProductsTable } from "@/components/admin/AdminProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: true,
        specifications: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-champagne font-semibold">
            Product Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-alabaster font-light tracking-wide mt-1">
            Jewelry Products
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your store pieces, update photos, edit prices, or remove items.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-champagne hover:bg-champagne-light text-obsidian text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors shadow-lg self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Interactive Products Table with Edit, Delete, Filter, and Search */}
      <AdminProductsTable products={products} categories={categories} />
    </div>
  );
}
