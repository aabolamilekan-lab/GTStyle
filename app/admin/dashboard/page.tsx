import Link from "next/link";
import {
  Clock,
  Hammer,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatNaira } from "@/lib/utils/format";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const now = new Date();
  const next48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  // Parallel database aggregation
  const [
    pendingCount,
    activeBenchworkCount,
    verifiedOrders,
    approachingDeadlinesCount,
    recentOrders,
  ] = await Promise.all([
    // 1. Pending Settlement
    prisma.order.count({
      where: { status: "AWAITING_PAYMENT" },
    }),
    // 2. Active Benchwork
    prisma.order.count({
      where: { status: { in: ["PAYMENT_CONFIRMED", "CRAFTING"] } },
    }),
    // 3. Realized Revenue
    prisma.order.aggregate({
      where: {
        status: { notIn: ["AWAITING_PAYMENT", "CANCELLED"] },
      },
      _sum: { totalCents: true },
    }),
    // 4. Approaching Deadlines
    prisma.order.count({
      where: {
        status: { notIn: ["DELIVERED", "CANCELLED"] },
        requiredDeliveryDate: {
          lte: next48Hours,
        },
      },
    }),
    // Recent commissions
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        items: true,
        deliveryAddress: true,
      },
    }),
  ]);

  const realizedRevenueCents = verifiedOrders._sum.totalCents || 0;

  const STATUS_BADGES: Record<OrderStatus, { label: string; bg: string; text: string; border: string }> = {
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
      label: "Goldsmith Benchwork",
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
      label: "Voided / Cancelled",
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/30",
    },
  };

  return (
    <div className="space-y-10 font-sans">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-champagne">
            Command Center
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-alabaster font-light tracking-wide mt-1">
            Dashboard Overview
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-champagne text-xs uppercase tracking-widest text-champagne rounded-sm transition-colors"
          >
            Manage All Orders
          </Link>
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-champagne hover:bg-champagne-light text-obsidian text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors shadow-lg"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Pending Settlement */}
        <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
            <span>Pending Settlement</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-serif text-3xl text-amber-400 font-semibold">
            {pendingCount}
          </div>
          <p className="text-[11px] text-neutral-400">
            Awaiting client transfer receipt
          </p>
        </div>

        {/* Card 2: Active Benchwork */}
        <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
            <span>Active Benchwork</span>
            <Hammer className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-serif text-3xl text-blue-400 font-semibold">
            {activeBenchworkCount}
          </div>
          <p className="text-[11px] text-neutral-400">
            Confirmed & in goldsmith setting
          </p>
        </div>

        {/* Card 3: Realized Revenue */}
        <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
            <span>Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-champagne" />
          </div>
          <div className="font-serif text-2xl sm:text-3xl text-champagne font-bold tracking-tight">
            {formatNaira(realizedRevenueCents)}
          </div>
          <p className="text-[11px] text-neutral-400">
            Reconciled bank transfers
          </p>
        </div>

        {/* Card 4: Approaching Deadlines */}
        <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider">
            <span>Due Within 48 Hours</span>
            <AlertTriangle className={`w-4 h-4 ${approachingDeadlinesCount > 0 ? "text-red-400" : "text-neutral-500"}`} />
          </div>
          <div className={`font-serif text-3xl font-semibold ${approachingDeadlinesCount > 0 ? "text-red-400" : "text-neutral-400"}`}>
            {approachingDeadlinesCount}
          </div>
          <p className="text-[11px] text-neutral-400">
            Priority delivery schedules
          </p>
        </div>
      </div>

      {/* Recent Commissions Table */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <h2 className="font-serif text-xl text-alabaster font-medium tracking-wide">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-widest text-champagne hover:text-champagne-light transition-colors inline-flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-500">
            No commissions placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900/80 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4 font-medium text-champagne">Order #</th>
                  <th className="py-3 px-4 font-medium">Recipient</th>
                  <th className="py-3 px-4 font-medium">Required Deadline</th>
                  <th className="py-3 px-4 font-medium">Pieces</th>
                  <th className="py-3 px-4 font-medium">Total Value</th>
                  <th className="py-3 px-4 font-medium">Fulfillment Stage</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {recentOrders.map((order) => {
                  const badge = STATUS_BADGES[order.status];
                  const formattedDate = new Date(order.requiredDeliveryDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <tr key={order.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-alabaster">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-300">
                        <div>{order.customerName}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">{order.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-neutral-400">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}
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
                          className="inline-flex items-center space-x-1 text-[11px] uppercase tracking-wider text-neutral-400 hover:text-champagne transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage</span>
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
