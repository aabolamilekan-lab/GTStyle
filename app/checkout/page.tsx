"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ShieldCheck,
  Calendar,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { formatNaira, formatMetalType } from "@/lib/utils/format";
import { submitConciergeOrder } from "@/actions/order";

const NIGERIAN_STATES = [
  "Lagos",
  "Abuja FCT",
  "Rivers",
  "Oyo",
  "Kano",
  "Ogun",
  "Delta",
  "Edo",
  "Enugu",
  "Kaduna",
  "Anambra",
  "Akwa Ibom",
  "Ondo",
  "Osun",
  "Kwara",
  "Abia",
  "Imo",
  "Plateau",
  "Cross River",
  "Bayelsa",
  "Ekiti",
  "Benue",
  "Niger",
  "Bauchi",
  "Kogi",
  "Adamawa",
  "Sokoto",
  "Gombe",
  "Taraba",
  "Kebbi",
  "Jigawa",
  "Yobe",
  "Zamfara",
  "Katsina",
  "Nasarawa",
  "Ebonyi",
  "Borno",
];

export default function CheckoutPage() {
  const router = useRouter();
  const isHydrated = useHydrated();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotalCents = useCartStore((state) => state.subtotalCents());

  // Form Fields State
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Lagos",
    requiredDeliveryDate: "",
    orderNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic minimum date (strictly 24h lead time in the future)
  const minDeliveryDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage("Your velvet box is empty.");
      return;
    }

    if (!formData.requiredDeliveryDate) {
      setErrorMessage("Please select a required delivery date.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        city: formData.city,
        state: formData.state,
        requiredDeliveryDate: new Date(formData.requiredDeliveryDate),
        orderNotes: formData.orderNotes || undefined,
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          engravingText: item.engravingText,
        })),
      };

      const result = await submitConciergeOrder(orderPayload);

      if (!result.success || !result.orderId) {
        setErrorMessage(result.error || "An error occurred while creating your order.");
        setIsSubmitting(false);
        return;
      }

      // Clear the local cart upon successful database placement
      clearCart();

      // Navigate to order success screen
      router.push(`/order-success/${result.orderId}`);
    } catch (err: unknown) {
      console.error("Order submission failure:", err);
      setErrorMessage(err instanceof Error ? err.message : "Unexpected connection error.");
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-8 h-8 text-champagne animate-spin mx-auto" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-champagne/60">
          <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-alabaster font-light tracking-wide">
            Your Velvet Box is Empty
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Please curate your desired solitaire rings, tennis bracelets, or bespoke pendants before proceeding to concierge checkout.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 px-8 py-3.5 bg-champagne hover:bg-champagne-light text-obsidian text-xs uppercase tracking-widest font-semibold transition-all rounded-sm shadow-xl"
        >
          <span>Explore High Jewelry Vault</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="space-y-2 border-b border-neutral-800 pb-6">
        <span className="text-xs uppercase tracking-[0.25em] text-champagne font-sans">
          Zero-Gateway Atelier Settlement
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-alabaster font-light tracking-tight">
          Concierge Direct Checkout
        </h1>
        <p className="text-xs text-neutral-400">
          Complete your delivery details to lock in live vault inventory. No card credentials required.
        </p>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column (7 cols): Order Placement Form */}
        <div className="lg:col-span-7 space-y-8">
          {errorMessage && (
            <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-sm flex items-start space-x-3 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Customer Information */}
            <div className="space-y-4">
              <h2 className="font-serif text-lg text-alabaster tracking-wide font-medium flex items-center space-x-2">
                <span className="font-mono text-champagne text-xs">01.</span>
                <span>Client Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs uppercase tracking-wider text-neutral-400 font-sans block">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="e.g. Adebayo Adeleke"
                    className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-champagne"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-neutral-400 font-sans block">
                    Phone Number (WhatsApp Active) *
                  </label>
                  <input
                    type="tel"
                    required
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="e.g. 08012345678 or +234..."
                    className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-champagne"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-neutral-400 font-sans block">
                    Email Address (For Order Dossier) *
                  </label>
                  <input
                    type="email"
                    required
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="e.g. adebayo@example.com"
                    className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-champagne"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Details */}
            <div className="space-y-4 pt-4 border-t border-neutral-800/80">
              <h2 className="font-serif text-lg text-alabaster tracking-wide font-medium flex items-center space-x-2">
                <span className="font-mono text-champagne text-xs">02.</span>
                <span>Armored Delivery Address</span>
              </h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-neutral-400 font-sans block">
                    Street Address (Line 1) *
                  </label>
                  <input
                    type="text"
                    required
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="e.g. 14 Alexander Road, Ikoyi"
                    className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-champagne"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-neutral-400 font-sans block">
                    Suite / Floor / Landmark (Line 2 - Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="e.g. Penthouse Suite B, Opposite Palm Gardens"
                    className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-champagne"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-neutral-400 font-sans block">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Lagos Island / Victoria Island"
                      className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-champagne"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-neutral-400 font-sans block">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-champagne"
                    >
                      {NIGERIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Delivery Date & Lead Time */}
            <div className="space-y-4 pt-4 border-t border-neutral-800/80">
              <h2 className="font-serif text-lg text-alabaster tracking-wide font-medium flex items-center space-x-2">
                <span className="font-mono text-champagne text-xs">03.</span>
                <span>Mandatory Required Delivery Date</span>
              </h2>

              <div className="space-y-2">
                <label className="text-xs text-neutral-300 font-sans block">
                  When do you need this delivered? (Minimum 24h lead time for bespoke sizing & vault release) *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={minDeliveryDate}
                    name="requiredDeliveryDate"
                    value={formData.requiredDeliveryDate}
                    onChange={handleChange}
                    className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-champagne [color-scheme:dark]"
                  />
                </div>
                <p className="text-[11px] text-neutral-500">
                  Past dates and today&apos;s date are strictly restricted to safeguard master goldsmith benchwork quality.
                </p>
              </div>
            </div>

            {/* Section 4: Special Instructions */}
            <div className="space-y-2 pt-4 border-t border-neutral-800/80">
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-sans block">
                Special Instructions / Handwritten Gift Card Note (Optional)
              </label>
              <textarea
                name="orderNotes"
                rows={3}
                maxLength={500}
                value={formData.orderNotes}
                onChange={handleChange}
                placeholder="Include custom handover instructions or words for an enclosed bespoke gold foil greeting card..."
                className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-champagne"
              />
            </div>

            {/* Prominent Notice Callout Box */}
            <div className="p-5 bg-neutral-950 border border-champagne/40 rounded-sm space-y-2">
              <div className="flex items-center space-x-2 text-champagne font-semibold text-xs tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4 text-champagne" />
                <span>Direct Atelier Settlement</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                No credit or debit card is charged on this website. Upon submitting your order, GTStyle official bank account details will be presented. Transfers are verified manually before benchwork and armored dispatch.
              </p>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-champagne hover:bg-champagne-light text-obsidian font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center space-x-2.5 rounded-sm disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Securing Atelier Reservation...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Submit Order & View Bank Details</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column (5 cols): Order Review Summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded-sm space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="font-serif text-xl text-alabaster font-medium tracking-wide">
                Velvet Box Summary
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                {items.length} {items.length === 1 ? "Piece" : "Pieces"}
              </span>
            </div>

            {/* Item Rows */}
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 divide-y divide-neutral-900">
              {items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex space-x-3.5">
                  <div className="relative w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-sm overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-serif text-sm text-alabaster font-medium line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      <span className="text-champagne bg-neutral-900 px-1.5 py-0.5 border border-neutral-800">
                        {formatMetalType(item.metalType)}
                      </span>
                      {item.ringSize !== null && (
                        <span className="text-neutral-400 bg-neutral-900 px-1.5 py-0.5 border border-neutral-800 font-mono">
                          Size {Number(item.ringSize).toFixed(1)}
                        </span>
                      )}
                      <span className="text-neutral-400 bg-neutral-900 px-1.5 py-0.5 border border-neutral-800 font-mono">
                        Qty: {item.quantity}
                      </span>
                    </div>

                    {item.engravingText && (
                      <p className="text-[11px] text-champagne/90 italic font-serif">
                        Inscription: “{item.engravingText}”
                      </p>
                    )}

                    <div className="text-xs font-semibold text-alabaster font-serif pt-0.5">
                      {formatNaira(item.priceCents * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-3 pt-4 border-t border-neutral-800 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Pieces Subtotal</span>
                <span className="font-mono text-alabaster">{formatNaira(subtotalCents)}</span>
              </div>

              <div className="flex justify-between text-neutral-400">
                <span>Insured Armored Courier</span>
                <span className="text-emerald-400 font-medium">Complimentary (₦0)</span>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-widest text-neutral-300 font-medium">
                  Total Amount Due
                </span>
                <span className="font-serif text-2xl text-champagne font-bold tracking-wide">
                  {formatNaira(subtotalCents)}
                </span>
              </div>
            </div>

            {/* Trust Assurances */}
            <div className="p-3.5 bg-neutral-900/50 border border-neutral-800/80 rounded-sm space-y-2 text-[11px] text-neutral-400">
              <div className="flex items-center space-x-2 text-neutral-300">
                <CheckCircle className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>GIA/IGI authenticity dossier dispatched with piece</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-300">
                <CheckCircle className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>One-tap WhatsApp & phone outreach on confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
