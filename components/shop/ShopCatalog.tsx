"use client";

import React from "react";
import Link from "next/link";
import { Gem, RotateCcw } from "lucide-react";
import { ProductCard, ProductCardProps } from "@/components/shop/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";

interface ShopCatalogProps {
  products: ProductCardProps["product"][];
  categories: { id: string; name: string; slug: string }[];
  activeCategoryName?: string;
}

export function ShopCatalog({
  products,
  categories,
  activeCategoryName,
}: ShopCatalogProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
      {/* Filters Sidebar */}
      <ShopFilters categories={categories} totalResults={products.length} />

      {/* Main Catalog Grid */}
      <div className="flex-1 w-full">
        {products.length === 0 ? (
          /* Zero-State Handling */
          <div className="w-full bg-neutral-950/80 border border-neutral-800 p-12 sm:p-16 text-center rounded-sm flex flex-col items-center justify-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-champagne/60">
              <Gem className="w-8 h-8 stroke-[1.2]" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="font-serif text-2xl text-alabaster font-light tracking-wide">
                No matching creations found
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                No jewelry pieces match your active curation criteria in{" "}
                {activeCategoryName ? `"${activeCategoryName}"` : "the atelier vault"}. Try broadening your price boundaries or alloy selection.
              </p>
            </div>

            <Link
              href="/shop"
              className="mt-2 inline-flex items-center space-x-2 px-6 py-3 bg-champagne text-obsidian text-xs uppercase tracking-widest font-semibold hover:bg-champagne-light transition-colors shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopCatalog;
