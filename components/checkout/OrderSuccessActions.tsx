"use client";

import React from "react";
import { MessageCircle, Phone, Printer } from "lucide-react";
import { SELLER_CONFIG } from "@/config/seller";

interface OrderSuccessActionsProps {
  orderNumber: string;
  customerName: string;
  totalCents: number;
  requiredDeliveryDate: string;
}

export function OrderSuccessActions({
  orderNumber,
  customerName,
  totalCents,
  requiredDeliveryDate,
}: OrderSuccessActionsProps) {
  const formattedAmount = (totalCents / 100).toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedDate = new Date(requiredDeliveryDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const whatsappMessage = encodeURIComponent(
    `Hello GTStyle Atelier,\n\n` +
      `I just submitted an order on your website:\n` +
      `• Order Number: ${orderNumber}\n` +
      `• Customer Name: ${customerName}\n` +
      `• Total Amount: ₦${formattedAmount}\n` +
      `• Required Delivery Date: ${formattedDate}\n\n` +
      `I am reaching out to confirm the details and share my transfer payment receipt.`
  );

  const whatsappUrl = `https://wa.me/${SELLER_CONFIG.whatsappNumber}?text=${whatsappMessage}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Primary WhatsApp Deep-link */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2.5 py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-widest transition-all rounded-sm shadow-xl"
        >
          <MessageCircle className="w-5 h-5 flex-shrink-0" />
          <span>Confirm & Share Receipt on WhatsApp</span>
        </a>

        {/* Direct Telephone Call */}
        <a
          href={`tel:${SELLER_CONFIG.phone}`}
          className="flex items-center justify-center space-x-2.5 py-4 px-6 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-champagne text-alabaster hover:text-champagne font-semibold text-xs uppercase tracking-widest transition-all rounded-sm shadow-md"
        >
          <Phone className="w-4 h-4 flex-shrink-0" />
          <span>Call Atelier Concierge ({SELLER_CONFIG.phone})</span>
        </a>
      </div>

      {/* Print Utility */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-champagne transition-colors py-2 px-4 rounded-sm border border-neutral-800 hover:border-neutral-700 bg-neutral-950/40"
        >
          <Printer className="w-4 h-4" />
          <span>Print Official Order Receipt</span>
        </button>
      </div>
    </div>
  );
}

export default OrderSuccessActions;
