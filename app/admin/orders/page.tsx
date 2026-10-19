import Link from "next/link";
import {
  ClipboardList,
  Search,
  Calendar,
  Eye,
  Filter,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatNaira } from "@/lib/utils/format";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface AdminOrdersPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const { status: statusFilter } = await searchParams;

  // Build status query
  let statusCondition: OrderStatus | { in: OrderStatus[] } | undefined = undefined;

  if (statusFilter === "awaiting") {
    statusCondition = "AWAITING_PAYMENT";
  } else if (statusFilter === "crafting") {
    statusCondition = { in: ["PAYMENT_CONFIRMED", "CRAFTING"] };
  } else if (statusFilter === "shipped") {
    statusCondition = "SHIPPED";
  } else if (statusFilter === "completed") {
    statusCondition = "DELIVERED";
  }

  const [orders, countAwaiting, countCrafting, countShipped, countDelivered, countAll] =
    await Promise.all([
      prisma.order.findMany({
        where: statusCondition ? { status: statusCondition } : {},
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          deliveryAddress: true,
        },
      }),
      prisma.order.count({ where: { status: "AWAITING_PAYMENT" } }),
      prisma.order.count({ where: { status: { in: ["PAYMENT_CONFIRMED", "CRAFTING"] } } }),
      prisma.order.count({ where: { status: "SHIPPED" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count(),
    ]);

  const STATUS_BADGES: Record<
    OrderStatus,
    { label: string; bg: string; text: string; border: string }
  > = {
    AWAITING_PAYMENT: {
      label: "Awaiting Transfer",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/30",
    },
    PAYMENT_CONFIRMED: {
      label: "Transfer Confirmed",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
    },
    CRAFTING: {
      label: "Benchwork in Progress",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/30",
    },
    SHIPPED: {
      label: "Armored Dispatch",
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/30",
    },
    DELIVERED: {
      label: "Delivered & Signed",
      bg: "bg-neutral-800",
      text: "text-neutral-300",
      border: "border-neutral-700",
    },
    CANCELLED: {
      label: "Voided",
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/30",
    },
  };

  const tabs = [
    { label: "All Commissions", slug: "", count: countAll },
    { label: "Awaiting Transfer Alert", slug: "awaiting", count: countAwaiting },
    { label: "Confirmed / In Crafting", slug: "crafting", count: countCrafting },
    { label: "Dispatched", slug: "shipped", count: countShipped },
    { label: "Completed", slug: "completed", count: countDelivered },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-champagne">
            Order Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-alabaster font-light tracking-wide mt-1">
            Customer Orders
          </h1>
        </div>
      </div>

      {/* Segment Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-4">
        {tabs.map((tab) => {
          const isActive = (statusFilter || "") === tab.slug;
          return (
            <Link
              key={tab.slug}
              href={tab.slug ? `/admin/orders?status=${tab.slug}` : "/admin/orders"}
              className={`px-3.5 py-2 text-xs rounded-sm transition-all font-medium flex items-center space-x-2 ${
                isActive
                  ? "bg-champagne text-obsidian font-semibold"
                  : "bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-alabaster hover:border-neutral-700"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-obsidian/30 text-obsidian" : "bg-neutral-900 text-neutral-400"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-500 space-y-2">
            <ClipboardList className="w-8 h-8 mx-auto text-neutral-600 stroke-[1.2]" />
            <p>No commissions found in this fulfillment segment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900/80 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4 font-medium text-champagne">Order #</th>
                  <th className="py-3 px-4 font-medium">Customer Recipient</th>
                  <th className="py-3 px-4 font-medium">Destination State</th>
                  <th className="py-3 px-4 font-medium">Required Deadline</th>
                  <th className="py-3 px-4 font-medium">Total Value</th>
                  <th className="py-3 px-4 font-medium">Fulfillment Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {orders.map((order) => {
                  const badge = STATUS_BADGES[order.status];
                  const formattedDate = new Date(order.requiredDeliveryDate).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  );

                  return (
                    <tr key={order.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-alabaster">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-300">
                        <div>{order.customerName}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          {order.customerPhone}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-400">
                        {order.deliveryAddress.city}, {order.deliveryAddress.state}
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-serif font-semibold text-champagne text-sm">
                        {formatNaira(order.totalCents)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block text-[10px] font-sans uppercase tracking-wider px-2 py-0.5 border rounded-sm ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center space-x-1 text-[11px] uppercase tracking-wider text-champagne hover:text-champagne-light transition-colors py-1 px-2.5 rounded-sm bg-neutral-900 hover:bg-neutral-850 border border-neutral-800"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review Dossier</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
