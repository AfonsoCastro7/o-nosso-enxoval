"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import * as productService from "@/lib/products";
import * as settingsService from "@/lib/settings";
import { importLegacyData } from "@/lib/migration";
import { getLegacyData, markMigrationHandled, migrationWasHandled } from "@/lib/storage";
import type { Product, ProductInput } from "@/types/product";

interface ProductsContextValue {
  products: Product[];
  budget?: number;
  ready: boolean;
  loading: boolean;
  error?: string;
  canMigrate: boolean;
  migrationLoading: boolean;
  addProduct: (product: ProductInput) => Promise<Product>;
  editProduct: (product: Product) => Promise<Product>;
  removeProduct: (id: string) => Promise<void>;
  changeBudget: (value: number) => Promise<void>;
  refreshProducts: () => Promise<void>;
  migrateLocalData: () => Promise<void>;
  dismissMigration: () => void;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);
const friendlyError = "Não foi possível sincronizar os dados. Verifica a ligação à internet e tenta novamente.";

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [budget, setBudget] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [canMigrate, setCanMigrate] = useState(false);
  const [migrationLoading, setMigrationLoading] = useState(false);

  const refreshProducts = useCallback(async () => {
    if (!user) return;
    setError(undefined);
    try {
      const [nextProducts, nextBudget] = await Promise.all([
        productService.getProducts(user.id),
        settingsService.getBudget(user.id),
      ]);
      setProducts(nextProducts);
      setBudget(nextBudget);
      const legacy = getLegacyData();
      setCanMigrate(
        nextProducts.length === 0 &&
          (legacy.products.length > 0 || legacy.budget !== undefined) &&
          !migrationWasHandled(user.id),
      );
    } catch (requestError) {
      console.error("Falha ao carregar dados do Supabase:", requestError);
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void refreshProducts(), 0);
    const interval = window.setInterval(() => void refreshProducts(), 50 * 60 * 1000);
    const onFocus = () => void refreshProducts();
    window.addEventListener("focus", onFocus);
    return () => { window.clearTimeout(initialLoad); window.clearInterval(interval); window.removeEventListener("focus", onFocus); };
  }, [refreshProducts]);

  const addProduct = useCallback(async (input: ProductInput) => {
    if (!user) throw new Error("Sessão inválida.");
    try {
      const product = await productService.createProduct(user.id, input);
      setProducts((current) => [product, ...current]);
      return product;
    } catch (requestError) {
      console.error("Falha ao criar produto:", requestError);
      throw new Error("Não foi possível guardar o produto.");
    }
  }, [user]);

  const editProduct = useCallback(async (product: Product) => {
    if (!user) throw new Error("Sessão inválida.");
    try {
      const updated = await productService.updateProduct(user.id, product);
      setProducts((current) => current.map((item) => item.id === updated.id ? updated : item));
      return updated;
    } catch (requestError) {
      console.error("Falha ao atualizar produto:", requestError);
      throw new Error("Não foi possível guardar as alterações.");
    }
  }, [user]);

  const removeProduct = useCallback(async (id: string) => {
    if (!user) throw new Error("Sessão inválida.");
    const product = products.find((item) => item.id === id);
    if (!product) return;
    try {
      await productService.deleteProduct(user.id, product);
      setProducts((current) => current.filter((item) => item.id !== id));
    } catch (requestError) {
      console.error("Falha ao eliminar produto:", requestError);
      throw new Error("Não foi possível eliminar o produto.");
    }
  }, [products, user]);

  const changeBudget = useCallback(async (value: number) => {
    if (!user) throw new Error("Sessão inválida.");
    try {
      await settingsService.saveBudget(user.id, value);
      setBudget(value);
    } catch (requestError) {
      console.error("Falha ao guardar orçamento:", requestError);
      throw new Error("Não foi possível guardar o orçamento.");
    }
  }, [user]);

  const migrateLocalData = useCallback(async () => {
    if (!user) return;
    setMigrationLoading(true);
    setError(undefined);
    try {
      await importLegacyData(user.id);
      setCanMigrate(false);
      await refreshProducts();
    } catch (migrationError) {
      console.error("Falha na importação local:", migrationError);
      setError("A importação não ficou concluída. Os dados locais foram preservados; tenta novamente.");
    } finally {
      setMigrationLoading(false);
    }
  }, [refreshProducts, user]);

  const dismissMigration = useCallback(() => {
    if (user) markMigrationHandled(user.id);
    setCanMigrate(false);
  }, [user]);

  const value = useMemo(() => ({ products, budget, ready: !loading, loading, error, canMigrate, migrationLoading, addProduct, editProduct, removeProduct, changeBudget, refreshProducts, migrateLocalData, dismissMigration }), [products, budget, loading, error, canMigrate, migrationLoading, addProduct, editProduct, removeProduct, changeBudget, refreshProducts, migrateLocalData, dismissMigration]);
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const value = useContext(ProductsContext);
  if (!value) throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  return value;
}
