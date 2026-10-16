"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryImage {
  id: string;
  url: string;
  altText: string;
  isHero?: boolean;
  sortOrder?: number;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const displayImages = images.length > 0
    ? images
    : [
        {
          id: "fallback",
          url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85",
          altText: productName,
        },
      ];

  const currentImage = displayImages[activeIndex] || displayImages[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 items-start">
      {/* Left Column: Vertical Thumbnail Strip (Desktop) */}
      {displayImages.length > 1 && (
        <div className="hidden lg:flex flex-col space-y-3 w-20 flex-shrink-0 max-h-[580px] overflow-y-auto pr-1">
          {displayImages.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-square w-full bg-neutral-900 border rounded-sm overflow-hidden transition-all duration-200 ${
                  isActive
                    ? "border-champagne ring-1 ring-champagne shadow-md"
                    : "border-neutral-800 opacity-60 hover:opacity-100"
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={img.url}
                  alt={img.altText || `${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Center Viewport: Interactive 2.5x Zoom Viewer */}
      <div className="relative flex-1 w-full bg-neutral-950 border border-neutral-800/80 rounded-sm overflow-hidden">
        <div
          ref={imageContainerRef}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          className="relative aspect-square w-full overflow-hidden cursor-crosshair select-none"
        >
          {/* Main Display Image */}
          <Image
            src={currentImage.url}
            alt={currentImage.altText || productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-150 ease-out will-change-transform"
            style={{
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transform: isZoomed ? "scale(2.5)" : "scale(1)",
            }}
          />

          {/* Macro Zoom Badge */}
          <div className="absolute bottom-3 right-3 z-10 pointer-events-none hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-obsidian/85 backdrop-blur-md border border-neutral-700/80 rounded-sm text-[10px] text-champagne uppercase tracking-wider font-sans">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>{isZoomed ? "2.5x Macro Inspection" : "Hover to Magnify (2.5x)"}</span>
          </div>

          {/* Mobile Arrows */}
          {displayImages.length > 1 && (
            <div className="lg:hidden absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-full bg-obsidian/70 backdrop-blur-sm text-alabaster pointer-events-auto border border-neutral-700 hover:text-champagne transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-full bg-obsidian/70 backdrop-blur-sm text-alabaster pointer-events-auto border border-neutral-700 hover:text-champagne transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Indicator Dots */}
        {displayImages.length > 1 && (
          <div className="lg:hidden flex items-center justify-center space-x-2 py-3 bg-neutral-950 border-t border-neutral-900">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeIndex ? "bg-champagne w-5" : "bg-neutral-700"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductGallery;
