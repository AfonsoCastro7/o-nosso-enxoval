export type ProductStatus = "bought" | "wishlist";
export type ProductPriority = "essential" | "important" | "later";

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: ProductStatus;
  image?: string;
  imagePath?: string;
  price?: number;
  targetPrice?: number;
  store?: string;
  url?: string;
  quantity: number;
  priority?: ProductPriority;
  purchaseDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;
