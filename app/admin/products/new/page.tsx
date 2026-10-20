import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import { ProductMatrixStudio } from "@/components/admin/ProductMatrixStudio";

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  const [categories, collections] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.collection.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-champagne transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Products</span>
        </Link>
        <span className="text-[10px] uppercase tracking-wider text-champagne bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-sm">
          Product Management
        </span>
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-champagne font-sans">
          Product Creator
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-alabaster font-light tracking-wide">
          Add New Product
        </h1>
        <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
          Upload product photos, set the price, select available colors, and publish to your shop.
        </p>
      </div>

      <ProductMatrixStudio categories={categories} collections={collections} />
    </div>
  );
}
