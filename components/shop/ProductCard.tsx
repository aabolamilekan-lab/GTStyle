"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatNaira, formatMetalType } from "@/lib/utils/format";
import { MetalType } from "@prisma/client";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePriceCents: number;
    category: {
      name: string;
      slug: string;
    };
    specifications?: {
      certificateAgency?: string | null;
      gemstoneType?: string | null;
      caratTotalWeight?: unknown;
    } | null;
    images: {
      url: string;
      altText: string;
      isHero: boolean;
      sortOrder: number;
    }[];
    variants: {
      metalType: MetalType;
      priceCents: number;
    }[];
  };
}

const METAL_SWATCH_COLORS: Record<string, { bg: string; label: string; border: string }> = {
  YELLOW_GOLD_18K: { bg: "bg-[#D4AF37]", label: "18K Yellow Gold", border: "border-[#AA8A2A]" },
  YELLOW_GOLD_14K: { bg: "bg-[#DFBE53]", label: "14K Yellow Gold", border: "border-[#9E8224]" },
  WHITE_GOLD_18K: { bg: "bg-[#E6E8EC]", label: "18K White Gold", border: "border-[#B8BAC0]" },
  WHITE_GOLD_14K: { bg: "bg-[#EAECEF]", label: "14K White Gold", border: "border-[#C0C2C8]" },
  ROSE_GOLD_18K: { bg: "bg-[#DE9B85]", label: "18K Rose Gold", border: "border-[#B06E59]" },
  ROSE_GOLD_14K: { bg: "bg-[#E2A692]", label: "14K Rose Gold", border: "border-[#B77764]" },
  PLATINUM_950: { bg: "bg-[#CFD4DC]", label: "Platinum 950", border: "border-[#969DA8]" },
  STERLING_SILVER_925: { bg: "bg-[#C4C8D0]", label: "925 Silver", border: "border-[#90949D]" },
};

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Sorted images
  const sortedImages = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const heroImage = sortedImages[0]?.url || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85";
  const hoverImage = sortedImages[1]?.url || heroImage;

  // Distinct metals for swatches
  const availableMetals = Array.from(new Set(product.variants.map((v) => v.metalType)));

  // Lowest active price
  const lowestPrice = product.variants.length > 0
    ? Math.min(...product.variants.map((v) => v.priceCents))
    : product.basePriceCents;

  const badgeText = product.specifications?.certificateAgency
    ? `${product.specifications.certificateAgency} Certified`
    : "Handcrafted to Order";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block relative bg-obsidian border border-neutral-800/80 hover:border-champagne/60 transition-all duration-500 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 4:5 Aspect Ratio Container */}
      <div className="relative aspect-[4/5] w-full bg-neutral-950 overflow-hidden">
        {/* Primary Hero Image */}
        <Image
          src={heroImage}
          alt={product.images[0]?.altText || product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-all duration-700 ${
            isHovered && sortedImages[1] ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        />

        {/* Secondary Profile Hover Image */}
        {sortedImages[1] && (
          <Image
            src={hoverImage}
            alt={sortedImages[1]?.altText || `${product.name} profile view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-all duration-700 ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          />
        )}

        {/* Subtle Dark Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent pointer-events-none" />

        {/* Top Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-block text-[10px] uppercase font-sans tracking-widest text-champagne-light bg-obsidian/85 backdrop-blur-md px-2.5 py-1 border border-neutral-700/80 rounded-sm">
            {badgeText}
          </span>
        </div>

        {/* Carat Weight Tag (if present) */}
        {Boolean(product.specifications?.caratTotalWeight) && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-block text-[10px] font-mono tracking-wider text-neutral-300 bg-obsidian/85 backdrop-blur-md px-2 py-1 border border-neutral-800 rounded-sm">
              {Number(product.specifications?.caratTotalWeight).toFixed(2)} CT
            </span>
          </div>
        )}
      </div>

      {/* Bottom Info Block */}
      <div className="p-5 space-y-3 bg-neutral-950/80 border-t border-neutral-900">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-sans block mb-1">
            {product.category.name}
          </span>
          <h3 className="font-serif text-lg text-alabaster group-hover:text-champagne transition-colors duration-200 line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Metal Color Indicator Swatches */}
        <div className="flex items-center space-x-1.5 pt-1">
          {availableMetals.map((metal) => {
            const swatch = METAL_SWATCH_COLORS[metal] || {
              bg: "bg-neutral-400",
              label: formatMetalType(metal),
              border: "border-neutral-500",
            };
            return (
              <span
                key={metal}
                title={swatch.label}
                className={`w-3.5 h-3.5 rounded-full ${swatch.bg} border ${swatch.border} shadow-sm inline-block transition-transform group-hover:scale-110`}
              />
            );
          })}
          {availableMetals.length > 0 && (
            <span className="text-[10px] text-neutral-400 pl-1 font-sans">
              {availableMetals.length > 1 ? `${availableMetals.length} Alloys` : formatMetalType(availableMetals[0])}
            </span>
          )}
        </div>

        {/* Price Row */}
        <div className="pt-2 border-t border-neutral-900 flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-wider text-neutral-400">
            From{" "}
            <span className="text-sm font-semibold font-sans text-champagne tracking-normal">
              {formatNaira(lowestPrice)}
            </span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 group-hover:text-champagne transition-colors">
            Configure →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
