import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  ArrowRight,
  Shield,
  Gem,
  Award,
  Sparkles,
  Sliders,
  CheckCircle,
  Truck,
  CreditCard,
  Quote,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { SELLER_CONFIG } from "@/config/seller";
import { ProductCard } from "@/components/shop/ProductCard";
import { serializeProducts } from "@/lib/utils/serialize";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Query 4 featured products
  const rawFeaturedProducts = await prisma.product.findMany({
    where: { isPublished: true, isFeatured: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { where: { isActive: true } },
      category: true,
      specifications: true,
    },
    take: 4,
  });

  const featuredProducts = serializeProducts(rawFeaturedProducts);

  // Query featured collections
  const featuredCollections = await prisma.collection.findMany({
    where: { isFeatured: true },
    include: {
      _count: { select: { products: true } },
    },
    take: 2,
  });

  const bespokeSteps = [
    {
      step: "01",
      icon: Gem,
      title: "Choose Your Design",
      description:
        "Tell us what you want. Send a picture or choose from our collection.",
    },
    {
      step: "02",
      icon: CheckCircle,
      title: "Place Your Order",
      description:
        "Give us your name, delivery address, and ring size if needed.",
    },
    {
      step: "03",
      icon: CreditCard,
      title: "Make Payment",
      description:
        "Pay into our official business account. No extra charges.",
    },
    {
      step: "04",
      icon: Truck,
      title: "We Make & Deliver",
      description:
        "Send payment proof on WhatsApp. We start making your piece and deliver to you anywhere in Nigeria.",
    },
  ];

  const testimonials = [
    {
      quote:
        "I love my piece! Good quality and delivery was fast. Will buy again.",
      client: "Amaka",
      location: "Lagos",
    },
    {
      quote:
        "Fine jewelry and looks expensive. I get compliments everywhere.",
      client: "Tolu",
      location: "Lagos",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 lg:space-y-28 pb-16 sm:pb-24 overflow-hidden">
      {/* 1. Full-Viewport Hero Section */}
      <section className="min-h-[85vh] sm:min-h-[90vh] relative flex items-center justify-center overflow-hidden bg-obsidian px-3 sm:px-4 py-12">
        {/* Background Editorial Jewelry Imagery */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-earrings.jpg"
            alt="GTStyle Fashion Jewelry Earrings"
            fill
            priority
            className="object-cover object-center opacity-65 scale-100 filter brightness-95 contrast-110"
          />
          {/* Obsidian & Velvet Gradient Overlays for luxury depth and crystal-clear text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/75 via-transparent to-obsidian/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#0B0B0B_88%)]" />
          {/* Subtle champagne warmth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-champagne/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-5 sm:space-y-6 text-center pt-6 sm:pt-8">
          <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full border border-champagne/40 bg-champagne/10 text-champagne text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-sans backdrop-blur-md shadow-lg shadow-black/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fine Jewelry • Lagos</span>
          </div>

          <h1 className="font-serif text-3xl min-[380px]:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-alabaster leading-[1.15] tracking-tight drop-shadow-md">
            Crafted to <br />
            <span className="italic font-normal text-champagne font-serif">Last</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-base md:text-lg text-neutral-200 font-sans font-light leading-relaxed px-2 drop-shadow-sm">
            Your Style, Your Jewelry — Made Just For You!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-champagne hover:bg-champagne-light text-obsidian text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 group rounded-sm"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href={`https://wa.me/${SELLER_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border border-neutral-700 hover:border-champagne bg-obsidian/60 hover:bg-neutral-900/80 text-alabaster hover:text-champagne text-xs uppercase tracking-widest font-medium transition-all duration-300 backdrop-blur-md flex items-center justify-center space-x-2.5 rounded-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. How To Order (4-Step Process) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-neutral-800 bg-neutral-950/60 p-5 sm:p-10 lg:p-16 space-y-8 sm:space-y-12 rounded-sm">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne font-sans">
              Simple & Easy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-alabaster font-light">
              How To Order
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
              Ordering is easy and fast. Follow our simple 4-step process below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {bespokeSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative space-y-4 pt-4 border-t border-neutral-800">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-champagne/40">
                      {step.step}
                    </span>
                    <div className="p-2.5 bg-neutral-900 border border-neutral-800 text-champagne rounded-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-serif text-lg text-alabaster tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured Masterpieces Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-6 gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl text-alabaster font-light">
              Our Best Sellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-champagne transition-colors"
          >
            <span>See All Items</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Curated Collections Showcase (Asymmetric 2-Column Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl sm:text-4xl text-alabaster font-light">
            Watches & Jewelry Collection
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredCollections.map((col) => (
            <Link
              key={col.id}
              href={`/shop?collection=${col.slug}`}
              className="group relative h-[380px] min-[480px]:h-[420px] sm:h-[480px] overflow-hidden border border-neutral-800 flex flex-col justify-end p-5 min-[480px]:p-8 sm:p-12 transition-all duration-500"
            >
              {col.bannerUrl && (
                <Image
                  src={col.bannerUrl}
                  alt={col.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                />
              )}
              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />

              <div className="relative z-10 space-y-3">
                <span className="inline-block text-[10px] uppercase font-sans tracking-widest text-champagne bg-obsidian/85 px-2.5 py-1 border border-neutral-800">
                  Popular Collection • {col._count.products} Items
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-alabaster font-light group-hover:text-champagne transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-md leading-relaxed line-clamp-2">
                  {col.description}
                </p>
                <div className="pt-2 inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-champagne group-hover:text-champagne-light">
                  <span>View Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Atelier Pillars & Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-y border-neutral-800 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="p-3 w-fit bg-neutral-900 border border-neutral-800 text-champagne rounded-sm">
                <Award className="w-6 h-6 stroke-[1.2]" />
              </div>
              <h3 className="font-serif text-xl text-alabaster tracking-wide">
                Quality Materials
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                High-quality, skin-friendly materials that are made to shine and last.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-3 w-fit bg-neutral-900 border border-neutral-800 text-champagne rounded-sm">
                <Gem className="w-6 h-6 stroke-[1.2]" />
              </div>
              <h3 className="font-serif text-xl text-alabaster tracking-wide">
                Your Style, Your Jewelry
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Made Just For You!
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-3 w-fit bg-neutral-900 border border-neutral-800 text-champagne rounded-sm">
                <Shield className="w-6 h-6 stroke-[1.2]" />
              </div>
              <h3 className="font-serif text-xl text-alabaster tracking-wide">
                Made With Care
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Each piece is carefully polished and checked before we deliver to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl sm:text-4xl text-alabaster font-light">
            Reviews From Our Customers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-neutral-950 border border-neutral-800/80 p-8 flex flex-col justify-between space-y-6 rounded-sm relative"
            >
              <Quote className="w-8 h-8 text-champagne/20 absolute top-6 right-6" />
              <p className="font-serif text-sm sm:text-base text-neutral-300 leading-relaxed italic">
                “{t.quote}”
              </p>
              <div className="pt-4 border-t border-neutral-900 space-y-1">
                <h4 className="font-sans text-xs uppercase tracking-wider text-alabaster font-semibold">
                  {t.client}
                </h4>
                <p className="text-[11px] text-champagne font-mono">
                  {t.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
