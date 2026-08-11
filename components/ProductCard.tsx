"use client";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ImageIcon, Store } from "lucide-react";
import { CategoryBadge, PriorityBadge } from "@/components/Badges";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Product } from "@/types/product";
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card group overflow-hidden p-3 transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/produtos/${product.id}`} className="block">
        <div className="flex gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-400">
          {product.image ? (
            <Image
              src={product.image}
              alt=""
              width={96}
              height={96}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon size={25} />
          )}
        </div>
        <div className="min-w-0 flex-1 py-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="truncate font-semibold text-slate-900">
              {product.name}
            </h2>
            <span className="shrink-0 font-semibold text-slate-900">
              {formatCurrency(product.price)}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <CategoryBadge category={product.category} />
            <PriorityBadge
              priority={
                product.status === "wishlist" ? product.priority : undefined
              }
            />
          </div>
          {product.targetPrice !== undefined && (
            <p className="mt-2 text-xs text-teal-700">
              Objetivo: {formatCurrency(product.targetPrice)}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
            {product.quantity > 1 && <span>{product.quantity} unidades</span>}
            {product.store && (
              <span className="flex items-center gap-1">
                <Store size={12} />
                {product.store}
              </span>
            )}
            {product.purchaseDate && (
              <span>{formatDate(product.purchaseDate)}</span>
            )}
          </div>
        </div>
        </div>
      </Link>
      {product.status === "wishlist" && product.url && (
        <a
          href={product.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        >
          Ver produto <ExternalLink size={15} />
        </a>
      )}
    </article>
  );
}
