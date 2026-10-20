"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Edit3,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
  PackageCheck,
  PlusCircle,
} from "lucide-react";
import { formatNaira } from "@/lib/utils/format";
import { EditProductModal, EditableProduct } from "./EditProductModal";
import { DeleteProductModal } from "./DeleteProductModal";

export interface AdminProductRow extends EditableProduct {
  createdAt?: string | Date;
  variants: {
    id: string;
    sku: string;
    metalType: string;
    ringSize?: unknown;
    priceCents: number;
    stockQuantity: number;
  }[];
}

interface AdminProductsTableProps {
  products: AdminProductRow[];
  categories: { id: string; name: string; slug: string }[];
}

const FALLBACK_JEWELRY_IMAGE =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=85";

export function AdminProductsTable({
  products,
  categories,
}: AdminProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Modal states
  const [editingProduct, setEditingProduct] = useState<EditableProduct | null>(
    null
  );
  const [deletingProduct, setDeletingProduct] = useState<EditableProduct | null>(
    null
  );

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesSlug = p.slug.toLowerCase().includes(query);
        const matchesCat = p.category.name.toLowerCase().includes(query);
        if (!matchesName && !matchesSlug && !matchesCat) return false;
      }

      // Category filter
      if (selectedCategory !== "ALL" && p.category.id !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus === "PUBLISHED" && !p.isPublished) return false;
      if (selectedStatus === "HIDDEN" && p.isPublished) return false;

      return true;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-4 font-sans">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-950 p-4 border border-neutral-800 rounded-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name, slug, or category..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-sm pl-10 pr-4 py-2 text-xs text-alabaster placeholder-neutral-500 focus:outline-none focus:border-champagne transition-colors"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-sm px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-champagne transition-colors cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-sm px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-champagne transition-colors cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="HIDDEN">Hidden / Draft</option>
          </select>

          {/* Count Badge */}
          <div className="hidden lg:flex items-center px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-xs font-mono text-champagne whitespace-nowrap">
            <span>{filteredProducts.length} of {products.length} Items</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/80 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4 font-medium text-champagne">Item</th>
                <th className="py-3.5 px-4 font-medium">Category</th>
                <th className="py-3.5 px-4 font-medium">Base Price</th>
                <th className="py-3.5 px-4 font-medium">Variants</th>
                <th className="py-3.5 px-4 font-medium">Total Stock</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    <p className="text-sm">No products found matching your search.</p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("ALL");
                        setSelectedStatus("ALL");
                      }}
                      className="mt-2 text-xs text-champagne hover:underline"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const heroImg =
                    product.images.find((img) => img.isHero)?.url ||
                    product.images[0]?.url ||
                    FALLBACK_JEWELRY_IMAGE;

                  const totalStock = product.variants.reduce(
                    (sum, v) => sum + v.stockQuantity,
                    0
                  );

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-neutral-900/40 transition-colors group"
                    >
                      {/* Item Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-sm bg-neutral-900 border border-neutral-800 overflow-hidden flex-shrink-0 group-hover:border-champagne/40 transition-colors">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={heroImg}
                              alt={product.name}
                              onError={(e) => {
                                // Fallback seamlessly on broken remote image links
                                (e.target as HTMLImageElement).src =
                                  FALLBACK_JEWELRY_IMAGE;
                              }}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <div className="font-serif text-sm font-medium text-alabaster truncate">
                              {product.name}
                            </div>
                            <div className="text-[10px] text-neutral-500 font-mono truncate">
                              slug: {product.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-neutral-300 whitespace-nowrap">
                        {product.category.name}
                      </td>

                      {/* Base Price */}
                      <td className="py-3.5 px-4 font-serif font-semibold text-champagne text-sm whitespace-nowrap">
                        {formatNaira(product.basePriceCents)}
                      </td>

                      {/* Variants */}
                      <td className="py-3.5 px-4 font-mono text-neutral-300 whitespace-nowrap">
                        {product.variants.length} Matrix Entries
                      </td>

                      {/* Total Stock */}
                      <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                        <span
                          className={
                            totalStock > 0
                              ? "text-emerald-400 font-medium"
                              : "text-red-400 font-semibold"
                          }
                        >
                          {totalStock} units
                        </span>
                      </td>

                      {/* Published Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {product.isPublished ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-neutral-900 text-neutral-400 border border-neutral-800">
                            <EyeOff className="w-3 h-3" />
                            <span>Hidden</span>
                          </span>
                        )}
                      </td>

                      {/* Actions: Edit, Delete, View */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => setEditingProduct(product)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-champagne hover:text-champagne-light border border-neutral-800 hover:border-champagne/40 rounded-sm text-xs transition-colors"
                            title="Edit image, price, or details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingProduct(product)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-neutral-900 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-900/50 rounded-sm text-xs transition-colors"
                            title="Delete or unlist product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>

                          {/* View Customer Link */}
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="inline-flex items-center space-x-1 px-2 py-1.5 text-neutral-400 hover:text-white transition-colors"
                            title="Open live product page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="sr-only sm:not-sr-only text-xs">View</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
      />

      {/* Delete Modal */}
      <DeleteProductModal
        product={deletingProduct}
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
      />
    </div>
  );
}
