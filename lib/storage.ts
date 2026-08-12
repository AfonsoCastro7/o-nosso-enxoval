import type { Product } from "@/types/product";

const PRODUCTS_KEY = "o-meu-enxoval:products";
const BUDGET_KEY = "o-meu-enxoval:budget";
const MIGRATION_KEY = "o-meu-enxoval:supabase-migration";

export interface LegacyData {
  products: Product[];
  budget?: number;
}

export function getLegacyData(): LegacyData {
  if (typeof window === "undefined") return { products: [] };
  let products: Product[] = [];
  try {
    const raw = window.localStorage.getItem(PRODUCTS_KEY);
    if (raw) products = JSON.parse(raw) as Product[];
  } catch (error) {
    console.error("Não foi possível ler os produtos locais:", error);
  }
  const rawBudget = window.localStorage.getItem(BUDGET_KEY);
  const budget = rawBudget === null ? undefined : Number(rawBudget);
  return { products, budget: Number.isFinite(budget) ? budget : undefined };
}

export function migrationWasHandled(userId: string) {
  return typeof window !== "undefined" &&
    window.localStorage.getItem(`${MIGRATION_KEY}:${userId}`) === "done";
}

export function markMigrationHandled(userId: string) {
  window.localStorage.setItem(`${MIGRATION_KEY}:${userId}`, "done");
}
