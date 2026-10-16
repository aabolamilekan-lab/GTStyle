"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Gem,
  PlusCircle,
  ExternalLink,
  LogOut,
  Shield,
} from "lucide-react";
import { signOut } from "next-auth/react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Command Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Order Intake & Benchwork",
      href: "/admin/orders",
      icon: ClipboardList,
    },
    {
      label: "Masterpiece Vault",
      href: "/admin/products",
      icon: Gem,
    },
    {
      label: "New Creation Studio",
      href: "/admin/products/new",
      icon: PlusCircle,
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-neutral-950 border-r border-neutral-800 flex flex-col justify-between h-screen sticky top-0 text-alabaster font-sans">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-neutral-800/80">
          <Link href="/admin/dashboard" className="block space-y-1">
            <span className="font-serif text-xl font-bold tracking-[0.2em] text-champagne block">
              GTSTYLE ATELIER
            </span>
            <span className="text-[9px] uppercase tracking-widest text-neutral-400 block">
              Executive Management Suite
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-3 rounded-sm text-xs font-medium uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-champagne/15 text-champagne border border-champagne/30"
                    : "text-neutral-400 hover:text-alabaster hover:bg-neutral-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-champagne" : "text-neutral-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-neutral-800/80 space-y-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 text-xs text-neutral-400 hover:text-champagne hover:bg-neutral-900 rounded-sm transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <ExternalLink className="w-4 h-4" />
            <span>Public Showcase View</span>
          </div>
          <span className="text-[10px] text-neutral-500 uppercase">Live ↗</span>
        </Link>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 text-xs text-neutral-400 hover:text-red-400 hover:bg-neutral-900 rounded-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Session (Sign Out)</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
