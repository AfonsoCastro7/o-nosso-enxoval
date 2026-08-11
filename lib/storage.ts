import type { Product, ProductInput } from "@/types/product";

const PRODUCTS_KEY = "o-meu-enxoval:products";
const BUDGET_KEY = "o-meu-enxoval:budget";

const demoProducts: Product[] = [
  {
    id: "demo-air-fryer",
    name: "Air Fryer Ninja",
    description: "Para refeições rápidas e práticas.",
    category: "Cozinha",
    status: "wishlist",
    price: 129.99,
    targetPrice: 100,
    store: "Amazon",
    url: "https://www.amazon.es/",
    quantity: 1,
    priority: "essential",
    createdAt: "2026-01-04T10:00:00.000Z",
  },
  {
    id: "demo-panelas",
    name: "Conjunto de panelas",
    category: "Cozinha",
    status: "bought",
    price: 89.99,
    store: "IKEA",
    quantity: 1,
    purchaseDate: "2026-01-12",
    createdAt: "2026-01-12T10:00:00.000Z",
  },
  {
    id: "demo-candeeiro",
    name: "Candeeiro de mesa",
    category: "Quarto",
    status: "wishlist",
    price: 34.99,
    quantity: 1,
    priority: "later",
    createdAt: "2026-01-18T10:00:00.000Z",
  },
  {
    id: "demo-toalhas",
    name: "Conjunto de toalhas",
    category: "Casa de banho",
    status: "bought",
    price: 29.9,
    store: "Zara Home",
    quantity: 2,
    purchaseDate: "2026-02-02",
    createdAt: "2026-02-02T10:00:00.000Z",
  },
];

const browser = () => typeof window !== "undefined";

export function getProducts(): Product[] {
  if (!browser()) return [];
  const stored = window.localStorage.getItem(PRODUCTS_KEY);
  if (stored === null) {
    window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(demoProducts));
    return demoProducts;
  }
  try {
    return JSON.parse(stored) as Product[];
  } catch {
    return [];
  }
}
export const getProduct = (id: string) =>
  getProducts().find((product) => product.id === id);
const saveProducts = (products: Product[]) => {
  if (browser())
    window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return products;
};
export function createProduct(input: ProductInput) {
  const product: Product = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  saveProducts([product, ...getProducts()]);
  return product;
}
export function updateProduct(product: Product) {
  return saveProducts(
    getProducts().map((item) =>
      item.id === product.id
        ? { ...product, updatedAt: new Date().toISOString() }
        : item,
    ),
  );
}
export function deleteProduct(id: string) {
  return saveProducts(getProducts().filter((product) => product.id !== id));
}
export function getBudget() {
  if (!browser()) return undefined;
  const value = window.localStorage.getItem(BUDGET_KEY);
  return value === null ? undefined : Number(value);
}
export function setBudget(value: number) {
  if (browser()) window.localStorage.setItem(BUDGET_KEY, String(value));
}
