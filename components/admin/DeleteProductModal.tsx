"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, Loader2, X } from "lucide-react";
import { deleteProduct } from "@/actions/admin";
import { formatNaira } from "@/lib/utils/format";
import { useRouter } from "next/navigation";
import { EditableProduct } from "./EditProductModal";

interface DeleteProductModalProps {
  product: EditableProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteProductModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: DeleteProductModalProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const heroImg =
    product.images.find((img) => img.isHero)?.url ||
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=85";

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);

    try {
      const res = await deleteProduct(product.id);
      if (!res.success) {
        setErrorMsg(res.error || "Failed to delete product.");
        setIsDeleting(false);
        return;
      }

      router.refresh();
      setIsDeleting(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <h2 className="font-serif text-lg text-alabaster tracking-wide">
              Delete Product
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

        {/* Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-sm text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center space-x-3.5 p-3.5 bg-neutral-900 border border-neutral-800 rounded-sm">
            <div className="relative w-14 h-14 rounded-sm bg-neutral-950 border border-neutral-850 overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImg}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="font-serif text-sm font-medium text-alabaster truncate">
                {product.name}
              </div>
              <div className="text-xs text-neutral-400">
                {product.category.name}
              </div>
              <div className="text-xs font-semibold text-champagne font-mono mt-0.5">
                {formatNaira(product.basePriceCents)}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-neutral-300 leading-relaxed">
            <p>
              Are you sure you want to remove <strong className="text-alabaster font-medium">{product.name}</strong>?
            </p>
            <p className="text-[11px] text-neutral-500">
              If this item has existing customer orders, it will be safely unlisted from the public store to protect order receipts and delivery records.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-neutral-800 bg-neutral-900/80">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors shadow-lg disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Product</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
