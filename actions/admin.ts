"use server";

import { prisma } from "@/lib/prisma";
import { OrderStatus, MetalType, GemstoneType, DiamondCut, DiamondColor, DiamondClarity } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Confirms bank transfer settlement atomically:
 * 1. Checks current status is AWAITING_PAYMENT.
 * 2. Updates status to PAYMENT_CONFIRMED.
 * 3. Automatically decrements stockQuantity for each variant.
 */
export async function confirmBankTransfer(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return { success: false, error: "Order not found." };
    }

    if (order.status !== "AWAITING_PAYMENT") {
      return {
        success: false,
        error: `Cannot confirm settlement: Order is already in status ${order.status}.`,
      };
    }

    // Atomic transaction
    await prisma.$transaction(async (tx) => {
      // 1. Update order status
      await tx.order.update({
        where: { id: orderId },
        data: { status: "PAYMENT_CONFIRMED" },
      });

      // 2. Decrement stock for each item variant
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error: unknown) {
    console.error("Error confirming bank transfer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to confirm bank transfer.",
    };
  }
}

/**
 * Advances production pipeline status:
 * PAYMENT_CONFIRMED -> CRAFTING -> SHIPPED -> DELIVERED
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  consignmentReference?: string
) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        paymentProofUrl: consignmentReference ? `Consignment: ${consignmentReference}` : undefined,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update order status.",
    };
  }
}

/**
 * Creates a luxury product with its full variant matrix and gemological specs
 */
export interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  storyHtml?: string;
  basePriceCents: number;
  categoryId: string;
  collectionId?: string;
  allowsCustomEngraving: boolean;
  images: { url: string; altText: string; isHero: boolean; sortOrder: number }[];
  variants: {
    sku: string;
    metalType: MetalType;
    ringSize: number | null;
    priceCents: number;
    stockQuantity: number;
  }[];
  specifications?: {
    gemstoneType: GemstoneType;
    caratTotalWeight?: number;
    cut?: DiamondCut;
    color?: DiamondColor;
    clarity?: DiamondClarity;
    certificateAgency?: string;
    certificateNumber?: string;
  };
}

export async function createProductWithVariants(input: CreateProductInput) {
  try {
    const product = await prisma.product.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        storyHtml: input.storyHtml,
        basePriceCents: input.basePriceCents,
        categoryId: input.categoryId,
        collectionId: input.collectionId || null,
        allowsCustomEngraving: input.allowsCustomEngraving,
        images: {
          create: input.images.map((img, idx) => ({
            url: img.url,
            altText: img.altText || input.name,
            isHero: idx === 0,
            sortOrder: idx,
          })),
        },
        variants: {
          create: input.variants.map((v) => ({
            sku: v.sku,
            metalType: v.metalType,
            ringSize: v.ringSize !== null ? v.ringSize : null,
            priceCents: v.priceCents,
            stockQuantity: v.stockQuantity,
            isActive: true,
          })),
        },
        specifications: input.specifications
          ? {
              create: {
                gemstoneType: input.specifications.gemstoneType,
                caratTotalWeight: input.specifications.caratTotalWeight || null,
                cut: input.specifications.cut || null,
                color: input.specifications.color || null,
                clarity: input.specifications.clarity || null,
                certificateAgency: input.specifications.certificateAgency || null,
                certificateNumber: input.specifications.certificateNumber || null,
              },
            }
          : undefined,
      },
    });

    revalidatePath("/shop");
    revalidatePath("/admin/products");

    return { success: true, productId: product.id, slug: product.slug };
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create piece in vault.",
    };
  }
}
