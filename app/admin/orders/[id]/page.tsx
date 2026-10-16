import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  User,
  Shield,
  Gem,
  AlertTriangle,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatNaira, formatMetalType } from "@/lib/utils/format";
import { OrderDossierControls } from "@/components/admin/OrderDossierControls";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface OrderDossierPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDossierPage({ params }: OrderDossierPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      deliveryAddress: true,
      user: true,
    },
  });

  if (!order) {
    notFound();
  }

  // Delivery countdown calculation
  const now = new Date();
  const deadline = new Date(order.requiredDeliveryDate);
  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const formattedDeliveryDate = deadline.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // WhatsApp prefilled message
  const customerPhoneClean = order.customerPhone.replace(/[^0-9]/g, "");
  const internationalPhone = customerPhoneClean.startsWith("0")
    ? `234${customerPhoneClean.slice(1)}`
    : customerPhoneClean;

  const whatsappMessage = encodeURIComponent(
    `Hello ${order.customerName},\n\n` +
      `This is GTStyle Fine Jewelry Atelier regarding your commission #${order.orderNumber}.\n` +
      `We are preparing your piece for delivery scheduled for ${formattedDeliveryDate}.`
  );
  const whatsappUrl = `https://wa.me/${internationalPhone}?text=${whatsappMessage}`;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-champagne transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Order Intake</span>
        </Link>
        <span className="font-mono text-xs text-neutral-400">
          ID: {order.id}
        </span>
      </div>

      {/* Header Banner & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-champagne">
            Commission Dossier
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-alabaster font-light tracking-wide mt-1">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Created on {new Date(order.createdAt).toLocaleString("en-GB")}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Client</span>
          </a>

          <a
            href={`tel:${order.customerPhone}`}
            className="inline-flex items-center space-x-2 px-3.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-alabaster text-xs uppercase tracking-wider font-medium rounded-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call Recipient</span>
          </a>
        </div>
      </div>

      {/* Delivery Countdown Warning Banner */}
      <div
        className={`p-5 rounded-sm border flex items-center justify-between flex-wrap gap-4 ${
          diffDays <= 2
            ? "bg-red-950/30 border-red-800/80 text-red-200"
            : diffDays <= 5
            ? "bg-amber-950/30 border-amber-800/80 text-amber-200"
            : "bg-neutral-950 border-neutral-800 text-neutral-300"
        }`}
      >
        <div className="flex items-center space-x-3">
          {diffDays <= 2 ? (
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          ) : (
            <Clock className="w-5 h-5 text-champagne flex-shrink-0" />
          )}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider">
              Required Delivery Deadline: {formattedDeliveryDate}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              {diffDays > 0
                ? `${diffDays} days remaining for master goldsmith setting and armored courier dispatch.`
                : diffDays === 0
                ? "DUE TODAY for armored delivery handover!"
                : `DEADLINE EXCEEDED by ${Math.abs(diffDays)} days! Priority dispatch required.`}
            </p>
          </div>
        </div>

        <span className="font-mono text-sm uppercase px-3 py-1 bg-obsidian/80 border border-neutral-700 rounded-sm">
          {order.status.replace(/_/g, " ")}
        </span>
      </div>

      {/* Settlement & Production Controls */}
      <OrderDossierControls
        orderId={order.id}
        orderNumber={order.orderNumber}
        status={order.status}
        consignmentInfo={order.paymentProofUrl}
      />

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Profile Card */}
        <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-sm space-y-5">
          <h3 className="font-serif text-lg text-alabaster font-medium tracking-wide border-b border-neutral-800 pb-3 flex items-center space-x-2">
            <User className="w-4 h-4 text-champagne" />
            <span>Customer & Delivery Profile</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                Legal Recipient Name
              </span>
              <p className="text-alabaster font-medium text-sm mt-0.5">{order.customerName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                  Contact Phone
                </span>
                <p className="text-alabaster font-mono mt-0.5">{order.customerPhone}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                  Email Address
                </span>
                <p className="text-alabaster font-mono mt-0.5">{order.customerEmail}</p>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                Armored Destination Address
              </span>
              <p className="text-alabaster mt-0.5 leading-relaxed">
                {order.deliveryAddress.line1}
                {order.deliveryAddress.line2 && `, ${order.deliveryAddress.line2}`}
                <br />
                {order.deliveryAddress.city}, {order.deliveryAddress.state}, Nigeria
              </p>
            </div>

            {order.orderNotes && (
              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-sm">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Client Inscription / Handover Notes:
                </span>
                <p className="text-neutral-300 italic font-serif leading-relaxed">
                  &quot;{order.orderNotes}&quot;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Financial Summary Card */}
        <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-sm space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg text-alabaster font-medium tracking-wide border-b border-neutral-800 pb-3 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-champagne" />
              <span>Financial Settlement Details</span>
            </h3>

            <div className="space-y-4 text-xs pt-2">
              <div className="flex justify-between text-neutral-400">
                <span>Pieces Subtotal</span>
                <span className="font-mono text-alabaster">{formatNaira(order.subtotalCents)}</span>
              </div>

              <div className="flex justify-between text-neutral-400">
                <span>Insured Armored Courier</span>
                <span className="text-emerald-400 font-medium">Complimentary (₦0)</span>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-widest text-neutral-300 font-medium">
                  Total Commission Value
                </span>
                <span className="font-serif text-3xl text-champagne font-bold tracking-tight">
                  {formatNaira(order.totalCents)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-sm text-[11px] text-neutral-400">
            Payment Mode: <strong>Direct Corporate Bank Transfer</strong>. No card transaction fees charged.
          </div>
        </div>
      </div>

      {/* Itemized Benchwork Snapshot */}
      <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded-sm space-y-6">
        <h3 className="font-serif text-xl text-alabaster font-medium tracking-wide border-b border-neutral-800 pb-3 flex items-center space-x-2">
          <Gem className="w-4 h-4 text-champagne" />
          <span>Itemized Benchwork & Goldsmith Specifications</span>
        </h3>

        <div className="divide-y divide-neutral-900 text-xs">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-champagne rounded-sm">
                    {item.skuSnapshot}
                  </span>
                  <h4 className="font-serif text-base text-alabaster font-medium">
                    {item.productNameSnapshot}
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-neutral-300">
                  <span className="bg-neutral-900/80 px-2.5 py-1 border border-neutral-800 rounded-sm">
                    Alloy: <strong className="text-alabaster">{formatMetalType(item.metalTypeSnapshot)}</strong>
                  </span>

                  {item.ringSizeSnapshot !== null && (
                    <span className="bg-neutral-900/80 px-2.5 py-1 border border-neutral-800 rounded-sm font-mono">
                      Finger Size: <strong className="text-alabaster">US {Number(item.ringSizeSnapshot).toFixed(1)}</strong>
                    </span>
                  )}

                  <span className="bg-neutral-900/80 px-2.5 py-1 border border-neutral-800 rounded-sm font-mono">
                    Quantity: <strong className="text-alabaster">{item.quantity}</strong>
                  </span>
                </div>

                {item.engravingText && (
                  <div className="p-3 bg-obsidian border border-champagne/30 rounded-sm inline-block">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-0.5">
                      Laser Inscription Mandate:
                    </span>
                    <p className="font-serif italic text-champagne text-base">
                      “{item.engravingText}”
                    </p>
                  </div>
                )}
              </div>

              <div className="text-left sm:text-right flex-shrink-0">
                <span className="text-[10px] uppercase text-neutral-500 block">Unit Value</span>
                <span className="font-serif text-base font-semibold text-champagne">
                  {formatNaira(item.totalPriceCents)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
