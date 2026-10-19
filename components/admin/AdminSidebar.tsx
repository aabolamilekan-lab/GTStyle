"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Gem,
  PlusCircle,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: ClipboardList,
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: Gem,
    },
    {
      label: "Add Product",
      href: "/admin/products/new",
      icon: PlusCircle,
    },
  ];

  return (
    <>
      {/* Mobile Top Header (Screens < md) */}
      <div className="md:hidden sticky top-0 z-40 bg-neutral-950 border-b border-neutral-800 px-4 py-3 flex items-center justify-between text-alabaster">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <span className="font-serif text-lg font-bold tracking-widest text-champagne">
            GTSTYLE
          </span>
          <span className="text-[9px] uppercase tracking-wider text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded-sm border border-neutral-800">
            Operations
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 text-neutral-400 hover:text-champagne transition-colors rounded-sm focus:outline-none"
          aria-label="Toggle Operations Menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer (Screens < md) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-50 bg-black/75 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-950 border border-neutral-800 rounded-sm p-4 space-y-2 shadow-2xl">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono px-2 block mb-2">
              Management Modules
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
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

            <div className="pt-3 border-t border-neutral-900 space-y-2">
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
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Screens >= md) */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-neutral-950 border-r border-neutral-800 flex-col justify-between h-screen sticky top-0 text-alabaster font-sans">
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-neutral-800/80">
            <Link href="/admin/dashboard" className="block space-y-1">
              <span className="font-serif text-xl font-bold tracking-[0.2em] text-champagne block">
                GTSTYLE ADMIN
              </span>
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 block">
                Management Console
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
              <span>View Website</span>
            </div>
            <span className="text-[10px] text-neutral-500 uppercase">Live ↗</span>
          </Link>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 text-xs text-neutral-400 hover:text-red-400 hover:bg-neutral-900 rounded-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
