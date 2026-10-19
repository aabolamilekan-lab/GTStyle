"use client";

import React, { useState, useMemo } from "react";
import { MessageCircle, ShoppingBag, Ruler, Check, Sparkles } from "lucide-react";
import { MetalType } from "@prisma/client";
import { formatNaira, formatMetalType } from "@/lib/utils/format";
import { useCartStore } from "@/lib/store/cart";
import { SELLER_CONFIG } from "@/config/seller";
import { RingSizerModal } from "@/components/product/RingSizerModal";

export interface ConfiguratorVariant {
  id: string;
  sku: string;
  metalType: MetalType;
  ringSize: unknown;
  priceCents: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface ConfiguratorProduct {
  id: string;
  name: string;
  slug: string;
  basePriceCents: number;
  allowsCustomEngraving: boolean;
  maxEngravingLength?: number | null;
  category: {
    name: string;
    slug: string;
  };
  images: {
    url: string;
    altText: string;
    isHero: boolean;
  }[];
}

interface ProductConfiguratorProps {
  product: ConfiguratorProduct;
  variants: ConfiguratorVariant[];
}

const ALL_STANDARD_RING_SIZES = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];

const METAL_SWATCH_MAP: Record<string, { label: string; color: string; border: string }> = {
  YELLOW_GOLD_18K: { label: "18K Yellow Gold", color: "#E6CA65", border: "border-[#AA8A2A]" },
  YELLOW_GOLD_14K: { label: "14K Yellow Gold", color: "#DFBE53", border: "border-[#9E8224]" },
  WHITE_GOLD_18K: { label: "18K White Gold", color: "#D9D9D9", border: "border-[#B8BAC0]" },
  WHITE_GOLD_14K: { label: "14K White Gold", color: "#EAECEF", border: "border-[#C0C2C8]" },
  ROSE_GOLD_18K: { label: "18K Rose Gold", color: "#E8A598", border: "border-[#B06E59]" },
  ROSE_GOLD_14K: { label: "14K Rose Gold", color: "#E2A692", border: "border-[#B77764]" },
  PLATINUM_950: { label: "Platinum 950", color: "#A8A8A8", border: "border-[#808791]" },
  STERLING_SILVER_925: { label: "925 Silver", color: "#C4C8D0", border: "border-[#90949D]" },
};

export function ProductConfigurator({ product, variants }: ProductConfiguratorProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const isRing =
    product.category.slug === "rings" ||
    product.category.slug === "rings-solitaires" ||
    product.name.toLowerCase().includes("ring") ||
    product.name.toLowerCase().includes("band");

  // Distinct metals from variants
  const availableMetals = useMemo(() => {
    const set = new Set<MetalType>();
    variants.forEach((v) => set.add(v.metalType));
    return Array.from(set);
  }, [variants]);

  // Initial state
  const [selectedMetal, setSelectedMetal] = useState<MetalType>(
    availableMetals[0] || MetalType.YELLOW_GOLD_18K
  );

  const [selectedRingSize, setSelectedRingSize] = useState<number>(() => {
    if (!isRing) return 0;
    const firstSizeVariant = variants.find(
      (v) => v.metalType === (availableMetals[0] || MetalType.YELLOW_GOLD_18K) && v.ringSize !== null
    );
    return firstSizeVariant && firstSizeVariant.ringSize !== null
      ? Number(firstSizeVariant.ringSize)
      : 6.0;
  });

  const [isEngravingActive, setIsEngravingActive] = useState(false);
  const [engravingText, setEngravingText] = useState("");
  const [isRingSizerOpen, setIsRingSizerOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Dynamic active variant resolution
  const resolvedVariant = useMemo(() => {
    if (!isRing) {
      return variants.find((v) => v.metalType === selectedMetal) || variants[0];
    }

    // Matching metal and exact size
    const exactMatch = variants.find(
      (v) =>
        v.metalType === selectedMetal &&
        Number(v.ringSize) === Number(selectedRingSize)
    );

    if (exactMatch) return exactMatch;

    // Fallback to first variant matching metal
    return variants.find((v) => v.metalType === selectedMetal) || variants[0];
  }, [variants, selectedMetal, selectedRingSize, isRing]);

  // Check which sizes exist for the currently selected metal
  const sizesForCurrentMetal = useMemo(() => {
    const map = new Map<number, boolean>();
    variants
      .filter((v) => v.metalType === selectedMetal && v.ringSize !== null)
      .forEach((v) => {
        map.set(Number(v.ringSize), v.stockQuantity > 0);
      });
    return map;
  }, [variants, selectedMetal]);

  const activePriceCents = resolvedVariant?.priceCents || product.basePriceCents;
  const activeSku = resolvedVariant?.sku || product.slug.toUpperCase();
  const heroImage = product.images[0]?.url || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85";

  // Add to Cart handler
  const handleAddToVelvetBox = () => {
    if (!resolvedVariant) return;

    setIsAdding(true);

    addItem({
      variantId: resolvedVariant.id,
      productId: product.id,
      name: product.name,
      sku: resolvedVariant.sku,
      metalType: resolvedVariant.metalType,
      ringSize: isRing && resolvedVariant.ringSize !== null ? Number(resolvedVariant.ringSize) : null,
      priceCents: activePriceCents,
      image: heroImage,
      quantity: 1,
      engravingText: isEngravingActive && engravingText.trim() ? engravingText.trim() : undefined,
    });

    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 200);
  };

  const whatsappInquiryUrl = `https://wa.me/${SELLER_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    `Inquiring about ${product.name} (${activeSku}) - ${formatMetalType(selectedMetal)}${
      isRing ? `, Size US ${selectedRingSize}` : ""
    }`
  )}`;

  return (
    <div className="space-y-8 text-alabaster font-sans">
      {/* Price & SKU Header */}
      <div className="space-y-2 border-b border-neutral-800 pb-5">
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div className="flex items-baseline space-x-3">
            <span className="font-serif text-3xl sm:text-4xl text-champagne font-semibold tracking-wide transition-all duration-300">
              {formatNaira(activePriceCents)}
            </span>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
              Direct Transfer
            </span>
          </div>
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider bg-neutral-900 px-2.5 py-1 border border-neutral-800 rounded-sm">
            SKU: {activeSku}
          </span>
        </div>
        <p className="text-xs text-neutral-400">
          Price includes Nigerian VAT, insured armored transport, and complimentary lifetime cleaning.
        </p>
      </div>

      {/* 1. Metal Alloy Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="uppercase tracking-widest text-neutral-400 font-medium">
            Precious Metal Alloy:
          </span>
          <span className="text-champagne font-semibold">
            {formatMetalType(selectedMetal)}
          </span>
        </div>

        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {availableMetals.map((metal) => {
            const isSelected = selectedMetal === metal;
            const swatch = METAL_SWATCH_MAP[metal] || {
              label: formatMetalType(metal),
              color: "#D4AF37",
              border: "border-neutral-700",
            };

            return (
              <button
                key={metal}
                type="button"
                onClick={() => setSelectedMetal(metal)}
                className={`flex items-center space-x-2.5 p-2.5 sm:p-3 rounded-sm border text-left transition-all ${
                  isSelected
                    ? "bg-neutral-900 border-champagne text-champagne ring-1 ring-champagne/40 shadow-sm"
                    : "bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border ${swatch.border} flex-shrink-0 shadow-sm`}
                  style={{ backgroundColor: swatch.color }}
                />
                <span className="text-xs font-medium truncate">{swatch.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Ring Size Selector (if piece is a ring) */}
      {isRing && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs flex-wrap gap-1">
            <span className="uppercase tracking-widest text-neutral-400 font-medium">
              Select Finger Size (US):
            </span>
            <button
              type="button"
              onClick={() => setIsRingSizerOpen(true)}
              className="inline-flex items-center space-x-1 text-champagne hover:text-champagne-light underline underline-offset-4 transition-colors"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Find Your GTStyle Size</span>
            </button>
          </div>

          <div className="grid grid-cols-4 min-[420px]:grid-cols-5 sm:grid-cols-7 gap-1.5 sm:gap-2">
            {ALL_STANDARD_RING_SIZES.map((size) => {
              const isSelected = Number(selectedRingSize) === size;
              const hasStock = sizesForCurrentMetal.has(size);

              return (
                <button
                  key={size}
                  type="button"
                  disabled={!hasStock}
                  onClick={() => setSelectedRingSize(size)}
                  className={`py-2 px-1 text-xs font-mono rounded-sm border transition-all text-center ${
                    isSelected
                      ? "bg-champagne text-obsidian border-champagne font-bold shadow-md"
                      : hasStock
                      ? "bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-champagne/60 hover:text-alabaster"
                      : "bg-neutral-950/30 border-neutral-900 text-neutral-600 line-through cursor-not-allowed"
                  }`}
                  aria-label={`Select ring size ${size.toFixed(1)}`}
                >
                  {size.toFixed(1)}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-neutral-500">
            Selected size: <strong className="text-neutral-300">US {selectedRingSize.toFixed(1)}</strong>. Free resizing within 30 days of delivery.
          </p>
        </div>
      )}

      {/* 3. Laser Inscription Customization */}
      {product.allowsCustomEngraving && (
        <div className="space-y-3 pt-2 border-t border-neutral-800/80">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-xs uppercase tracking-wider text-neutral-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isEngravingActive}
                onChange={(e) => setIsEngravingActive(e.target.checked)}
                className="w-4 h-4 rounded-sm accent-[#D4AF37] cursor-pointer"
              />
              <span>Add Complimentary Laser Inscription</span>
            </label>
            <span className="text-[10px] uppercase tracking-widest text-champagne font-mono">
              Free Bespoke Service
            </span>
          </div>

          {isEngravingActive && (
            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>Inner Shank Inscription (Max 25 characters)</span>
                <span className="font-mono text-champagne">
                  {engravingText.length} / {product.maxEngravingLength || 25}
                </span>
              </div>

              <input
                type="text"
                maxLength={product.maxEngravingLength || 25}
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value)}
                placeholder="e.g. Forever Yours • 12.04.26 • ♡"
                className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-2.5 rounded-sm focus:outline-none focus:border-champagne placeholder:text-neutral-600"
              />

              {/* Live Preview Box */}
              {engravingText && (
                <div className="p-3 bg-obsidian border border-champagne/30 rounded-sm text-center">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-1">
                    Atelier Laser Preview:
                  </span>
                  <p className="font-serif italic text-champagne text-lg tracking-wide">
                    “{engravingText}”
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-neutral-800">
        {/* Add to Velvet Box Primary CTA */}
        <button
          type="button"
          onClick={handleAddToVelvetBox}
          disabled={isAdding}
          className="w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-champagne hover:bg-champagne-light text-obsidian font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center space-x-2.5 rounded-sm disabled:opacity-75"
        >
          <ShoppingBag className="w-4 h-4 stroke-[2]" />
          <span>{isAdding ? "Placing in Velvet Box..." : "Add to Velvet Box"}</span>
        </button>

        {/* WhatsApp Direct Studio Inquiry */}
        <a
          href={whatsappInquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 sm:py-3.5 px-4 sm:px-6 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/60 text-alabaster text-xs uppercase tracking-widest font-medium transition-all duration-300 flex items-center justify-center space-x-2.5 rounded-sm"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Inquire With Studio Concierge</span>
        </a>
      </div>

      {/* Trust Bullet Callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2 text-[11px] text-neutral-400">
        <div className="flex items-center space-x-2">
          <Check className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
          <span>Zero-Gateway Direct Settlement</span>
        </div>
        <div className="flex items-center space-x-2">
          <Check className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
          <span>GIA/IGI Laboratory Dossier</span>
        </div>
        <div className="flex items-center space-x-2">
          <Check className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
          <span>Armored Delivery Nationwide</span>
        </div>
        <div className="flex items-center space-x-2">
          <Check className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
          <span>Lifetime Ultrasonic Servicing</span>
        </div>
      </div>

      {/* Ring Sizer Modal */}
      <RingSizerModal
        isOpen={isRingSizerOpen}
        onClose={() => setIsRingSizerOpen(false)}
      />
    </div>
  );
}

export default ProductConfigurator;
