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
      icon: Gem,
      title: "Ethical Diamond Sourcing",
      subtitle: "GIA & IGI Certified Natural & Lab Stones",
    },
    {
      icon: ShieldCheck,
      title: "Direct Bank Transfer",
      subtitle: "Zero Card Gateways • Verified Concierge Settlement",
    },
    {
      icon: Truck,
      title: "Armored Insured Courier",
      subtitle: "Secure Nationwide Door-to-Door Delivery",
    },
    {
      icon: Award,
      title: "Atelier Lifetime Warranty",
      subtitle: "Annual Inspection & Ultrasonic Cleaning",
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
                FINE JEWELRY • LAGOS
              </span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Hand-forged fine jewelry born in Lagos, Nigeria. We unite ancient African regal heritage with European micro-pavé mastercraft. Every diamond is GIA/IGI verified, cast strictly in recycled 18k solid gold alloys and platinum.
            </p>
          </div>

          {/* Col 2: Atelier Navigation */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-alabaster mb-4">
              Collections & Atelier
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/shop?category=rings-solitaires" className="hover:text-champagne transition-colors">
                  Sovereign Solitaires
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tennis-bracelets" className="hover:text-champagne transition-colors">
                  Celestia Tennis Bracelets
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bespoke-pendants" className="hover:text-champagne transition-colors">
                  Art Deco Gemstone Pendants
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-champagne transition-colors">
                  Bespoke Ring Sizer & Guide
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-champagne transition-colors">
                  Complete High Jewelry Vault
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Concierge Details */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-alabaster mb-4">
              Atelier Concierge
            </h4>
            <ul className="space-y-3 text-xs text-neutral-400">
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-champagne flex-shrink-0" />
                <a href={`tel:${SELLER_CONFIG.phone}`} className="hover:text-champagne transition-colors font-mono">
                  {SELLER_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a
                  href={`https://wa.me/${SELLER_CONFIG.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp Studio Line
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-champagne flex-shrink-0" />
                <a href={`mailto:${SELLER_CONFIG.email}`} className="hover:text-champagne transition-colors font-mono">
                  {SELLER_CONFIG.email}
                </a>
              </li>
              <li className="pt-2 text-[11px] leading-relaxed text-neutral-500 border-t border-neutral-900">
                <span className="text-neutral-300 font-medium block mb-0.5">Private Viewing Salon:</span>
                Victoria Island, Lagos • By Appointment Only
                <br />
                Mon – Sat: 10:00 AM – 6:00 PM WAT
              </li>
            </ul>
          </div>

          {/* Col 4: Private Vault Newsletter */}
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-alabaster mb-4">
              Private Vault Access
            </h4>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Receive private invitations to confidential diamond acquisitions, one-of-a-kind bespoke unveilings, and atelier previews.
            </p>
            {isSubscribed ? (
              <div className="flex items-center space-x-2 text-xs text-champagne bg-champagne/10 border border-champagne/30 p-3 rounded-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>You are on the VIP Salon guest list.</span>
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
                  Strictly confidential. No spam or unsolicited promotions.
                </span>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-neutral-800/80 bg-neutral-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 space-y-3 sm:space-y-0">
          <p suppressHydrationWarning>© {new Date().getFullYear()} GTStyle Fine Jewelry Digital Atelier Ltd. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Handcrafted with GIA/IGI ethical standards • Direct Concierge Bank Settlement
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
