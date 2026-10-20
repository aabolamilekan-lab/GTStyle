"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { updateProduct } from "@/actions/admin";
import { useRouter } from "next/navigation";

export interface EditableProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePriceCents: number;
  isPublished: boolean;
  images: { id: string; url: string; altText: string; isHero: boolean }[];
  category: { id: string; name: string };
  variants: { id: string; priceCents: number }[];
}

interface EditProductModalProps {
  product: EditableProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LUXURY_PRESETS = [
  {
    name: "Diamond Ring",
    url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Luxury Watch",
    url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Emerald Pendant",
    url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Tennis Bracelet",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
  },
];

export function EditProductModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: EditProductModalProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [priceNaira, setPriceNaira] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [syncVariantPrices, setSyncVariantPrices] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Synchronize state when product changes or modal opens
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPriceNaira(Math.round(product.basePriceCents / 100).toString());
      const hero =
        product.images.find((img) => img.isHero)?.url ||
        product.images[0]?.url ||
        "";
      setImageUrl(hero);
      setDescription(product.description || "");
      setIsPublished(product.isPublished ?? true);
      setSyncVariantPrices(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      setImageError(false);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  // Formatted price preview
  const numericPrice = parseFloat(priceNaira.replace(/,/g, "")) || 0;
  const formattedPreview = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(numericPrice);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 8MB. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
        setImageError(false);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg("Product name is required.");
      return;
    }

    if (numericPrice <= 0) {
      setErrorMsg("Please enter a valid price greater than ₦0.");
      return;
    }

    if (!imageUrl.trim()) {
      setErrorMsg("Please provide an image link or upload a photo.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await updateProduct(product.id, {
        name: name.trim(),
        description: description.trim(),
        basePriceNaira: numericPrice,
        imageUrl: imageUrl.trim(),
        altText: name.trim(),
        isPublished,
        syncVariantPrices,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Failed to update product.");
        setIsSubmitting(false);
        return;
      }

      setSuccessMsg("Product updated successfully!");
      router.refresh();

      setTimeout(() => {
        setIsSubmitting(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1000);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-sm shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-champagne font-semibold">
              Edit Catalog Item
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-alabaster tracking-wide">
              Edit Product Details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-sm hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-red-950/40 border border-red-800/60 rounded-sm text-red-300 text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-sm text-emerald-300 text-xs flex items-center space-x-2.5">
              <Check className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Product Name */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium">
              Product Name <span className="text-champagne">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The GTStyle Royal Chrono Diamond Watch"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-sm px-4 py-2.5 text-sm text-alabaster placeholder-neutral-600 focus:outline-none focus:border-champagne transition-colors"
              required
            />
          </div>

          {/* Base Price (Naira) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium">
                Product Price (₦) <span className="text-champagne">*</span>
              </label>
              {numericPrice > 0 && (
                <span className="text-xs font-mono font-semibold text-champagne">
                  Current: {formattedPreview}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-serif">
                ₦
              </span>
              <input
                type="number"
                min="1"
                step="1000"
                value={priceNaira}
                onChange={(e) => setPriceNaira(e.target.value)}
                placeholder="e.g. 5200000"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-sm pl-8 pr-4 py-2.5 text-sm font-mono text-alabaster placeholder-neutral-600 focus:outline-none focus:border-champagne transition-colors"
                required
              />
            </div>
            <p className="text-[11px] text-neutral-500">
              Enter price in Naira. Stored securely in database as kobo (no floating-point rounding errors).
            </p>
          </div>

          {/* Sync Variant Prices Checkbox */}
          <div className="flex items-center space-x-2.5 p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-sm">
            <input
              type="checkbox"
              id="syncVariantPrices"
              checked={syncVariantPrices}
              onChange={(e) => setSyncVariantPrices(e.target.checked)}
              className="w-4 h-4 accent-champagne rounded-sm cursor-pointer"
            />
            <label
              htmlFor="syncVariantPrices"
              className="text-xs text-neutral-300 cursor-pointer select-none"
            >
              Update all variant options to this price ({product.variants.length} variant{product.variants.length === 1 ? "" : "s"})
            </label>
          </div>

          {/* Product Image Section */}
          <div className="space-y-3 pt-2 border-t border-neutral-900">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium flex items-center space-x-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-champagne" />
                <span>Product Image <span className="text-champagne">*</span></span>
              </label>
              <label className="cursor-pointer inline-flex items-center space-x-1 text-[11px] text-champagne hover:underline">
                <Upload className="w-3 h-3" />
                <span>Upload from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Preview Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              <div className="relative aspect-square w-full rounded-sm bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center">
                {imageUrl && !imageError ? (
                  // Using unoptimized standard img for reliable instant preview of base64/remote links
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="Preview"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 text-neutral-600 mx-auto mb-1" />
                    <span className="text-[10px] text-neutral-500">
                      {imageError ? "Image failed to load" : "No image preview"}
                    </span>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-neutral-400">
                    Paste Image Link (Unsplash, Cloudinary, AWS S3, etc.):
                  </span>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageError(false);
                    }}
                    placeholder="https://..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-sm px-3.5 py-2 text-xs text-alabaster placeholder-neutral-600 focus:outline-none focus:border-champagne font-mono transition-colors"
                  />
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-champagne" />
                    <span>Or Pick a Luxury Sample Photo:</span>
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {LUXURY_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setImageUrl(preset.url);
                          setImageError(false);
                        }}
                        className="text-left px-2.5 py-1.5 rounded-sm bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 hover:text-white transition-colors truncate"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-900">
            <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium">
              Product Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Simple description of this jewelry piece..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-sm px-4 py-2 text-xs text-alabaster placeholder-neutral-600 focus:outline-none focus:border-champagne transition-colors resize-none"
            />
          </div>

          {/* Store Visibility */}
          <div className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800 rounded-sm">
            <div>
              <div className="text-xs font-medium text-neutral-200">
                Visible in Shop
              </div>
              <div className="text-[11px] text-neutral-500">
                Turn off to hide this piece from customers without deleting it.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublished ? "bg-emerald-600" : "bg-neutral-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublished ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-neutral-800 bg-neutral-900/80">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-champagne hover:bg-champagne-light text-obsidian text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
