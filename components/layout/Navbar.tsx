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
    { label: "WATCH", href: "/shop?category=watches" },
    { label: "NECKLACE", href: "/shop?category=necklaces" },
    { label: "BRACELET", href: "/shop?category=bracelets" },
    { label: "RINGS", href: "/shop?category=rings" },
  ];

  // Automatically close mobile menu when pathname changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-obsidian/95 backdrop-blur-md border-b border-neutral-800 text-alabaster transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 text-neutral-400 hover:text-champagne transition-colors focus:outline-none focus:ring-1 focus:ring-champagne/40 rounded-sm"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
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
          <div className="flex flex-col items-center justify-center text-center px-1">
            <Link href="/" className="group inline-flex flex-col items-center">
              <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider sm:tracking-widest text-champagne group-hover:text-champagne-light transition-colors leading-none">
                GTSTYLE
              </span>
              <span className="text-[7.5px] sm:text-[9px] uppercase tracking-widest sm:tracking-extrawide text-neutral-400 font-sans mt-1">
                FASHION JEWELRY • LAGOS
              </span>
            </Link>
          </div>

          {/* Right Navigation & Utilities */}
          <div className="flex items-center space-x-1 sm:space-x-3 md:space-x-4">
            {/* WhatsApp Contact */}
            <a
              href={`https://wa.me/${SELLER_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="p-1.5 sm:p-2 text-neutral-400 hover:text-emerald-400 transition-colors duration-200"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

            {/* Direct Telephone */}
            <a
              href={`tel:${SELLER_CONFIG.phone}`}
              aria-label="Call Us Directly"
              className="p-1.5 sm:p-2 text-neutral-400 hover:text-champagne transition-colors duration-200"
              title="Call Us Directly"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-1.5 sm:p-2 text-alabaster hover:text-champagne transition-colors duration-200 flex items-center"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {displayCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[17px] h-[17px] sm:min-w-[18px] sm:h-[18px] px-1 text-[9px] sm:text-[10px] font-bold text-obsidian bg-champagne rounded-full shadow-md animate-in fade-in zoom-in duration-200">
                  {displayCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 sm:top-20 bg-black/60 backdrop-blur-sm lg:hidden z-40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 lg:hidden border-t border-neutral-800 bg-obsidian/95 backdrop-blur-xl px-5 sm:px-6 py-6 animate-in slide-in-from-top-4 duration-200 shadow-2xl">
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs sm:text-sm uppercase tracking-widest text-neutral-300 hover:text-champagne transition-colors py-2.5 border-b border-neutral-900"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-400 gap-1">
                <span className="uppercase tracking-wider text-[11px]">Customer Support:</span>
                <span className="text-champagne font-mono text-xs">{SELLER_CONFIG.phone}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Navbar;
