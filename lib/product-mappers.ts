import type { DatabaseProduct } from "@/types/database";
import type { Product, ProductInput, ProductPriority, ProductStatus } from "@/types/product";

const optional = (value?: string) => value?.trim() || null;
const numberOrUndefined = (value: number | string | null) =>
  value === null ? undefined : Number(value);

export function mapDatabaseProductToProduct(
  row: DatabaseProduct,
  signedImageUrl?: string,
): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    category: row.category,
    status: row.status as ProductStatus,
    image: signedImageUrl ?? row.image_url ?? undefined,
    imagePath: row.image_path ?? undefined,
    price: numberOrUndefined(row.price),
    targetPrice: numberOrUndefined(row.target_price),
    store: row.store ?? undefined,
    url: row.url ?? undefined,
    quantity: row.quantity,
    priority: (row.priority as ProductPriority | null) ?? undefined,
    purchaseDate: row.purchase_date ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

export function mapProductToDatabaseProduct(
  product: ProductInput,
  userId: string,
  id: string,
  imagePath?: string,
) {
  return {
    id,
    user_id: userId,
    name: product.name.trim(),
    description: optional(product.description),
    category: product.category,
    status: product.status,
    image_url: null,
    image_path: imagePath ?? null,
    price: product.price ?? null,
    target_price: product.targetPrice ?? null,
    store: optional(product.store),
    url: optional(product.url),
    quantity: product.quantity,
    priority: product.priority ?? null,
    purchase_date: optional(product.purchaseDate),
    notes: optional(product.notes),
    updated_at: new Date().toISOString(),
  };
}
