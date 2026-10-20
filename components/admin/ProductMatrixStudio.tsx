"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  Loader2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  X,
  Plus,
} from "lucide-react";
import { MetalType } from "@prisma/client";
import { createProductWithVariants } from "@/actions/admin";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface CollectionOption {
  id: string;
  name: string;
  slug: string;
}

interface ProductMatrixStudioProps {
  categories: CategoryOption[];
  collections: CollectionOption[];
}

const FINISH_OPTIONS: { label: string; value: MetalType; code: string }[] = [
  { label: "Gold Finish", value: MetalType.YELLOW_GOLD_18K, code: "GLD" },
  { label: "Silver Finish", value: MetalType.WHITE_GOLD_18K, code: "SLV" },
  { label: "Rose Gold Finish", value: MetalType.ROSE_GOLD_18K, code: "RGD" },
];

const STANDARD_RING_SIZES = [5, 6, 7, 8, 9, 10];

const SAMPLE_PHOTOS = [
  {
    name: "Luxury Watch",
    url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Diamond Ring",
    url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Gold Necklace",
    url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Tennis Bracelet",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85",
  },
];

export function ProductMatrixStudio({
  categories,
  collections,
}: ProductMatrixStudioProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [basePriceNaira, setBasePriceNaira] = useState("");
  const [stockQuantity, setStockQuantity] = useState("5");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [collectionId, setCollectionId] = useState("");
  const [description, setDescription] = useState("");
  const [allowsCustomEngraving, setAllowsCustomEngraving] = useState(false);

  // Images state
  const [primaryImage, setPrimaryImage] = useState<string>("");
  const [secondaryImage, setSecondaryImage] = useState<string>("");
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">("upload");
  const [primaryUrlInput, setPrimaryUrlInput] = useState("");

  // Simple Color / Finish selection
  const [selectedFinishes, setSelectedFinishes] = useState<MetalType[]>([
    MetalType.YELLOW_GOLD_18K,
  ]);

  // Ring Sizing
  const [hasRingSizes, setHasRingSizes] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([6, 7, 8]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-slug generator
  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );
  };

  // Toggle Finish
  const toggleFinish = (finish: MetalType) => {
    setSelectedFinishes((prev) => {
      if (prev.includes(finish)) {
        if (prev.length === 1) return prev; // keep at least 1 finish
        return prev.filter((item) => item !== finish);
      }
      return [...prev, finish];
    });
  };

  // Toggle Ring Size
  const toggleSize = (sz: number) => {
    setSelectedSizes((prev) => {
      if (prev.includes(sz)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== sz);
      }
      return [...prev, sz];
    });
  };

  // Handle Primary Image File Upload
  const handlePrimaryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose an image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Photo size is larger than 10MB. Please pick a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPrimaryImage(reader.result);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Secondary Image File Upload
  const handleSecondaryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose an image file (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSecondaryImage(reader.result);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Live formatted price preview
  const numericPrice = parseFloat(basePriceNaira.replace(/,/g, "")) || 0;
  const formattedPreview = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(numericPrice);

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!name.trim()) {
      setErrorMsg("Please enter a product name.");
      return;
    }

    if (numericPrice <= 0) {
      setErrorMsg("Please enter a valid price in Naira.");
      return;
    }

    const activeImage = primaryImage.trim() || primaryUrlInput.trim();
    if (!activeImage) {
      setErrorMsg("Please upload a product photo or provide an image link.");
      return;
    }

    if (selectedFinishes.length === 0) {
      setErrorMsg("Please select at least one color finish (e.g. Gold).");
      return;
    }

    setIsSubmitting(true);

    try {
      const baseKobo = Math.round(numericPrice * 100);
      const totalStock = parseInt(stockQuantity, 10) || 5;

      // Build images list
      const images = [
        {
          url: activeImage,
          altText: name.trim(),
          isHero: true,
          sortOrder: 0,
        },
      ];

      if (secondaryImage.trim()) {
        images.push({
          url: secondaryImage.trim(),
          altText: `${name.trim()} secondary view`,
          isHero: false,
          sortOrder: 1,
        });
      }

      // Automatically construct clean variants without requiring complex matrix builders
      const shortCode = (slug || name.slice(0, 5))
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 6);

      const variants: {
        sku: string;
        metalType: MetalType;
        ringSize: number | null;
        priceCents: number;
        stockQuantity: number;
      }[] = [];

      selectedFinishes.forEach((finish) => {
        const finishCode =
          FINISH_OPTIONS.find((f) => f.value === finish)?.code || "MET";

        if (hasRingSizes && selectedSizes.length > 0) {
          const perSizeStock = Math.max(1, Math.floor(totalStock / (selectedFinishes.length * selectedSizes.length))) || 1;
          selectedSizes.forEach((sz) => {
            variants.push({
              sku: `GTS-${shortCode}-${finishCode}-SZ${sz.toFixed(1)}`,
              metalType: finish,
              ringSize: sz,
              priceCents: baseKobo,
              stockQuantity: perSizeStock,
            });
          });
        } else {
          const perFinishStock = Math.max(1, Math.floor(totalStock / selectedFinishes.length)) || 1;
          variants.push({
            sku: `GTS-${shortCode}-${finishCode}-STD`,
            metalType: finish,
            ringSize: null,
            priceCents: baseKobo,
            stockQuantity: perFinishStock,
          });
        }
      });

      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || `${name.trim()} - Quality fashion jewelry by GTStyle.`,
        basePriceCents: baseKobo,
        categoryId,
        collectionId: collectionId.trim() ? collectionId : undefined,
        allowsCustomEngraving,
        images,
        variants,
      };

      const result = await createProductWithVariants(payload);

      if (!result.success) {
        setErrorMsg(result.error || "Failed to save product.");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(
        err instanceof Error ? err.message : "Error creating product."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl text-alabaster font-sans">
      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-200 text-xs rounded-sm flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Basic Product Info */}
      <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded-sm space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-champagne font-semibold">
            Step 1
          </span>
          <h2 className="font-serif text-xl text-alabaster font-light tracking-wide mt-0.5">
            Product Details
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          {/* Product Name */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="uppercase tracking-wider text-neutral-300 block font-medium">
              Product Name <span className="text-champagne">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Classic Gold Cuban Chain or Royal Diamond Watch"
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-sm p-3 rounded-sm focus:outline-none focus:border-champagne transition-colors"
            />
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="uppercase tracking-wider text-neutral-300 block font-medium">
                Price (₦) <span className="text-champagne">*</span>
              </label>
              {numericPrice > 0 && (
                <span className="text-xs font-mono font-semibold text-champagne">
                  {formattedPreview}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-serif text-sm">
                ₦
              </span>
              <input
                type="number"
                min="1"
                step="500"
                required
                value={basePriceNaira}
                onChange={(e) => setBasePriceNaira(e.target.value)}
                placeholder="e.g. 150000"
                className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-sm pl-8 pr-3 py-2.5 rounded-sm font-mono focus:outline-none focus:border-champagne transition-colors"
              />
            </div>
          </div>

          {/* Stock Quantity */}
          <div className="space-y-1.5">
            <label className="uppercase tracking-wider text-neutral-300 block font-medium">
              Stock Quantity Available
            </label>
            <input
              type="number"
              min="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              placeholder="5"
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-sm p-2.5 rounded-sm font-mono focus:outline-none focus:border-champagne transition-colors"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="uppercase tracking-wider text-neutral-300 block font-medium">
              Category <span className="text-champagne">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-sm p-2.5 rounded-sm focus:outline-none focus:border-champagne transition-colors cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Collection (Optional) */}
          <div className="space-y-1.5">
            <label className="uppercase tracking-wider text-neutral-300 block font-medium">
              Collection (Optional)
            </label>
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-sm p-2.5 rounded-sm focus:outline-none focus:border-champagne transition-colors cursor-pointer"
            >
              <option value="">No Collection</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="uppercase tracking-wider text-neutral-300 block font-medium">
              Product Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Simple description of how it looks, the design, and styling..."
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm focus:outline-none focus:border-champagne transition-colors resize-none"
            />
          </div>

          {/* Engraving toggle */}
          <div className="sm:col-span-2 flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="engraving-toggle"
              checked={allowsCustomEngraving}
              onChange={(e) => setAllowsCustomEngraving(e.target.checked)}
              className="w-4 h-4 rounded-sm accent-[#D4AF37] cursor-pointer"
            />
            <label
              htmlFor="engraving-toggle"
              className="text-xs text-neutral-300 cursor-pointer select-none"
            >
              Allow free custom name engraving (up to 25 letters)
            </label>
          </div>
        </div>
      </div>

      {/* 2. Upload Product Images (STAR FEATURE) */}
      <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-champagne font-semibold">
              Step 2
            </span>
            <h2 className="font-serif text-xl text-alabaster font-light tracking-wide mt-0.5">
              Product Photos
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setImageInputMode("upload")}
              className={`px-3 py-1 text-xs rounded-sm transition-colors ${
                imageInputMode === "upload"
                  ? "bg-champagne text-obsidian font-semibold"
                  : "bg-neutral-900 text-neutral-400 hover:text-white"
              }`}
            >
              Upload from Device
            </button>
            <button
              type="button"
              onClick={() => setImageInputMode("url")}
              className={`px-3 py-1 text-xs rounded-sm transition-colors ${
                imageInputMode === "url"
                  ? "bg-champagne text-obsidian font-semibold"
                  : "bg-neutral-900 text-neutral-400 hover:text-white"
              }`}
            >
              Paste Image Link
            </button>
          </div>
        </div>

        {/* Primary Image Upload Box */}
        <div className="space-y-3">
          <label className="uppercase tracking-wider text-xs text-neutral-300 block font-medium">
            Main Product Photo <span className="text-champagne">*</span>
          </label>

          {imageInputMode === "upload" ? (
            <div>
              {primaryImage ? (
                /* Uploaded Preview */
                <div className="relative aspect-[4/3] sm:aspect-[16/9] max-w-md rounded-sm bg-neutral-900 border border-neutral-800 overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={primaryImage}
                    alt="Product Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-champagne text-obsidian text-xs font-semibold rounded-sm hover:bg-champagne-light transition-colors"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrimaryImage("")}
                      className="px-3.5 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-sm hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                /* Drag & Drop Upload Zone */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-800 hover:border-champagne/60 bg-neutral-900/40 hover:bg-neutral-900/80 rounded-sm p-8 text-center cursor-pointer transition-all max-w-lg"
                >
                  <Upload className="w-10 h-10 text-champagne mx-auto mb-3" />
                  <div className="text-sm font-medium text-neutral-200">
                    Click to upload product photo
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Select a photo from your phone or computer (JPG, PNG, WebP)
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePrimaryFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            /* Paste URL Mode */
            <div className="space-y-3 max-w-lg">
              <input
                type="url"
                value={primaryUrlInput}
                onChange={(e) => {
                  setPrimaryUrlInput(e.target.value);
                  setPrimaryImage(e.target.value);
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm font-mono focus:outline-none focus:border-champagne"
              />
              {primaryUrlInput && (
                <div className="relative aspect-video w-full rounded-sm bg-neutral-900 border border-neutral-800 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={primaryUrlInput}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* Quick Luxury Sample Presets */}
          <div className="pt-2">
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider flex items-center space-x-1 mb-2">
              <Sparkles className="w-3 h-3 text-champagne" />
              <span>Or Choose a Sample Photo:</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_PHOTOS.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => {
                    setPrimaryImage(sample.url);
                    setPrimaryUrlInput(sample.url);
                  }}
                  className="px-3 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-champagne/40 rounded-sm text-xs text-neutral-300 hover:text-white transition-colors text-left truncate"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Image Upload (Optional) */}
        <div className="pt-4 border-t border-neutral-900 space-y-3">
          <label className="uppercase tracking-wider text-xs text-neutral-400 block font-medium">
            Second Photo (Optional Angle or Close-up)
          </label>

          {secondaryImage ? (
            <div className="relative aspect-[4/3] max-w-xs rounded-sm bg-neutral-900 border border-neutral-800 overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={secondaryImage}
                alt="Second View"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSecondaryImage("")}
                className="absolute top-2 right-2 p-1 bg-neutral-900/80 hover:bg-red-600 text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => secondaryFileInputRef.current?.click()}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-champagne rounded-sm text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Second Photo</span>
            </button>
          )}

          <input
            ref={secondaryFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleSecondaryFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* 3. Available Colors / Finishes (Simple Checkboxes, No Complex Matrices) */}
      <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded-sm space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-champagne font-semibold">
            Step 3
          </span>
          <h2 className="font-serif text-xl text-alabaster font-light tracking-wide mt-0.5">
            Color Finishes & Sizes
          </h2>
        </div>

        {/* Available Color Finishes */}
        <div className="space-y-2.5">
          <label className="text-xs uppercase tracking-wider text-neutral-300 block font-medium">
            Available Colors
          </label>
          <div className="flex flex-wrap gap-2.5">
            {FINISH_OPTIONS.map((finish) => {
              const isChecked = selectedFinishes.includes(finish.value);
              return (
                <button
                  type="button"
                  key={finish.value}
                  onClick={() => toggleFinish(finish.value)}
                  className={`px-4 py-2.5 text-xs rounded-sm border transition-all flex items-center space-x-2.5 ${
                    isChecked
                      ? "bg-neutral-900 border-champagne text-champagne font-medium"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                      isChecked
                        ? "border-champagne bg-champagne text-obsidian"
                        : "border-neutral-700"
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{finish.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-neutral-500">
            Customers will be able to choose between these colors on the product page.
          </p>
        </div>

        {/* Ring Sizes Toggle (Optional) */}
        <div className="space-y-3 pt-3 border-t border-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-neutral-200">
                Does this piece have ring sizes?
              </div>
              <div className="text-[11px] text-neutral-500">
                Turn on only for rings that require finger sizing.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHasRingSizes(!hasRingSizes)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                hasRingSizes ? "bg-champagne" : "bg-neutral-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-obsidian transition-transform ${
                  hasRingSizes ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {hasRingSizes && (
            <div className="space-y-2 pt-2 animate-fade-in">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-medium">
                Select Available Finger Sizes:
              </span>
              <div className="flex flex-wrap gap-2">
                {STANDARD_RING_SIZES.map((sz) => {
                  const isChecked = selectedSizes.includes(sz);
                  return (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`px-3 py-1.5 text-xs font-mono rounded-sm border transition-all ${
                        isChecked
                          ? "bg-champagne text-obsidian border-champagne font-bold"
                          : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      Size {sz}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-5 py-3 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3.5 bg-champagne hover:bg-champagne-light text-obsidian text-xs uppercase tracking-widest font-semibold rounded-sm transition-all shadow-xl flex items-center space-x-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Product...</span>
            </>
          ) : (
            <>
              <span>Save & Publish Product</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ProductMatrixStudio;
