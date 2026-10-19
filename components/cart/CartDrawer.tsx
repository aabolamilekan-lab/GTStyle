"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { formatNaira, formatMetalType } from "@/lib/utils/format";

export function CartDrawer() {
  const isHydrated = useHydrated();
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const subtotalCents = useCartStore((state) => state.subtotalCents());
  const totalItemCount = useCartStore((state) => state.totalItemCount());

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isHydrated) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Slide-over Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative z-10 w-full max-w-md bg-obsidian border-l border-neutral-800 text-alabaster shadow-2xl flex flex-col h-full"
            role="dialog"
            aria-modal="true"
            aria-label="My Cart"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-neutral-800/80 bg-neutral-950/60">
              <div className="flex items-baseline space-x-2">
                <h2 className="font-serif text-lg sm:text-2xl tracking-wide text-champagne font-semibold">
                  My Cart
                </h2>
                <span className="text-[11px] sm:text-xs text-neutral-400 font-sans tracking-widest uppercase">
                  ({totalItemCount} {totalItemCount === 1 ? "Item" : "Items"})
                </span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-1.5 text-neutral-400 hover:text-champagne transition-colors rounded-full hover:bg-neutral-900"
                aria-label="Close Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 divide-y divide-neutral-900">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 border border-neutral-800">
                    <ShoppingBag className="w-8 h-8 stroke-[1.2] text-champagne/60" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-serif text-lg tracking-wide text-neutral-200">
                      Your cart is empty.
                    </p>
                    <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                      Explore our watches, necklaces, bracelets, and rings collection.
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-2 inline-flex items-center space-x-2 px-6 py-3 text-xs uppercase tracking-widest bg-champagne text-obsidian font-semibold hover:bg-champagne-light transition-colors duration-200 shadow-md"
                  >
                    <span>Start Shopping</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-5 sm:space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 flex space-x-3 sm:space-x-4">
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-neutral-900 border border-neutral-800 overflow-hidden rounded-sm">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="font-serif text-sm font-medium tracking-wide text-neutral-100 line-clamp-1">
                              {item.name}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-neutral-500 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                            SKU: {item.sku}
                          </p>

                          {/* Attributes Badges */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            <span className="inline-block text-[10px] tracking-wide px-1.5 py-0.5 bg-neutral-900 text-champagne border border-neutral-800 rounded-sm">
                              {formatMetalType(item.metalType)}
                            </span>
                            {item.ringSize !== null && (
                              <span className="inline-block text-[10px] tracking-wide px-1.5 py-0.5 bg-neutral-900 text-neutral-300 border border-neutral-800 rounded-sm">
                                Size: {Number(item.ringSize).toFixed(1)}
                              </span>
                            )}
                          </div>

                          {/* Engraving Preview */}
                          {item.engravingText && (
                            <div className="mt-1.5 text-xs text-champagne/90 italic font-serif">
                              “{item.engravingText}”
                            </div>
                          )}
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-900">
                          <span className="font-serif text-sm tracking-wide text-alabaster font-semibold">
                            {formatNaira(item.priceCents * item.quantity)}
                          </span>

                          <div className="flex items-center border border-neutral-800 bg-neutral-950 rounded-sm">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-neutral-400 hover:text-champagne transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-mono text-neutral-200">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-neutral-400 hover:text-champagne transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer (Fixed to bottom) */}
            {items.length > 0 && (
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-neutral-800 bg-neutral-950/80 space-y-3.5">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="uppercase text-xs tracking-widest text-neutral-400">
                    Subtotal
                  </span>
                  <span className="font-serif text-lg sm:text-xl text-champagne font-bold tracking-wide">
                    {formatNaira(subtotalCents)}
                  </span>
                </div>

                {/* Delivery Note */}
                <div className="flex items-center space-x-2 text-[11px] text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-champagne flex-shrink-0" />
                  <span>Safe delivery anywhere in Nigeria</span>
                </div>

                {/* Direct Bank Transfer Notice Callout */}
                <div className="p-3 bg-champagne/10 border border-champagne/30 rounded-sm text-xs text-neutral-300 leading-snug">
                  <p className="font-medium text-champagne-light mb-0.5">Pay By Bank Transfer</p>
                  You will make a simple bank transfer after checkout. No card needed.
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-champagne hover:bg-champagne-light text-obsidian font-semibold text-xs uppercase tracking-widest transition-colors duration-200 shadow-lg rounded-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
