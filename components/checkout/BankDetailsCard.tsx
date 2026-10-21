"use client";

import React, { useState } from "react";
import { Building2, Copy, Check, ShieldCheck, AlertCircle } from "lucide-react";
import { SELLER_CONFIG } from "@/config/seller";
import { formatNaira } from "@/lib/utils/format";

interface BankDetailsCardProps {
  orderNumber?: string;
  amountCents?: number;
  isCheckoutStep?: boolean;
}

export function BankDetailsCard({
  orderNumber,
  amountCents,
  isCheckoutStep = false,
}: BankDetailsCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  const handleCopyAll = () => {
    const fullText = isCheckoutStep
      ? `GTStyle Official Bank Account Details:\nBank: ${SELLER_CONFIG.bankDetails.bankName}\nAccount Name: ${SELLER_CONFIG.bankDetails.accountName}\nAccount Number: ${SELLER_CONFIG.bankDetails.accountNumber}${
          amountCents ? `\nAmount: ${formatNaira(amountCents)}` : ""
        }`
      : `GTStyle Official Bank Account Details:\nBank: ${SELLER_CONFIG.bankDetails.bankName}\nAccount Name: ${SELLER_CONFIG.bankDetails.accountName}\nAccount Number: ${SELLER_CONFIG.bankDetails.accountNumber}\nTransfer Reference/Narration: ${orderNumber || ""}`;

    copyToClipboard(fullText, "all");
  };

  return (
    <div className="border border-champagne/40 bg-neutral-950 p-4 sm:p-8 rounded-sm space-y-5 sm:space-y-6 text-alabaster shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3 sm:gap-4 border-b border-neutral-800 pb-4 sm:pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2 sm:p-2.5 rounded-sm bg-champagne/10 border border-champagne/30 text-champagne">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg sm:text-2xl text-alabaster tracking-wide font-medium">
              GTStyle Bank Account Details
            </h3>
            <p className="text-[11px] sm:text-xs text-neutral-400 font-sans mt-0.5">
              {isCheckoutStep
                ? "Transfer payment to this account, then click 'I HAVE PAID' below"
                : "Official payment account for GTStyle Fine Jewelry"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyAll}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-champagne text-champagne text-xs uppercase tracking-wider rounded-sm transition-colors"
        >
          {copiedField === "all" ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">All Details Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy All Details</span>
            </>
          )}
        </button>
      </div>

      {/* Account Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bank Name */}
        <div className="p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-sm space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-sans block">
            Bank Name
          </span>
          <span className="text-sm font-medium text-alabaster block">
            {SELLER_CONFIG.bankDetails.bankName}
          </span>
        </div>

        {/* Account Name */}
        <div className="p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-sm space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-sans block">
            Account Name
          </span>
          <span className="text-sm font-medium text-alabaster block">
            {SELLER_CONFIG.bankDetails.accountName}
          </span>
        </div>

        {/* Account Number with Quick Copy */}
        <div className="p-4 bg-neutral-900/90 border border-champagne/40 rounded-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-widest text-champagne font-sans block">
              NUBAN Account Number
            </span>
            <span className="font-mono text-lg font-bold text-champagne-light tracking-wider">
              {SELLER_CONFIG.bankDetails.accountNumber}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              copyToClipboard(SELLER_CONFIG.bankDetails.accountNumber, "accountNumber")
            }
            className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-champagne rounded-sm transition-colors"
            title="Copy Account Number"
            aria-label="Copy Account Number"
          >
            {copiedField === "accountNumber" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Instruction Note */}
      {isCheckoutStep ? (
        <div className="p-4 bg-champagne/10 border border-champagne/30 rounded-sm space-y-2">
          <div className="flex items-center space-x-2 text-champagne text-xs font-semibold tracking-wide uppercase">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>How to complete your order</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            1. Transfer the total amount ({amountCents ? <strong className="text-champagne">{formatNaira(amountCents)}</strong> : "due"}) to our bank account above.<br />
            2. After sending the payment from your banking app or USSD, click the <strong className="text-champagne">&quot;I HAVE PAID&quot;</strong> button below.<br />
            3. Your unique <strong className="text-champagne">Order Number</strong> will be generated immediately for tracking and receipt exchange on WhatsApp.
          </p>
        </div>
      ) : orderNumber ? (
        <div className="p-4 bg-champagne/10 border border-champagne/30 rounded-sm space-y-2">
          <div className="flex items-center space-x-2 text-champagne text-xs font-semibold tracking-wide uppercase">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Transfer Reference for Order #{orderNumber}</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Payment submitted for Order{" "}
            <strong className="text-champagne font-mono font-bold px-1.5 py-0.5 bg-obsidian rounded-sm border border-champagne/40">
              {orderNumber}
            </strong>
            . Please send your payment screenshot on WhatsApp to finalize verification.
          </p>
        </div>
      ) : null}

      <div className="flex items-center space-x-2 text-[11px] text-neutral-400 pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>Official verified business account of GTStyle.</span>
      </div>
    </div>
  );
}

export default BankDetailsCard;
