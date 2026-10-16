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
      icon: Sliders,
      title: "Curate & Configure",
      description:
        "Select your certified diamond or colored gemstone, choose your precious metal alloy (18K gold or platinum), and input custom ring dimensions.",
    },
    {
      step: "02",
      icon: CheckCircle,
      title: "Place Order",
      description:
        "Provide your designated delivery address and mandatory required delivery date with custom atelier engraving specifications.",
    },
    {
      step: "03",
      icon: CreditCard,
      title: "Direct Bank Transfer",
      description:
        "Settle payment securely via direct transfer to the GTStyle official corporate bank account with zero payment gateway processing surcharges.",
    },
    {
      step: "04",
      icon: Truck,
      title: "Verification & Armored Transit",
      description:
        "Exchange transfer confirmation directly with your atelier concierge via WhatsApp; master benchwork commences with insured nationwide armored dispatch.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Commissioning my fiancé's 2.50ct Sovereign Solitaire diamond ring through GTStyle was seamless. Settling via direct GTBank corporate transfer and confirming via WhatsApp gave complete peace of mind. The GIA documentation and micro-pavé finish are breathtaking.",
      client: "Dr. Oladipo Adeleke",
      location: "Ikoyi, Lagos",
      piece: "The Sovereign Solitaire Ring (18K Yellow Gold)",
    },
    {
      quote:
        "The Celestia tennis bracelet has unmatched brilliance and fluidity. Within 48 hours of bank transfer confirmation, armored courier delivered the piece in a discreet tamper-proof case to my residence in Maitama. True haute joaillerie.",
      client: "Amina Bello-Danladi",
      location: "Maitama, Abuja",
      piece: "The Celestia Diamond Tennis Bracelet (18K White Gold)",
    },
    {
      quote:
        "The Colombian emerald pendant in 18k gold is an absolute masterpiece. GTStyle's concierge team answered all my questions regarding clarity and certification over telephone in minutes. Zero card friction, just pure luxury service.",
      client: "Tariq & Nnenna Al-Hassan",
      location: "Victoria Island, Lagos",
      piece: "The Emerald Cut Deco Pendant",
    },
  ];

  return (
    <div className="space-y-28 pb-24 overflow-hidden">
      {/* 1. Full-Viewport Hero Section */}
      <section className="min-h-[90vh] relative flex items-center justify-center overflow-hidden bg-obsidian px-4">
        {/* Background Macro Jewelry Imagery */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=2000&q=85"
            alt="GTStyle Haute Joaillerie Macro Photography"
            fill
            priority
            className="object-cover opacity-40 scale-100 animate-in fade-in zoom-in duration-1000"
          />
          {/* Obsidian Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-obsidian/40 to-obsidian" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 text-center pt-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-champagne/40 bg-champagne/10 text-champagne text-[11px] uppercase tracking-[0.3em] font-sans backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HAUTE JOAILLERIE • LAGOS ATELIER</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-alabaster leading-tight tracking-tight">
            Crafted for <br />
            <span className="italic font-normal text-champagne font-serif">Generations</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-neutral-300 font-sans font-light leading-relaxed">
            Bespoke fine jewelry, certified natural diamonds, and heirloom precious metals hand-set to order in our Lagos atelier.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-champagne hover:bg-champagne-light text-obsidian text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 group"
            >
              <span>Explore High Jewelry</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href={`https://wa.me/${SELLER_CONFIG.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 border border-neutral-700 hover:border-champagne bg-obsidian/60 hover:bg-neutral-900/80 text-alabaster hover:text-champagne text-xs uppercase tracking-widest font-medium transition-all duration-300 backdrop-blur-md flex items-center justify-center space-x-2.5"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Direct Atelier Concierge</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. The GTStyle Bespoke Experience (4-Step Process) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-neutral-800 bg-neutral-950/60 p-8 sm:p-12 lg:p-16 space-y-12 rounded-sm">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne font-sans">
              Concierge Ordering
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-alabaster font-light">
              The GTStyle Bespoke Experience
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
              Acquiring fine jewelry should be personal, private, and pristine. We operate on a direct concierge model eliminating credit card surcharges and payment gateway bottlenecks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <span className="text-xs uppercase tracking-[0.25em] text-champagne font-sans">
              Haute Joaillerie
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-alabaster font-light mt-1">
              Featured Masterpieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-champagne transition-colors"
          >
            <span>Explore Entire Catalog</span>
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
          <span className="text-xs uppercase tracking-[0.25em] text-champagne font-sans">
            Atelier Signatures
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-alabaster font-light">
            Curated Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredCollections.map((col) => (
            <Link
              key={col.id}
              href={`/shop?collection=${col.slug}`}
              className="group relative h-[420px] sm:h-[480px] overflow-hidden border border-neutral-800 flex flex-col justify-end p-8 sm:p-12 transition-all duration-500"
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
                  Featured Collection • {col._count.products} Pieces
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-alabaster font-light group-hover:text-champagne transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-md leading-relaxed line-clamp-2">
                  {col.description}
                </p>
                <div className="pt-2 inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-champagne group-hover:text-champagne-light">
                  <span>Enter Collection Showroom</span>
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
                100% Solid Recycled Gold & Platinum
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                We cast solely in ethically refined 18k solid yellow, white, and rose gold alloys as well as 950 platinum. Zero hollow shells, zero gold plating—every piece carries enduring intrinsic weight.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-3 w-fit bg-neutral-900 border border-neutral-800 text-champagne rounded-sm">
                <Gem className="w-6 h-6 stroke-[1.2]" />
              </div>
              <h3 className="font-serif text-xl text-alabaster tracking-wide">
                Conflict-Free Certified Gemstones
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Every natural diamond is Kimberley Process compliant and accompanied by an official GIA grading dossier. Lab-grown diamonds adhere to strict IGI optical specifications (VS1+, F+ Color, Ideal Cut).
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-3 w-fit bg-neutral-900 border border-neutral-800 text-champagne rounded-sm">
                <Shield className="w-6 h-6 stroke-[1.2]" />
              </div>
              <h3 className="font-serif text-xl text-alabaster tracking-wide">
                Master Jeweler Benchwork
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Each bezel, prong, and micro-pavé scallop is set under 40x stereoscopic magnification in our private Lagos studio. Every creation is hand-polished to mirror luster before personal certification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Editorial Client Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-champagne font-sans">
            Client Reflections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-alabaster font-light">
            Words From Our Patrons
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <p className="text-[10px] text-neutral-500 font-sans">
                  Piece: {t.piece}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
