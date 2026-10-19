import Link from "next/link";
import Image from "next/image";
import { PlusCircle, Gem, ExternalLink } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatNaira, formatMetalType } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      category: true,
      specifications: true,
    },
  });

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-champagne">
            Product Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-alabaster font-light tracking-wide mt-1">
            Jewelry Products
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-champagne hover:bg-champagne-light text-obsidian text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors shadow-lg"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      <div className="bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900/80 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4 font-medium text-champagne">Item</th>
                <th className="py-3.5 px-4 font-medium">Category</th>
                <th className="py-3.5 px-4 font-medium">Base Price</th>
                <th className="py-3.5 px-4 font-medium">Variants</th>
                <th className="py-3.5 px-4 font-medium">Total Stock</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-4 font-medium text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {products.map((product) => {
                const heroImg = product.images[0]?.url || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=85";
                const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);

                return (
                  <tr key={product.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-sm bg-neutral-900 border border-neutral-800 overflow-hidden flex-shrink-0">
                          <Image
                            src={heroImg}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-serif text-sm font-medium text-alabaster">
                            {product.name}
                          </div>
                          <div className="text-[10px] text-neutral-500 font-mono">
                            slug: {product.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">
                      {product.category.name}
                    </td>
                    <td className="py-3.5 px-4 font-serif font-semibold text-champagne text-sm">
                      {formatNaira(product.basePriceCents)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-300">
                      {product.variants.length} Matrix Entries
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={totalStock > 0 ? "text-emerald-400" : "text-red-400 font-bold"}>
                        {totalStock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                        Published
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="inline-flex items-center space-x-1 text-neutral-400 hover:text-champagne transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
