export const SELLER_CONFIG = {
  brandName: process.env.NEXT_PUBLIC_SELLER_BRAND || "GTStyle Fashion Jewelry",
  phone: process.env.NEXT_PUBLIC_SELLER_PHONE || "+2348000000000",
  whatsappNumber: process.env.NEXT_PUBLIC_SELLER_WHATSAPP || "2348000000000", // International format without '+'
  email: process.env.NEXT_PUBLIC_SELLER_EMAIL || "Gtstyle@gmail.com",
  bankDetails: {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || "Guaranty Trust Bank (GTBank)",
    accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "GTStyle Fashion Jewelry Ltd",
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || "0123456789",
    instructions: "Please include your Order Number in your payment description.",
  },
} as const;

export type SellerConfig = typeof SELLER_CONFIG;
