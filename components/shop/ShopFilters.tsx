"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, RotateCcw, Check } from "lucide-react";
import { MetalType } from "@prisma/client";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ShopFiltersProps {
  categories: CategoryOption[];
  totalResults: number;
}

const AVAILABLE_METALS: { label: string; value: MetalType; color: string }[] = [
  { label: "Gold Finish", value: MetalType.YELLOW_GOLD_18K, color: "#D4AF37" },
  { label: "Silver / White Finish", value: MetalType.WHITE_GOLD_18K, color: "#E6E8EC" },
  { label: "Rose Gold Finish", value: MetalType.ROSE_GOLD_18K, color: "#DE9B85" },
  { label: "Silver Finish", value: MetalType.PLATINUM_950, color: "#CFD4DC" },
];

export function ShopFilters({ categories, totalResults }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentMetal = searchParams.get("metal") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const [minPriceInput, setMinPriceInput] = useState(
    currentMinPrice ? (Number(currentMinPrice) / 100).toString() : ""
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    currentMaxPrice ? (Number(currentMaxPrice) / 100).toString() : ""
  );

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value.trim() !== "") {
      params.set(key, value.trim());
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (minPriceInput && !isNaN(Number(minPriceInput))) {
      params.set("minPrice", (Math.max(0, Number(minPriceInput)) * 100).toString());
    } else {
      params.delete("minPrice");
    }

    if (maxPriceInput && !isNaN(Number(maxPriceInput))) {
      params.set("maxPrice", (Math.max(0, Number(maxPriceInput)) * 100).toString());
    } else {
      params.delete("maxPrice");
    }

    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    router.push("/shop", { scroll: false });
  };

  const hasActiveFilters = Boolean(
    currentCategory || currentMetal || currentMinPrice || currentMaxPrice || currentSort !== "newest"
  );

  const filterContent = (
    <div className="space-y-8 text-alabaster">
      {/* Header with Results Count & Clear Button */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-champagne" />
          <span className="font-serif text-lg tracking-wide">Filter Products</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center space-x-1 text-[11px] uppercase tracking-wider text-neutral-400 hover:text-champagne transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-2.5">
        <label htmlFor="sort-select" className="text-xs uppercase tracking-widest text-neutral-400 font-sans block">
          Sort Order
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 text-xs text-alabaster px-3 py-2.5 rounded-sm focus:outline-none focus:border-champagne"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories Filter */}
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-sans block">
          Category
        </span>
        <div className="flex flex-col space-y-1.5">
          <button
            type="button"
            onClick={() => updateParam("category", null)}
            className={`flex items-center justify-between px-3 py-2 text-xs rounded-sm transition-all text-left ${
              !currentCategory
                ? "bg-champagne/15 text-champagne border border-champagne/40 font-medium"
                : "text-neutral-400 hover:text-alabaster hover:bg-neutral-900"
            }`}
          >
            <span>All Categories</span>
            {!currentCategory && <Check className="w-3.5 h-3.5 text-champagne" />}
          </button>

          {categories.map((cat) => {
            const isSelected = currentCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateParam("category", isSelected ? null : cat.slug)}
                className={`flex items-center justify-between px-3 py-2 text-xs rounded-sm transition-all text-left ${
                  isSelected
                    ? "bg-champagne/15 text-champagne border border-champagne/40 font-medium"
                    : "text-neutral-400 hover:text-alabaster hover:bg-neutral-900"
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-champagne" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Metal Alloy Filter */}
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-sans block">
          Color & Material
        </span>
        <div className="flex flex-col space-y-2">
          {AVAILABLE_METALS.map((metal) => {
            const isSelected = currentMetal === metal.value;
            return (
              <button
                key={metal.value}
                type="button"
                onClick={() => updateParam("metal", isSelected ? null : metal.value)}
                className={`flex items-center justify-between px-3 py-2 text-xs rounded-sm transition-all text-left border ${
                  isSelected
                    ? "bg-neutral-900 text-champagne border-champagne/50"
                    : "border-neutral-800 text-neutral-400 hover:text-alabaster hover:border-neutral-700 bg-neutral-950/40"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-3 h-3 rounded-full border border-neutral-700 shadow-sm"
                    style={{ backgroundColor: metal.color }}
                  />
                  <span>{metal.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-champagne" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter (Naira) */}
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-sans block">
          Price Range (₦ NGN)
        </span>
        <form onSubmit={handlePriceApply} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-neutral-500 uppercase block mb-1">
                Min (₦)
              </label>
              <input
                type="number"
                placeholder="0"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-2.5 py-2 rounded-sm focus:outline-none focus:border-champagne"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-500 uppercase block mb-1">
                Max (₦)
              </label>
              <input
                type="number"
                placeholder="1,000,000"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-2.5 py-2 rounded-sm focus:outline-none focus:border-champagne"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-champagne text-xs uppercase tracking-widest transition-colors rounded-sm"
          >
            Apply Price Filter
          </button>
        </form>
      </div>

      {/* Results Count Footer */}
      <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-400 font-sans">
        Showing <span className="text-champagne font-semibold">{totalResults}</span> jewelry items
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0 bg-neutral-950/70 border border-neutral-800/80 p-6 rounded-sm self-start sticky top-28">
        {filterContent}
      </aside>

      {/* Mobile Filter Toggle Drawer */}
      <div className="lg:hidden w-full mb-6">
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-neutral-950 border border-neutral-800 text-alabaster text-xs uppercase tracking-wider rounded-sm"
        >
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-champagne" />
            <span>Filter Products ({totalResults} Items)</span>
          </div>
          <span className="text-champagne font-mono text-sm">{isMobileOpen ? "−" : "+"}</span>
        </button>

        {isMobileOpen && (
          <div className="mt-3 p-6 bg-neutral-950 border border-neutral-800 rounded-sm">
            {filterContent}
          </div>
        )}
      </div>
    </>
  );
}

export default ShopFilters;
