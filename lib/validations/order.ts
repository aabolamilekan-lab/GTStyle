import { z } from "zod";

export const orderPlacementSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100),
  customerPhone: z
    .string()
    .trim()
    .regex(
      /^(\+234|0)[789][01]\d{8}$/,
      "Provide a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)"
    ),
  customerEmail: z.string().trim().email("Please provide a valid email address"),
  addressLine1: z
    .string()
    .trim()
    .min(5, "Delivery address must be detailed (min 5 characters)"),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  requiredDeliveryDate: z.coerce.date().refine(
    (date) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return date >= tomorrow;
    },
    {
      message:
        "Delivery date must be at least 24 hours from today.",
    }
  ),
  orderNotes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().positive(),
        engravingText: z.string().max(25).optional(),
      })
    )
    .min(1, "Your cart cannot be empty"),
});

export type OrderPlacementInput = z.infer<typeof orderPlacementSchema>;
