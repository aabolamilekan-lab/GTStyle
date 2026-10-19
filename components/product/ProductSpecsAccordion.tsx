"use client";

import React, { useState } from "react";
import { Sparkles, Shield, PackageCheck, CheckCircle2 } from "lucide-react";

interface ProductSpecsAccordionProps {
  specifications?: unknown;
  productName: string;
}

export function ProductSpecsAccordion({
  productName,
}: ProductSpecsAccordionProps) {
  const [openSection, setOpenSection] = useState<string>("quality");

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? "" : id));
  };

  return (
    <div className="border-t border-neutral-800 divide-y divide-neutral-800 font-sans">
      {/* 1. Quality & Sparkle */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection("quality")}
          className="w-full flex items-center justify-between text-left text-sm tracking-wider text-alabaster hover:text-champagne transition-colors py-2"
        >
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-champagne" />
            <span className="font-serif text-base font-medium tracking-wide">
              Quality & Sparkle
            </span>
          </div>
          <span className="text-champagne font-mono text-sm">
            {openSection === "quality" ? "−" : "+"}
          </span>
        </button>

        {openSection === "quality" && (
          <div className="pt-3 pb-2 space-y-3 text-xs text-neutral-300 leading-relaxed animate-in fade-in duration-200">
            <p>
              Every piece of {productName} is made to shine bright and look stunning.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>Super shiny stones that catch the light.</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>Hand-finished setting for extra durability.</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>Does not fade easily when cared for properly.</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>Tested for quality before we send to you.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Materials & Everyday Comfort */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection("materials")}
          className="w-full flex items-center justify-between text-left text-sm tracking-wider text-alabaster hover:text-champagne transition-colors py-2"
        >
          <div className="flex items-center space-x-2.5">
            <Shield className="w-4 h-4 text-champagne" />
            <span className="font-serif text-base font-medium tracking-wide">
              Material & Comfort
            </span>
          </div>
          <span className="text-champagne font-mono text-sm">
            {openSection === "materials" ? "−" : "+"}
          </span>
        </button>

        {openSection === "materials" && (
          <div className="pt-3 pb-2 space-y-3 text-xs text-neutral-300 leading-relaxed animate-in fade-in duration-200">
            <p>
              Designed for daily comfort. Light on your body and smooth on your skin.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>Safe for sensitive skin. No itchy feeling.</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>Smooth inner edges for comfortable everyday wear.</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>High-grade plating with long-lasting shine.</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>Strong clasp and prongs to keep stones secure.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Package & Safe Delivery */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection("delivery")}
          className="w-full flex items-center justify-between text-left text-sm tracking-wider text-alabaster hover:text-champagne transition-colors py-2"
        >
          <div className="flex items-center space-x-2.5">
            <PackageCheck className="w-4 h-4 text-champagne" />
            <span className="font-serif text-base font-medium tracking-wide">
              Packaging & Delivery
            </span>
          </div>
          <span className="text-champagne font-mono text-sm">
            {openSection === "delivery" ? "−" : "+"}
          </span>
        </button>

        {openSection === "delivery" && (
          <div className="pt-3 pb-2 space-y-3 text-xs text-neutral-300 leading-relaxed animate-in fade-in duration-200">
            <p>
              Your order comes packed with care, ready to wear or gift to someone special.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>Beautiful GTStyle luxury jewelry box.</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>Soft protective pouch for easy travel.</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>Simple jewelry care card with maintenance tips.</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>Fast and safe delivery across Nigeria.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductSpecsAccordion;
