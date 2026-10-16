import { PrismaClient, Role, MetalType, GemstoneType, DiamondCut, DiamondColor, DiamondClarity } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Beginning GTStyle Fine Jewelry database seeding...");

  // 1. Seed Administrative Account
  const adminPasswordHash = await bcrypt.hash("Admin123!", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@gtstyle.com" },
    update: {
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      name: "GTStyle Atelier Director",
      phone: "+2348000000000",
    },
    create: {
      email: "admin@gtstyle.com",
      passwordHash: adminPasswordHash,
      name: "GTStyle Atelier Director",
      phone: "+2348000000000",
      role: Role.ADMIN,
    },
  });
  console.log(`Admin account provisioned: ${adminUser.email} (Role: ${adminUser.role})`);

  // 2. Seed Categories
  const categoryRings = await prisma.category.upsert({
    where: { slug: "rings-solitaires" },
    update: {},
    create: {
      name: "Rings & Solitaires",
      slug: "rings-solitaires",
      description: "Iconic bespoke solitaires, halo rings, and hand-forged bridal bands crafted with certified ethical diamonds.",
      imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85",
    },
  });

  const categoryBracelets = await prisma.category.upsert({
    where: { slug: "tennis-bracelets" },
    update: {},
    create: {
      name: "Tennis Bracelets & Bangles",
      slug: "tennis-bracelets",
      description: "Seamless lines of matched brilliant diamonds and pavé bangles engineered for fluid wrist articulation.",
      imageUrl: "https://images.unsplash.com/photo-1611591475887-210196238b93?auto=format&fit=crop&w=1200&q=85",
    },
  });

  const categoryPendants = await prisma.category.upsert({
    where: { slug: "bespoke-pendants" },
    update: {},
    create: {
      name: "Bespoke Pendants",
      slug: "bespoke-pendants",
      description: "Statement gemstone medallions, emerald pendants, and architectural diamond centerpieces.",
      imageUrl: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85",
    },
  });
  console.log("Categories seeded successfully.");

  // 3. Seed Collections
  const collectionSignature = await prisma.collection.upsert({
    where: { slug: "signature-royal" },
    update: { isFeatured: true },
    create: {
      name: "GTStyle Signature Royal",
      slug: "signature-royal",
      description: "Our sovereign collection exemplifying regal African heritage paired with master European micro-pavé artistry.",
      bannerUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1800&q=85",
      isFeatured: true,
    },
  });

  const collectionPave = await prisma.collection.upsert({
    where: { slug: "atelier-pave" },
    update: { isFeatured: true },
    create: {
      name: "Atelier Pavé",
      slug: "atelier-pave",
      description: "Microscopic pavé settings casting an unbroken ribbon of fiery light across sculpted precious metals.",
      bannerUrl: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1800&q=85",
      isFeatured: true,
    },
  });
  console.log("Collections seeded successfully.");

  // 4. Clear existing products to ensure clean seed execution
  // Note: cascades handle images, specifications, and variants
  await prisma.product.deleteMany({});
  console.log("Cleared prior products for idempotent fresh seed.");

  // --- PIECE 1: The GTStyle Sovereign Solitaire Diamond Ring ---
  const product1 = await prisma.product.create({
    data: {
      name: "The GTStyle Sovereign Solitaire Diamond Ring",
      slug: "gtstyle-sovereign-solitaire-diamond-ring",
      description: "A monumental 2.50-carat D-color flawless natural diamond crowned in a custom knife-edge 6-prong platinum or 18k gold setting. Designed for maximum light return and architectural presence.",
      storyHtml: `<p>The Sovereign Solitaire captures timeless regality. Hand-forged in the GTStyle atelier, each prong is sculpted under 40x microscopic magnification to hug the gemstone contours with invisible precision. An inner comfort-fit band ensures effortless everyday grandeur.</p>`,
      basePriceCents: 450000000, // 4,500,000 NGN in integer kobo
      isPublished: true,
      isFeatured: true,
      allowsCustomEngraving: true,
      maxEngravingLength: 25,
      categoryId: categoryRings.id,
      collectionId: collectionSignature.id,
      specifications: {
        create: {
          gemstoneType: GemstoneType.DIAMOND_NATURAL,
          caratTotalWeight: 2.50,
          cut: DiamondCut.EXCELLENT,
          color: DiamondColor.D,
          clarity: DiamondClarity.VVS1,
          certificateAgency: "GIA",
          certificateNumber: "GTS-GIA-90124",
        },
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85",
            blurHash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
            altText: "The GTStyle Sovereign Solitaire Diamond Ring on cream silk",
            sortOrder: 0,
            isHero: true,
          },
          {
            url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85",
            blurHash: "L9PZfSi_00yE~qt7t7Rj%Mo#DgR4",
            altText: "Macro view of 6-prong head and diamond pavilion",
            sortOrder: 1,
            isHero: false,
          },
          {
            url: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85",
            blurHash: "LFPZfSi_00yE~qt7t7Rj%Mo#DgR4",
            altText: "Side profile showing knife-edge band and atelier hallmark",
            sortOrder: 2,
            isHero: false,
          },
        ],
      },
    },
  });

  // Generate variants for Piece 1: YELLOW_GOLD_18K, WHITE_GOLD_18K, PLATINUM_950 across sizes 5.0 - 7.5
  const ringSizesP1 = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5];
  const metalsP1: { type: MetalType; code: string; priceKobo: number }[] = [
    { type: MetalType.YELLOW_GOLD_18K, code: "18KYG", priceKobo: 450000000 },
    { type: MetalType.WHITE_GOLD_18K, code: "18KWG", priceKobo: 450000000 },
    { type: MetalType.PLATINUM_950, code: "PL950", priceKobo: 485000000 },
  ];

  for (const metal of metalsP1) {
    for (const size of ringSizesP1) {
      await prisma.productVariant.create({
        data: {
          productId: product1.id,
          sku: `GTS-SOV-${metal.code}-SZ${size.toFixed(1)}`,
          metalType: metal.type,
          ringSize: size,
          priceCents: metal.priceKobo,
          stockQuantity: 2,
          isActive: true,
        },
      });
    }
  }
  console.log("Seeded Product 1: The GTStyle Sovereign Solitaire Diamond Ring (18 variants)");

  // --- PIECE 2: The GTStyle Celestia Diamond Tennis Bracelet ---
  const product2 = await prisma.product.create({
    data: {
      name: "The GTStyle Celestia Diamond Tennis Bracelet",
      slug: "gtstyle-celestia-diamond-tennis-bracelet",
      description: "An extraordinary 6.00-carat total weight tennis bracelet featuring 48 perfectly calibrated round brilliant lab diamonds set in 18k white gold. Features a discreet double-safety box clasp.",
      storyHtml: `<p>Named after celestial star trails, each diamond is hand-selected for exact optical consistency (VS1, F-color, Ideal Cut). Engineered with flexible interlocking articulators that glide across the wrist like liquid silk.</p>`,
      basePriceCents: 520000000, // 5,200,000 NGN
      isPublished: true,
      isFeatured: true,
      allowsCustomEngraving: false,
      categoryId: categoryBracelets.id,
      collectionId: collectionSignature.id,
      specifications: {
        create: {
          gemstoneType: GemstoneType.DIAMOND_LAB_GROWN,
          caratTotalWeight: 6.00,
          cut: DiamondCut.EXCELLENT,
          color: DiamondColor.F,
          clarity: DiamondClarity.VS1,
          certificateAgency: "IGI",
          certificateNumber: "GTS-IGI-7718",
        },
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1611591475887-210196238b93?auto=format&fit=crop&w=1200&q=85",
            blurHash: "LCPZfSi_.AyE_3t7t7R**0o#DgR4",
            altText: "The GTStyle Celestia Diamond Tennis Bracelet in 18K White Gold",
            sortOrder: 0,
            isHero: true,
          },
          {
            url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85",
            blurHash: "L9PZfSi_00yE~qt7t7Rj%Mo#DgR4",
            altText: "Macro view of four-prong bracelet link settings",
            sortOrder: 1,
            isHero: false,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "GTS-CEL-18KWG-STD",
            metalType: MetalType.WHITE_GOLD_18K,
            ringSize: null,
            priceCents: 520000000,
            stockQuantity: 3,
            isActive: true,
          },
        ],
      },
    },
  });
  console.log("Seeded Product 2: The GTStyle Celestia Diamond Tennis Bracelet");

  // --- PIECE 3: The GTStyle Emerald Cut Deco Pendant ---
  const product3 = await prisma.product.create({
    data: {
      name: "The GTStyle Emerald Cut Deco Pendant",
      slug: "gtstyle-emerald-cut-deco-pendant",
      description: "A vivid 3.20-carat natural Colombian emerald suspended inside an Art Deco stepped halo of tapered diamond baguettes and 18k solid yellow gold.",
      storyHtml: `<p>Ethically sourced from the historic Muzo mines of Colombia, the centerpiece exhibits the coveted deep verdant saturation characteristic of premier emeralds. Accompanied by an 18-inch adjustable 18k yellow gold wheat chain.</p>`,
      basePriceCents: 380000000, // 3,800,000 NGN
      isPublished: true,
      isFeatured: true,
      allowsCustomEngraving: false,
      categoryId: categoryPendants.id,
      collectionId: collectionSignature.id,
      specifications: {
        create: {
          gemstoneType: GemstoneType.EMERALD,
          caratTotalWeight: 3.20,
          cut: DiamondCut.VERY_GOOD,
          certificateAgency: "GRS GemResearch Swisslab",
          certificateNumber: "GTS-GRS-55019",
        },
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85",
            blurHash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
            altText: "The GTStyle Emerald Cut Deco Pendant in 18k Gold",
            sortOrder: 0,
            isHero: true,
          },
          {
            url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
            blurHash: "LFPZfSi_00yE~qt7t7Rj%Mo#DgR4",
            altText: "Styled jewelry editorial display with gold chain",
            sortOrder: 1,
            isHero: false,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: "GTS-DEC-18KYG-STD",
            metalType: MetalType.YELLOW_GOLD_18K,
            ringSize: null,
            priceCents: 380000000,
            stockQuantity: 2,
            isActive: true,
          },
        ],
      },
    },
  });
  console.log("Seeded Product 3: The GTStyle Emerald Cut Deco Pendant");

  // --- PIECE 4: The GTStyle Eternity Pavé Band ---
  const product4 = await prisma.product.create({
    data: {
      name: "The GTStyle Eternity Pavé Band",
      slug: "gtstyle-eternity-pave-band",
      description: "An unbroken circle of 1.80-carat brilliant natural diamonds micro-pavé set in luminous 18k rose gold. Designed to stack flush against GTStyle solitaires or shine with effortless singular minimalism.",
      storyHtml: `<p>Forged from a continuous single cast of 18k rose gold, the Eternity Pavé Band celebrates infinite devotion. Each microscopic pavé bead is hand-burnished to eliminate rough edges and maximize radiant light scintillation.</p>`,
      basePriceCents: 210000000, // 2,100,000 NGN
      isPublished: true,
      isFeatured: true,
      allowsCustomEngraving: true,
      maxEngravingLength: 25,
      categoryId: categoryRings.id,
      collectionId: collectionPave.id,
      specifications: {
        create: {
          gemstoneType: GemstoneType.DIAMOND_NATURAL,
          caratTotalWeight: 1.80,
          cut: DiamondCut.EXCELLENT,
          color: DiamondColor.E,
          clarity: DiamondClarity.VS1,
          certificateAgency: "GIA",
          certificateNumber: "GTS-GIA-41908",
        },
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&q=85",
            blurHash: "LCPZfSi_.AyE_3t7t7R**0o#DgR4",
            altText: "The GTStyle Eternity Pavé Band in 18k Rose Gold",
            sortOrder: 0,
            isHero: true,
          },
          {
            url: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1200&q=85",
            blurHash: "L9PZfSi_00yE~qt7t7Rj%Mo#DgR4",
            altText: "Macro view of micro-pavé prongs and diamond girdle",
            sortOrder: 1,
            isHero: false,
          },
        ],
      },
    },
  });

  // Generate variants for Piece 4: ROSE_GOLD_18K across sizes 5.0 to 8.0 (5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0)
  const ringSizesP4 = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0];
  for (const size of ringSizesP4) {
    await prisma.productVariant.create({
      data: {
        productId: product4.id,
        sku: `GTS-ETN-18KRG-SZ${size.toFixed(1)}`,
        metalType: MetalType.ROSE_GOLD_18K,
        ringSize: size,
        priceCents: 210000000,
        stockQuantity: 4,
        isActive: true,
      },
    });
  }
  console.log("Seeded Product 4: The GTStyle Eternity Pavé Band (7 variants)");

  console.log("GTStyle Fine Jewelry database seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
