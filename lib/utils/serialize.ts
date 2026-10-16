import { Prisma } from "@prisma/client";

/**
 * Deeply converts Prisma.Decimal instances into standard JavaScript numbers
 * and converts objects into plain serializable structures for React Server Components.
 */
export function serializeDecimals<T>(data: T): any {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle Prisma.Decimal
  if (Prisma.Decimal.isDecimal(data)) {
    return (data as Prisma.Decimal).toNumber();
  }

  // Handle Arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializeDecimals(item));
  }

  // Handle Objects
  if (typeof data === "object") {
    // Preserve Date instances as React Server Components serialize them natively
    if (data instanceof Date) {
      return data;
    }

    const copy: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      copy[key] = serializeDecimals(value);
    }
    return copy;
  }

  return data;
}

/**
 * Specific helper to serialize a single product with variants and specifications.
 */
export function serializeProduct<T extends Record<string, any>>(product: T): any {
  return serializeDecimals(product);
}

/**
 * Specific helper to serialize an array of products.
 */
export function serializeProducts<T extends Record<string, any>>(products: T[]): any[] {
  return products.map((p) => serializeDecimals(p));
}
