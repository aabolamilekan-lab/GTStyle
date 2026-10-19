"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Gem,
  Sparkles,
  Layers,
  Check,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  MetalType,
  GemstoneType,
  DiamondCut,
  DiamondColor,
  DiamondClarity,
} from "@prisma/client";
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

interface GeneratedVariantRow {
  sku: string;
  metalType: MetalType;
  ringSize: number | null;
  priceNaira: string;
  stockQuantity: number;
}

const AVAILABLE_METALS: { label: string; value: MetalType; prefix: string }[] = [
  { label: "18K Yellow Gold", value: MetalType.YELLOW_GOLD_18K, prefix: "18KYG" },
  { label: "18K White Gold", value: MetalType.WHITE_GOLD_18K, prefix: "18KWG" },
  { label: "18K Rose Gold", value: MetalType.ROSE_GOLD_18K, prefix: "18KRG" },
  { label: "Platinum 950", value: MetalType.PLATINUM_950, prefix: "PL950" },
];

const STANDARD_RING_SIZES = [
  4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0,
];

export function ProductMatrixStudio({
  categories,
  collections,
}: ProductMatrixStudioProps) {
  const router = useRouter();

  // Core details
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [storyHtml, setStoryHtml] = useState("");
  const [basePriceNaira, setBasePriceNaira] = useState("4500000");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [collectionId, setCollectionId] = useState("");
  const [allowsCustomEngraving, setAllowsCustomEngraving] = useState(true);

  // Images
  const [primaryImageUrl, setPrimaryImageUrl] = useState(
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85"
  );
  const [secondaryImageUrl, setSecondaryImageUrl] = useState("");

  // Variant generator state
  const [selectedMetals, setSelectedMetals] = useState<MetalType[]>([
    MetalType.YELLOW_GOLD_18K,
    MetalType.WHITE_GOLD_18K,
    MetalType.PLATINUM_950,
  ]);
  const [hasRingSizes, setHasRingSizes] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([
    5.0, 5.5, 6.0, 6.5, 7.0, 7.5,
  ]);

  // Generated matrix rows
  const [matrixRows, setMatrixRows] = useState<GeneratedVariantRow[]>([]);

  // Gemological dossier state
  const [includeDossier, setIncludeDossier] = useState(true);
  const [gemstoneType, setGemstoneType] = useState<GemstoneType>(GemstoneType.DIAMOND_NATURAL);
  const [caratWeight, setCaratWeight] = useState("2.50");
  const [cutGrade, setCutGrade] = useState<DiamondCut>(DiamondCut.EXCELLENT);
  const [colorRating, setColorRating] = useState<DiamondColor>(DiamondColor.D);
  const [clarityGrade, setClarityGrade] = useState<DiamondClarity>(DiamondClarity.VVS1);
  const [certificateAgency, setCertificateAgency] = useState("GIA");
  const [certificateNumber, setCertificateNumber] = useState("GTS-GIA-99014");

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

  const toggleMetal = (m: MetalType) => {
    setSelectedMetals((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    );
  };

  const toggleSize = (sz: number) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((item) => item !== sz) : [...prev, sz]
    );
  };

  // Generate Cartesian Product Variant Matrix
  const handleGenerateMatrix = () => {
    if (selectedMetals.length === 0) {
      alert("Please select at least one precious metal alloy.");
      return;
    }

    const shortCode = slug ? slug.slice(0, 7).toUpperCase() : "PIECE";
    const generated: GeneratedVariantRow[] = [];

    selectedMetals.forEach((metal) => {
      const metalInfo = AVAILABLE_METALS.find((m) => m.value === metal);
      const metalPrefix = metalInfo?.prefix || "MET";

      if (hasRingSizes && selectedSizes.length > 0) {
        selectedSizes.forEach((sz) => {
          generated.push({
            sku: `GTS-${shortCode}-${metalPrefix}-SZ${sz.toFixed(1)}`,
            metalType: metal,
            ringSize: sz,
            priceNaira: basePriceNaira,
            stockQuantity: 2,
          });
        });
      } else {
        generated.push({
          sku: `GTS-${shortCode}-${metalPrefix}-STD`,
          metalType: metal,
          ringSize: null,
          priceNaira: basePriceNaira,
          stockQuantity: 2,
        });
      }
    });

    setMatrixRows(generated);
  };

  const handleUpdateRow = (
    index: number,
    field: keyof GeneratedVariantRow,
    value: unknown
  ) => {
    setMatrixRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDeleteRow = (index: number) => {
    setMatrixRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (matrixRows.length === 0) {
      setErrorMsg("Please generate at least one variant entry in the matrix.");
      return;
    }

    setIsSubmitting(true);

    try {
      const baseKobo = Math.round(Number(basePriceNaira) * 100);

      const images = [{ url: primaryImageUrl, altText: name, isHero: true, sortOrder: 0 }];
      if (secondaryImageUrl.trim()) {
        images.push({ url: secondaryImageUrl.trim(), altText: `${name} alternate view`, isHero: false, sortOrder: 1 });
      }

      const payload = {
        name,
        slug,
        description,
        storyHtml: storyHtml.trim() ? storyHtml : undefined,
        basePriceCents: baseKobo,
        categoryId,
        collectionId: collectionId.trim() ? collectionId : undefined,
        allowsCustomEngraving,
        images,
        variants: matrixRows.map((row) => ({
          sku: row.sku,
          metalType: row.metalType,
          ringSize: row.ringSize,
          priceCents: Math.round(Number(row.priceNaira) * 100),
          stockQuantity: Number(row.stockQuantity) || 1,
        })),
        specifications: includeDossier
          ? {
              gemstoneType,
              caratTotalWeight: caratWeight ? Number(caratWeight) : undefined,
              cut: cutGrade,
              color: colorRating,
              clarity: clarityGrade,
              certificateAgency,
              certificateNumber,
            }
          : undefined,
      };

      const result = await createProductWithVariants(payload);

      if (!result.success) {
        setErrorMsg(result.error || "Failed to save product.");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/products");
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Error creating product.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 max-w-5xl text-alabaster font-sans">
      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-200 text-xs rounded-sm flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Core Product Details */}
      <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded-sm space-y-6">
        <div className="flex items-center space-x-2.5 border-b border-neutral-800 pb-4">
          <Gem className="w-5 h-5 text-champagne" />
          <h2 className="font-serif text-xl text-alabaster font-medium tracking-wide">
            01. Core Product Details
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div className="sm:col-span-2 space-y-1">
            <label className="uppercase tracking-wider text-neutral-400 block font-medium">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Classic Gold Ring"
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm focus:outline-none focus:border-champagne"
            />
          </div>

          <div className="space-y-1">
            <label className="uppercase tracking-wider text-neutral-400 block font-medium">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm font-mono focus:outline-none focus:border-champagne"
            />
          </div>

          <div className="space-y-1">
            <label className="uppercase tracking-wider text-neutral-400 block font-medium">
              Base Starting Price (₦ NGN) *
            </label>
            <input
              type="number"
              required
              value={basePriceNaira}
              onChange={(e) => setBasePriceNaira(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm font-mono focus:outline-none focus:border-champagne"
            />
          </div>

          <div className="space-y-1">
            <label className="uppercase tracking-wider text-neutral-400 block font-medium">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm focus:outline-none focus:border-champagne"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="uppercase tracking-wider text-neutral-400 block font-medium">
              Collection (Optional)
            </label>
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm focus:outline-none focus:border-champagne"
            >
              <option value="">No Collection</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="uppercase tracking-wider text-neutral-400 block font-medium">
              Editorial Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Simple description of the product style and shine..."
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm focus:outline-none focus:border-champagne"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="uppercase tracking-wider text-neutral-400 block font-medium">
              Product Story HTML (Optional)
            </label>
            <textarea
              rows={2}
              value={storyHtml}
              onChange={(e) => setStoryHtml(e.target.value)}
              placeholder="<p>Crafted to shine and look beautiful on you...</p>"
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm font-mono focus:outline-none focus:border-champagne"
            />
          </div>

          <div className="sm:col-span-2 flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="engraving-toggle"
              checked={allowsCustomEngraving}
              onChange={(e) => setAllowsCustomEngraving(e.target.checked)}
              className="w-4 h-4 rounded-sm accent-[#D4AF37] cursor-pointer"
            />
            <label htmlFor="engraving-toggle" className="text-xs text-neutral-300 cursor-pointer">
              Allows Complimentary Laser Shank Engraving (up to 25 characters)
            </label>
          </div>
        </div>
      </div>

      {/* 2. Visual Photography Assets */}
      <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded-sm space-y-4">
        <h3 className="font-serif text-lg text-alabaster font-medium tracking-wide border-b border-neutral-800 pb-3">
          02. High-Resolution Visual Photography Assets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="uppercase tracking-wider text-neutral-400 block font-medium">
              Primary Hero Macro Photography URL *
            </label>
            <input
              type="url"
              required
              value={primaryImageUrl}
              onChange={(e) => setPrimaryImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm font-mono focus:outline-none focus:border-champagne"
            />
          </div>
          <div className="space-y-1">
            <label className="uppercase tracking-wider text-neutral-400 block font-medium">
              Secondary Profile Perspective URL (Optional)
            </label>
            <input
              type="url"
              value={secondaryImageUrl}
              onChange={(e) => setSecondaryImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm font-mono focus:outline-none focus:border-champagne"
            />
          </div>
        </div>
      </div>

      {/* 3. Dynamic Variant Matrix Generator */}
      <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded-sm space-y-6">
        <div className="flex items-center space-x-2.5 border-b border-neutral-800 pb-4">
          <Layers className="w-5 h-5 text-champagne" />
          <h2 className="font-serif text-xl text-alabaster font-medium tracking-wide">
            03. Dynamic Variant Matrix Generator
          </h2>
        </div>

        {/* Metal Checkboxes */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-neutral-400 block font-medium">
            Step A: Select Available Precious Metal Alloys
          </span>
          <div className="flex flex-wrap gap-2.5">
            {AVAILABLE_METALS.map((metal) => {
              const isChecked = selectedMetals.includes(metal.value);
              return (
                <button
                  type="button"
                  key={metal.value}
                  onClick={() => toggleMetal(metal.value)}
                  className={`px-3.5 py-2 text-xs rounded-sm border transition-all flex items-center space-x-2 ${
                    isChecked
                      ? "bg-neutral-900 border-champagne text-champagne"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                      isChecked ? "border-champagne bg-champagne text-obsidian" : "border-neutral-700"
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{metal.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ring Size Checkboxes */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
              Step B: Finger Sizes (US Standard)
            </span>
            <label className="flex items-center space-x-2 text-xs text-neutral-400 cursor-pointer">
              <input
                type="checkbox"
                checked={hasRingSizes}
                onChange={(e) => setHasRingSizes(e.target.checked)}
                className="w-4 h-4 rounded-sm accent-[#D4AF37]"
              />
              <span>Piece Requires Sizing (Rings & Solitaires)</span>
            </label>
          </div>

          {hasRingSizes && (
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
                        : "bg-neutral-900 border-neutral-800 text-neutral-400"
                    }`}
                  >
                    {sz.toFixed(1)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Generate Cartesian Product Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGenerateMatrix}
            className="px-6 py-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 hover:border-champagne text-champagne text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors shadow-md flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Cartesian Variant Matrix</span>
          </button>
        </div>

        {/* Editable Spreadsheet Grid */}
        {matrixRows.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="uppercase tracking-wider">
                Generated Variants ({matrixRows.length} Items)
              </span>
              <span className="font-mono text-[11px] text-champagne">
                Live Editable Grid
              </span>
            </div>

            <div className="overflow-x-auto border border-neutral-800 rounded-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3">SKU Identifier</th>
                    <th className="py-2.5 px-3">Metal / Finish</th>
                    <th className="py-2.5 px-3">Ring Size</th>
                    <th className="py-2.5 px-3">Price Point (₦)</th>
                    <th className="py-2.5 px-3">Stock Quantity</th>
                    <th className="py-2.5 px-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {matrixRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-900/30">
                      <td className="py-2 px-3 font-mono">
                        <input
                          type="text"
                          value={row.sku}
                          onChange={(e) => handleUpdateRow(idx, "sku", e.target.value)}
                          className="bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-2 py-1 rounded-sm w-44 font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 text-neutral-300">
                        {row.metalType}
                      </td>
                      <td className="py-2 px-3 font-mono text-neutral-300">
                        {row.ringSize !== null ? row.ringSize.toFixed(1) : "N/A"}
                      </td>
                      <td className="py-2 px-3 font-mono">
                        <input
                          type="number"
                          value={row.priceNaira}
                          onChange={(e) => handleUpdateRow(idx, "priceNaira", e.target.value)}
                          className="bg-neutral-900 border border-neutral-800 text-champagne text-xs px-2 py-1 rounded-sm w-32 font-mono font-semibold"
                        />
                      </td>
                      <td className="py-2 px-3 font-mono">
                        <input
                          type="number"
                          min={0}
                          value={row.stockQuantity}
                          onChange={(e) =>
                            handleUpdateRow(idx, "stockQuantity", parseInt(e.target.value, 10) || 0)
                          }
                          className="bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-2 py-1 rounded-sm w-20 font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(idx)}
                          className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 4. Gemological Dossier Section */}
      <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded-sm space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="font-serif text-lg text-alabaster font-medium tracking-wide">
            04. The 4Cs Gemological Dossier & Laboratory Certifications
          </h3>
          <label className="flex items-center space-x-2 text-xs text-neutral-400 cursor-pointer">
            <input
              type="checkbox"
              checked={includeDossier}
              onChange={(e) => setIncludeDossier(e.target.checked)}
              className="w-4 h-4 rounded-sm accent-[#D4AF37]"
            />
            <span>Include Gemstone Dossier</span>
          </label>
        </div>

        {includeDossier && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="uppercase tracking-wider text-neutral-400 block font-medium">
                Gemstone Variety
              </label>
              <select
                value={gemstoneType}
                onChange={(e) => setGemstoneType(e.target.value as GemstoneType)}
                className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm focus:outline-none focus:border-champagne"
              >
                {Object.values(GemstoneType).map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="uppercase tracking-wider text-neutral-400 block font-medium">
                Carat Weight (ct)
              </label>
              <input
                type="number"
                step="0.01"
                value={caratWeight}
                onChange={(e) => setCaratWeight(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm font-mono focus:outline-none focus:border-champagne"
              />
            </div>

            <div className="space-y-1">
              <label className="uppercase tracking-wider text-neutral-400 block font-medium">
                Cut Precision Grade
              </label>
              <select
                value={cutGrade}
                onChange={(e) => setCutGrade(e.target.value as DiamondCut)}
                className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm focus:outline-none focus:border-champagne"
              >
                {Object.values(DiamondCut).map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="uppercase tracking-wider text-neutral-400 block font-medium">
                Color Rating
              </label>
              <select
                value={colorRating}
                onChange={(e) => setColorRating(e.target.value as DiamondColor)}
                className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm focus:outline-none focus:border-champagne"
              >
                {Object.values(DiamondColor).map((c) => (
                  <option key={c} value={c}>
                    Grade {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="uppercase tracking-wider text-neutral-400 block font-medium">
                Clarity Grade
              </label>
              <select
                value={clarityGrade}
                onChange={(e) => setClarityGrade(e.target.value as DiamondClarity)}
                className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm focus:outline-none focus:border-champagne"
              >
                {Object.values(DiamondClarity).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="uppercase tracking-wider text-neutral-400 block font-medium">
                Laboratory Authority & ID
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={certificateAgency}
                  onChange={(e) => setCertificateAgency(e.target.value)}
                  placeholder="GIA / IGI"
                  className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm focus:outline-none focus:border-champagne uppercase font-mono"
                />
                <input
                  type="text"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  placeholder="Dossier #"
                  className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm focus:outline-none focus:border-champagne font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Submit Button */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-4 bg-champagne hover:bg-champagne-light text-obsidian text-xs uppercase tracking-widest font-semibold rounded-sm transition-all shadow-xl flex items-center space-x-2.5 disabled:opacity-75"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Product...</span>
            </>
          ) : (
            <>
              <span>Save Product</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ProductMatrixStudio;
