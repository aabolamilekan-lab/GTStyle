"use server";

import { prisma } from "@/lib/prisma";
import { orderPlacementSchema, OrderPlacementInput } from "@/lib/validations/order";
import { nanoid } from "nanoid";

export async function submitConciergeOrder(rawInput: OrderPlacementInput) {
  try {
    // 1. Zod parse and validation
    const validated = orderPlacementSchema.parse(rawInput);

    // 2. Server-Authoritative Pricing: Fetch live variants from database
    const variantIds = validated.items.map((i) => i.variantId);
    const dbVariants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds }, isActive: true },
      include: { product: true },
    });

    if (dbVariants.length !== validated.items.length) {
      throw new Error("One or more selected items are no longer available.");
    }

    // 3. Compute totals strictly in integer kobo
    let subtotalCents = 0;
    const preparedItems = validated.items.map((item) => {
      const variant = dbVariants.find((v) => v.id === item.variantId);
      if (!variant) {
        throw new Error("Selected jewelry item was not found in our store.");
      }

      if (variant.stockQuantity < item.quantity) {
        throw new Error(`Sorry, this item is out of stock.`);
      }

      const itemTotal = variant.priceCents * item.quantity;
      subtotalCents += itemTotal;

      return {
        variantId: variant.id,
        quantity: item.quantity,
        unitPriceCents: variant.priceCents,
        totalPriceCents: itemTotal,
        productNameSnapshot: variant.product.name,
        metalTypeSnapshot: variant.metalType,
        ringSizeSnapshot: variant.ringSize,
        skuSnapshot: variant.sku,
        engravingText: item.engravingText ? item.engravingText.trim().slice(0, 25) : null,
      };
    });

    const shippingCents = 0; // Armored courier is complimentary
    const totalCents = subtotalCents + shippingCents;
    const orderNumber = `GTS-${new Date().getFullYear()}-${nanoid(5).toUpperCase()}`;

    // 4. Atomic transaction
    const order = await prisma.$transaction(async (tx) => {
      const address = await tx.address.create({
        data: {
          recipient: validated.customerName,
          phone: validated.customerPhone,
          line1: validated.addressLine1,
          line2: validated.addressLine2 || null,
          city: validated.city,
          state: validated.state,
          country: "Nigeria",
          user: {
            connectOrCreate: {
              where: { email: validated.customerEmail },
              create: {
                email: validated.customerEmail,
                name: validated.customerName,
                phone: validated.customerPhone,
              },
            },
          },
        },
      });

      return await tx.order.create({
        data: {
          orderNumber,
          customerName: validated.customerName,
          customerPhone: validated.customerPhone,
          customerEmail: validated.customerEmail,
          deliveryAddressId: address.id,
          requiredDeliveryDate: validated.requiredDeliveryDate,
          orderNotes: validated.orderNotes || null,
          subtotalCents,
          shippingCents,
          totalCents,
          status: "AWAITING_PAYMENT",
          items: {
            create: preparedItems,
          },
        },
      });
    });

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    };
  } catch (error: unknown) {
    console.error("Error submitting order:", error);
    const message = error instanceof Error ? error.message : "Failed to place order. Please try again.";
    return {
      success: false,
      error: message,
    };
  }
}
