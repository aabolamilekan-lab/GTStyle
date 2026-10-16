"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { SELLER_CONFIG } from "@/config/seller";

export function Navbar() {
  const pathname = usePathname();
  const isHydrated = useHydrated();
  const totalItemCount = useCartStore((state) => state.totalItemCount());
  const openCart = useCartStore((state) => state.openCart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Do not render consumer navbar in admin suite or auth views
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return null;
  }

  const displayCount = isHydrated ? totalItemCount : 0;

  const navLinks = [
    { label: "Solitaires", href: "/shop?category=rings-solitaires" },
    { label: "Tennis Bracelets", href: "/shop?category=tennis-bracelets" },
    { label: "Pendants", href: "/shop?category=bespoke-pendants" },
    { label: "Atelier", href: "/shop" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-obsidian/90 backdrop-blur-md border-b border-neutral-800 text-alabaster transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-400 hover:text-champagne transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative py-2 text-xs uppercase tracking-widest text-neutral-300 hover:text-champagne transition-colors duration-200"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-champagne transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Center Brand Mark */}
          <div className="flex flex-col items-center justify-center text-center">
            <Link href="/" className="group inline-flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-champagne group-hover:text-champagne-light transition-colors">
                GTSTYLE
              </span>
              <span className="text-[9px] uppercase tracking-extrawide text-neutral-400 font-sans mt-0.5">
                FINE JEWELRY • LAGOS
              </span>
            </Link>
          </div>

          {/* Right Navigation & Utilities */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* WhatsApp Concierge */}
            <a
              href={`https://wa.me/${SELLER_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Direct WhatsApp Concierge"
              className="p-2 text-neutral-400 hover:text-emerald-400 transition-colors duration-200"
              title="Chat with Atelier Concierge"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            {/* Direct Telephone */}
            <a
              href={`tel:${SELLER_CONFIG.phone}`}
              aria-label="Call Atelier Directly"
              className="p-2 text-neutral-400 hover:text-champagne transition-colors duration-200"
              title="Direct Telephone Line"
            >
              <Phone className="w-5 h-5" />
            </a>

            {/* Velvet Bag Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 text-alabaster hover:text-champagne transition-colors duration-200 flex items-center"
              aria-label="Open Velvet Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {displayCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-obsidian bg-champagne rounded-full shadow-md animate-in fade-in zoom-in duration-200">
                  {displayCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-obsidian/95 backdrop-blur-lg px-6 py-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-widest text-neutral-300 hover:text-champagne transition-colors py-2 border-b border-neutral-900"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 flex items-center justify-between text-xs text-neutral-400">
              <span className="uppercase tracking-wider">Atelier Concierge:</span>
              <span className="text-champagne font-mono">{SELLER_CONFIG.phone}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
