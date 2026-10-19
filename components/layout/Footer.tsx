"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gem, ShieldCheck, Truck, Award, ArrowRight, MessageCircle, Phone, Mail, CheckCircle2 } from "lucide-react";
import { SELLER_CONFIG } from "@/config/seller";

export function Footer() {
  const pathname = usePathname();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Do not render consumer footer in admin suite or auth views
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setNewsletterEmail("");
    }
  };

  const trustHighlights = [
    {
      icon: Award,
      title: "Quality Guaranteed",
      subtitle: "Well-made pieces that shine and last.",
    },
    {
      icon: ShieldCheck,
      title: "Easy Payment",
      subtitle: "Pay directly to our business account. Simple and secure.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      subtitle: "We deliver fast and safe to anywhere in Nigeria.",
    },
    {
      icon: MessageCircle,
      title: "We Care For You",
      subtitle: "Need help after buying? Chat us on WhatsApp anytime.",
    },
  ];

  return (
    <footer className="w-full bg-obsidian border-t border-neutral-800 text-slateMuted font-sans">
      {/* Trust Grid */}
      <div className="border-b border-neutral-800/80 bg-neutral-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustHighlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="p-2.5 rounded-sm bg-neutral-900 border border-neutral-800 text-champagne flex-shrink-0">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-alabaster">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main 4-Column Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Col 1: Brand Manifesto */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-widest text-champagne">
                GTSTYLE
              </span>
              <span className="block text-[8px] uppercase tracking-widest text-neutral-400 mt-0.5">
                FASHION JEWELRY • LAGOS
              </span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Affordable luxury jewelry in Lagos, Nigeria.
              <br />
              We Sell beautiful pieces that make you shine.
            </p>
          </div>

          {/* Col 2: Shop Navigation */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-alabaster mb-4">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/shop?category=rings" className="hover:text-champagne transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=necklaces" className="hover:text-champagne transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bracelets" className="hover:text-champagne transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=earrings" className="hover:text-champagne transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=watches" className="hover:text-champagne transition-colors">
                  Watches
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-champagne transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact Details */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-alabaster mb-4">
              CONTACT US
            </h4>
            <ul className="space-y-3 text-xs text-neutral-400">
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-champagne flex-shrink-0" />
                <span>Phone:</span>
                <a href={`tel:${SELLER_CONFIG.phone}`} className="hover:text-champagne transition-colors font-mono">
                  {SELLER_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp:</span>
                <a
                  href={`https://wa.me/${SELLER_CONFIG.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Chat With Us
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-champagne flex-shrink-0" />
                <span>Email:</span>
                <a href={`mailto:${SELLER_CONFIG.email}`} className="hover:text-champagne transition-colors">
                  {SELLER_CONFIG.email}
                </a>
              </li>
              <li className="pt-2 text-xs leading-relaxed text-neutral-400 border-t border-neutral-900 space-y-1">
                <p>
                  <span className="text-neutral-300">Location:</span> Lagos, Nigeria
                </p>
                <p>
                  Mon - Sat: 10AM - 6PM
                </p>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-alabaster mb-4">
              JOIN OUR LIST
            </h4>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Get updates on new designs and discounts.
            </p>
            {isSubscribed ? (
              <div className="flex items-center space-x-2 text-xs text-champagne bg-champagne/10 border border-champagne/30 p-3 rounded-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>You are on our list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-neutral-900 border border-neutral-800 text-alabaster text-xs px-3.5 py-3 rounded-sm focus:outline-none focus:border-champagne placeholder:text-neutral-600 transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-champagne hover:bg-champagne-light text-obsidian rounded-sm flex items-center justify-center transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-neutral-500 block">
                  We will not send you spam.
                </span>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-neutral-800/80 bg-neutral-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 space-y-3 sm:space-y-0">
          <p suppressHydrationWarning>© {new Date().getFullYear()} GTStyle Fashion Jewelry Ltd. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Quality Fashion Jewelry • Easy Bank Transfer • Fast Delivery Across Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
