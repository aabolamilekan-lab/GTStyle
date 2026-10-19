"use client";

import React, { useState } from "react";
import { OrderStatus } from "@prisma/client";
import {
  CheckCircle2,
  Hammer,
  Truck,
  Check,
  Loader2,
  AlertCircle,
  Package,
} from "lucide-react";
import { confirmBankTransfer, updateOrderStatus } from "@/actions/admin";

interface OrderDossierControlsProps {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  consignmentInfo?: string | null;
}

export function OrderDossierControls({
  orderId,
  orderNumber,
  status,
  consignmentInfo,
}: OrderDossierControlsProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showShipModal, setShowShipModal] = useState(false);
  const [consignmentRef, setConsignmentRef] = useState("");

  const handleConfirmTransfer = async () => {
    if (!confirm(`Confirm that bank transfer payment has been received for order ${orderNumber}? This will automatically deduct stock inventory.`)) {
      return;
    }

    setLoadingAction("confirm");
    setErrorMsg(null);

    const res = await confirmBankTransfer(orderId);
    if (!res.success) {
      setErrorMsg(res.error || "Failed to confirm bank transfer.");
    }
    setLoadingAction(null);
  };

  const handleAdvanceStatus = async (newStatus: OrderStatus, tracking?: string) => {
    setLoadingAction(newStatus);
    setErrorMsg(null);

    const res = await updateOrderStatus(orderId, newStatus, tracking);
    if (!res.success) {
      setErrorMsg(res.error || "Failed to advance order status.");
    }
    setLoadingAction(null);
    setShowShipModal(false);
  };

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-red-950/40 border border-red-800 text-red-200 text-xs rounded-sm flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Manual Settlement Confirmation Card (Only when Awaiting Payment) */}
      {status === "AWAITING_PAYMENT" && (
        <div className="p-5 bg-amber-950/20 border border-amber-500/40 rounded-sm space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Bank Transfer Verification Required</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Verify funds matching the invoice in the GTStyle GTBank corporate account before advancing to benchwork. Confirming payment will atomically decrement physical variant inventory.
          </p>
          <button
            type="button"
            disabled={loadingAction === "confirm"}
            onClick={handleConfirmTransfer}
            className="w-full sm:w-auto py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs uppercase tracking-widest rounded-sm transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-75"
          >
            {loadingAction === "confirm" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Reconciling & Deducting Inventory...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Bank Transfer (Lock Order)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Production Pipeline Stepper */}
      <div className="p-5 bg-neutral-950 border border-neutral-800 rounded-sm space-y-4">
        <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-sans block">
          Production Pipeline Stepper
        </span>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status 1: Advance to CRAFTING */}
          {status === "PAYMENT_CONFIRMED" && (
            <button
              type="button"
              disabled={loadingAction === "CRAFTING"}
              onClick={() => handleAdvanceStatus("CRAFTING")}
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-all flex items-center space-x-2"
            >
              {loadingAction === "CRAFTING" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Hammer className="w-3.5 h-3.5" />
              )}
              <span>Assign to Jeweler (Begin Crafting)</span>
            </button>
          )}

          {/* Status 2: Advance to SHIPPED */}
          {status === "CRAFTING" && (
            <button
              type="button"
              onClick={() => setShowShipModal(true)}
              className="py-2.5 px-5 bg-purple-600 hover:bg-purple-500 text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-all flex items-center space-x-2"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Log Armored Consignment & Dispatch</span>
            </button>
          )}

          {/* Status 3: Advance to DELIVERED */}
          {status === "SHIPPED" && (
            <button
              type="button"
              disabled={loadingAction === "DELIVERED"}
              onClick={() => handleAdvanceStatus("DELIVERED")}
              className="py-2.5 px-5 bg-neutral-800 hover:bg-neutral-700 text-champagne text-xs uppercase tracking-widest font-semibold rounded-sm transition-all flex items-center space-x-2 border border-champagne/40"
            >
              {loadingAction === "DELIVERED" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5 text-champagne" />
              )}
              <span>Confirm Handover (Mark Delivered)</span>
            </button>
          )}

          {status === "DELIVERED" && (
            <div className="flex items-center space-x-2 text-xs text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Commission successfully delivered and signed for.</span>
            </div>
          )}
        </div>

        {consignmentInfo && (
          <div className="text-xs font-mono text-neutral-400 bg-neutral-900 p-2.5 rounded-sm border border-neutral-800">
            {consignmentInfo}
          </div>
        )}
      </div>

      {/* Modal for Armored Shipment Consignment Reference */}
      {showShipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-obsidian border border-neutral-800 rounded-sm p-6 max-w-md w-full space-y-4">
            <div className="flex items-center space-x-2 text-champagne">
              <Package className="w-5 h-5" />
              <h3 className="font-serif text-lg text-alabaster font-medium">
                Log Armored Dispatch Consignment
              </h3>
            </div>
            <p className="text-xs text-neutral-400">
              Input the dedicated armored courier waybill, driver tracking ID, or security seal number for this dispatch.
            </p>
            <input
              type="text"
              required
              value={consignmentRef}
              onChange={(e) => setConsignmentRef(e.target.value)}
              placeholder="e.g. GIG-SEC-LAG-908124 / Escort: Sgt. Ibrahim"
              className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs p-3 rounded-sm focus:outline-none focus:border-champagne"
            />
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowShipModal(false)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-alabaster"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!consignmentRef.trim() || loadingAction === "SHIPPED"}
                onClick={() => handleAdvanceStatus("SHIPPED", consignmentRef.trim())}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors disabled:opacity-50"
              >
                {loadingAction === "SHIPPED" ? "Logging..." : "Confirm Dispatch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDossierControls;
