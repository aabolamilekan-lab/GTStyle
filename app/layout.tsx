import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B0B0B",
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GTStyle | Quality Fashion Jewelry in Lagos",
  description:
    "Affordable luxury jewelry in Lagos, Nigeria. Beautiful fashion rings, necklaces, bracelets, earrings, and watches that make you shine.",
  keywords: [
    "Fashion Jewelry Lagos",
    "Affordable Jewelry Nigeria",
    "Jewelry in Lagos",
    "Rings Nigeria",
    "Necklaces Lagos",
    "Watches Nigeria",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col bg-obsidian text-alabaster antialiased selection:bg-champagne selection:text-obsidian"
        suppressHydrationWarning
      >
        <Navbar />
        <CartDrawer />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
