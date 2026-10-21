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
  ArrowLeft,
  Building2,
  Check,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { formatNaira, formatMetalType } from "@/lib/utils/format";
import { submitConciergeOrder } from "@/actions/order";
import { BankDetailsCard } from "@/components/checkout/BankDetailsCard";

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

  // Step state: 'details' (Step 1) -> 'payment' (Step 2)
  const [step, setStep] = useState<"details" | "payment">("details");

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
    senderPaymentReference: "",
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

  // Step 1: Validate details and advance to Bank Payment step
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      setErrorMessage("Please enter your full legal name.");
      return;
    }

    const phoneClean = formData.customerPhone.trim();
    const phoneValid = /^(\+234|0)[789][01]\d{8}$/.test(phoneClean);
    if (!phoneValid) {
      setErrorMessage(
        "Please provide a valid Nigerian phone number (e.g. 08012345678 or +2348012345678)."
      );
      return;
    }

    if (!formData.customerEmail.trim() || !formData.customerEmail.includes("@")) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    if (!formData.addressLine1.trim() || formData.addressLine1.trim().length < 5) {
      setErrorMessage("Please enter a detailed delivery address (min 5 characters).");
      return;
    }

    if (!formData.city.trim()) {
      setErrorMessage("Please enter your delivery city.");
      return;
    }

    if (!formData.requiredDeliveryDate) {
      setErrorMessage("Please select your required delivery date.");
      return;
    }

    // Advance to payment step
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2: Customer clicks "I HAVE PAID" -> Generate Order Number & record order
  const handleConfirmPaidAndGenerateOrder = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail.trim(),
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2 ? formData.addressLine2.trim() : undefined,
        city: formData.city.trim(),
        state: formData.state,
        requiredDeliveryDate: new Date(formData.requiredDeliveryDate),
        orderNotes: formData.orderNotes ? formData.orderNotes.trim() : undefined,
        senderPaymentReference: formData.senderPaymentReference
          ? formData.senderPaymentReference.trim()
          : undefined,
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

      // Navigate to order success screen with generated Order Number
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
            Your Cart is Empty
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Please add your desired jewelry or watches to your cart before proceeding to checkout.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 px-8 py-3.5 bg-champagne hover:bg-champagne-light text-obsidian text-xs uppercase tracking-widest font-semibold transition-all rounded-sm shadow-xl"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="space-y-3 border-b border-neutral-800 pb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-champagne font-sans">
              Direct Bank Transfer Atelier
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-alabaster font-light tracking-tight mt-1">
              {step === "details" ? "Delivery Information" : "Bank Transfer & Payment"}
            </h1>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center space-x-2 text-xs">
            <button
              type="button"
              onClick={() => setStep("details")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-sm transition-colors ${
                step === "details"
                  ? "bg-champagne text-obsidian font-semibold"
                  : "bg-neutral-900 text-neutral-400 hover:text-alabaster"
              }`}
            >
              <span className="font-mono">1.</span>
              <span>Details</span>
              {step === "payment" && <Check className="w-3.5 h-3.5 ml-1 text-emerald-400" />}
            </button>

            <span className="text-neutral-600">→</span>

            <div
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-sm ${
                step === "payment"
                  ? "bg-champagne text-obsidian font-semibold"
                  : "bg-neutral-900 text-neutral-500"
              }`}
            >
              <span className="font-mono">2.</span>
              <span>Pay & Generate Order #</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-400">
          {step === "details"
            ? "Enter your delivery destination and select your desired handover date."
            : "Transfer the order total to our verified bank account and click 'I HAVE PAID' to generate your Order Number."}
        </p>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column (7 cols): Flow Step */}
        <div className="lg:col-span-7 space-y-8">
          {errorMessage && (
            <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-sm flex items-start space-x-3 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= STEP 1: DELIVERY & CONTACT FORM ================= */}
          {step === "details" && (
            <form onSubmit={handleProceedToPayment} className="space-y-8">
              {/* Section 1: Customer Information */}
              <div className="space-y-4">
                <h2 className="font-serif text-lg text-alabaster tracking-wide font-medium flex items-center space-x-2">
                  <span className="font-mono text-champagne text-xs">01.</span>
                  <span>Your Contact Information</span>
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
                      Email Address (For Order Updates) *
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
                  <span>Delivery Address</span>
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
                      Suite / Landmark (Optional)
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
                        placeholder="e.g. Lagos Island / Lekki / Ikeja"
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
                  <span>Required Delivery Date</span>
                </h2>

                <div className="space-y-2">
                  <label className="text-xs text-neutral-300 font-sans block">
                    When do you want this delivered? (Minimum 24 hours lead time) *
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
                    We require at least 24 hours to inspect, package, and arrange your insured delivery.
                  </p>
                </div>
              </div>

              {/* Section 4: Special Instructions */}
              <div className="space-y-2 pt-4 border-t border-neutral-800/80">
                <label className="text-xs uppercase tracking-wider text-neutral-400 font-sans block">
                  Gift Note or Special Instructions (Optional)
                </label>
                <textarea
                  name="orderNotes"
                  rows={2}
                  maxLength={500}
                  value={formData.orderNotes}
                  onChange={handleChange}
                  placeholder="Write any special message or packaging request..."
                  className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-champagne"
                />
              </div>

              {/* Next Step CTA */}
              <button
                type="submit"
                className="w-full py-4 px-6 bg-champagne hover:bg-champagne-light text-obsidian font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center space-x-2.5 rounded-sm"
              >
                <span>Proceed to Bank Transfer Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ================= STEP 2: BANK TRANSFER & "I HAVE PAID" ================= */}
          {step === "payment" && (
            <div className="space-y-6">
              {/* Delivery Recipient Quick Summary */}
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-sm flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                    Delivering to:
                  </span>
                  <p className="text-alabaster font-medium">
                    {formData.customerName} ({formData.customerPhone})
                  </p>
                  <p className="text-neutral-400 text-[11px]">
                    {formData.addressLine1}, {formData.city}, {formData.state} • Due:{" "}
                    {new Date(formData.requiredDeliveryDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="text-xs text-champagne hover:underline inline-flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Official Bank Account Details Component */}
              <BankDetailsCard isCheckoutStep={true} amountCents={subtotalCents} />

              {/* Optional: Sender Account Name / Reference */}
              <div className="p-4 sm:p-6 bg-neutral-950 border border-neutral-800 rounded-sm space-y-3">
                <label className="text-xs uppercase tracking-wider text-alabaster font-medium block">
                  Sender Account Name or Bank (Optional)
                </label>
                <input
                  type="text"
                  name="senderPaymentReference"
                  value={formData.senderPaymentReference}
                  onChange={handleChange}
                  placeholder="e.g. Paid from Adebayo Adeleke / GTBank"
                  className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-champagne"
                />
                <p className="text-[11px] text-neutral-400">
                  Providing your transfer sender name helps our team match your payment instantly.
                </p>
              </div>

              {/* PRIMARY "I HAVE PAID" ACTION BUTTON */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmPaidAndGenerateOrder}
                  disabled={isSubmitting}
                  className="w-full py-4 sm:py-5 px-6 bg-champagne hover:bg-champagne-light text-obsidian font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-2xl flex items-center justify-center space-x-2.5 rounded-sm disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating Order Number & Recording Payment...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 text-obsidian" />
                      <span>I HAVE PAID — GENERATE ORDER NUMBER</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-neutral-400">
                  Click after completing your bank transfer. Your official Order Number will be generated immediately for WhatsApp verification.
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="inline-flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-champagne transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Delivery Details</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Order Review Summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="bg-neutral-950 border border-neutral-800 p-4 sm:p-8 rounded-sm space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="font-serif text-xl text-alabaster font-medium tracking-wide">
                Order Summary
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                {items.length} {items.length === 1 ? "Item" : "Items"}
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
                <span>Items Subtotal</span>
                <span className="font-mono text-alabaster">{formatNaira(subtotalCents)}</span>
              </div>

              <div className="flex justify-between text-neutral-400">
                <span>Delivery Across Nigeria</span>
                <span className="text-emerald-400 font-medium">Free (₦0)</span>
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
                <span>Quality checked before delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-300">
                <CheckCircle className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                <span>Direct WhatsApp and phone support anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
