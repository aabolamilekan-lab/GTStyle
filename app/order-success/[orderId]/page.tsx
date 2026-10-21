import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Calendar, MapPin, Phone, User, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatNaira, formatMetalType } from "@/lib/utils/format";
import { BankDetailsCard } from "@/components/checkout/BankDetailsCard";
import { OrderSuccessActions } from "@/components/checkout/OrderSuccessActions";

export const dynamic = "force-dynamic";

interface OrderSuccessPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      deliveryAddress: true,
      user: true,
    },
  });

  if (!order) {
    notFound();
  }

  const formattedDate = new Date(order.requiredDeliveryDate).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-alabaster font-sans">
      {/* Header Banner */}
      <div className="text-center space-y-4 border-b border-neutral-800 pb-8">
        <div className="w-16 h-16 rounded-full bg-champagne/10 border border-champagne/40 flex items-center justify-center mx-auto text-champagne">
          <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs uppercase tracking-[0.3em] text-champagne font-sans">
            Payment Logged • Order Number Generated
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-alabaster font-light tracking-tight">
            Thank You For Your Order
          </h1>
          <p className="font-mono text-sm sm:text-base text-neutral-400">
            Your Official Order Number:{" "}
            <strong className="text-champagne font-bold text-lg sm:text-xl">
              {order.orderNumber}
            </strong>
          </p>
        </div>

        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
          Your payment has been logged and your order number is generated! Please click below to send your payment receipt on WhatsApp for instant order confirmation.
        </p>
      </div>

      {/* Official Bank Settlement Card */}
      <BankDetailsCard orderNumber={order.orderNumber} />

      {/* Direct WhatsApp / Call / Print Actions */}
      <OrderSuccessActions
        orderNumber={order.orderNumber}
        customerName={order.customerName}
        totalCents={order.totalCents}
        requiredDeliveryDate={order.requiredDeliveryDate.toISOString()}
      />

      {/* Order Overview Details Grid */}
      <div className="bg-neutral-950 border border-neutral-800 p-4 sm:p-8 rounded-sm space-y-5 sm:space-y-6">
        <h2 className="font-serif text-xl text-alabaster font-medium tracking-wide border-b border-neutral-800 pb-3">
          Order & Delivery Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          {/* Customer */}
          <div className="flex items-start space-x-3">
            <User className="w-4 h-4 text-champagne flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
                Customer Recipient
              </span>
              <p className="text-alabaster font-medium">{order.customerName}</p>
              <p className="text-neutral-400 font-mono">{order.customerEmail}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-start space-x-3">
            <Phone className="w-4 h-4 text-champagne flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
                Contact Telephone
              </span>
              <p className="text-alabaster font-mono font-medium">{order.customerPhone}</p>
              <p className="text-neutral-400">WhatsApp Dispatch Updates</p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="flex items-start space-x-3">
            <MapPin className="w-4 h-4 text-champagne flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
                Armored Delivery Destination
              </span>
              <p className="text-alabaster">{order.deliveryAddress.line1}</p>
              {order.deliveryAddress.line2 && (
                <p className="text-neutral-400">{order.deliveryAddress.line2}</p>
              )}
              <p className="text-neutral-400">
                {order.deliveryAddress.city}, {order.deliveryAddress.state}, Nigeria
              </p>
            </div>
          </div>

          {/* Required Delivery Date */}
          <div className="flex items-start space-x-3">
            <Calendar className="w-4 h-4 text-champagne flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
                  Required Delivery Date
                </span>
                <span className="px-1.5 py-0.2 text-[9px] uppercase tracking-wider bg-champagne/10 text-champagne border border-champagne/30 rounded-sm">
                  Priority Benchwork
                </span>
              </div>
              <p className="text-alabaster font-medium">{formattedDate}</p>
              <p className="text-neutral-400 text-[11px]">Handover signature required</p>
            </div>
          </div>
        </div>

        {order.orderNotes && (
          <div className="pt-4 border-t border-neutral-900 text-xs">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px] block mb-1">
              Client Order Notes / Inscription Instructions:
            </span>
            <p className="text-neutral-300 italic font-serif leading-relaxed">
              &quot;{order.orderNotes}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Itemized Order Breakdown Table */}
      <div className="bg-neutral-950 border border-neutral-800 p-4 sm:p-8 rounded-sm space-y-5 sm:space-y-6">
        <h2 className="font-serif text-xl text-alabaster font-medium tracking-wide border-b border-neutral-800 pb-3">
          Reserved Creations
        </h2>

        <div className="divide-y divide-neutral-900 text-xs">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-serif text-base text-alabaster font-medium">
                  {item.productNameSnapshot}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="text-champagne font-mono">
                    SKU: {item.skuSnapshot}
                  </span>
                  <span>•</span>
                  <span className="text-neutral-300">
                    {formatMetalType(item.metalTypeSnapshot)}
                  </span>
                  {item.ringSizeSnapshot !== null && (
                    <>
                      <span>•</span>
                      <span className="text-neutral-400 font-mono">
                        Size {Number(item.ringSizeSnapshot).toFixed(1)}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="text-neutral-400 font-mono">
                    Qty: {item.quantity}
                  </span>
                </div>

                {item.engravingText && (
                  <p className="text-[11px] text-champagne/90 italic font-serif">
                    Laser Inscription: “{item.engravingText}”
                  </p>
                )}
              </div>

              <div className="text-left sm:text-right flex-shrink-0">
                <span className="text-[10px] uppercase text-neutral-500 block">Unit: {formatNaira(item.unitPriceCents)}</span>
                <span className="font-serif text-base font-semibold text-champagne">
                  {formatNaira(item.totalPriceCents)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="pt-6 border-t border-neutral-800 space-y-3 text-xs">
          <div className="flex justify-between text-neutral-400">
            <span>Pieces Subtotal</span>
            <span className="font-mono text-alabaster">{formatNaira(order.subtotalCents)}</span>
          </div>

          <div className="flex justify-between text-neutral-400">
            <span>Delivery Across Nigeria</span>
            <span className="text-emerald-400 font-medium">Free (₦0)</span>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-widest text-neutral-300 font-medium">
              Total Amount Due
            </span>
            <span className="font-serif text-2xl sm:text-3xl text-champagne font-bold tracking-wide">
              {formatNaira(order.totalCents)}
            </span>
          </div>
        </div>
      </div>

      {/* Return to Shop Link */}
      <div className="text-center pt-4">
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-champagne transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
