"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as storage from "@/lib/storage";
import type { Product, ProductInput } from "@/types/product";

interface ProductsContextValue {
  products: Product[];
  budget?: number;
  ready: boolean;
  addProduct: (product: ProductInput) => Product;
  editProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  changeBudget: (value: number) => void;
}
const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [budget, setBudgetState] = useState<number>();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const task = window.setTimeout(() => {
      setProducts(storage.getProducts());
      setBudgetState(storage.getBudget());
      setReady(true);
    }, 0);
    return () => window.clearTimeout(task);
  }, []);
  const addProduct = useCallback((input: ProductInput) => {
    const product = storage.createProduct(input);
    setProducts(storage.getProducts());
    return product;
  }, []);
  const editProduct = useCallback(
    (product: Product) => setProducts(storage.updateProduct(product)),
    [],
  );
  const removeProduct = useCallback(
    (id: string) => setProducts(storage.deleteProduct(id)),
    [],
  );
  const changeBudget = useCallback((value: number) => {
    storage.setBudget(value);
    setBudgetState(value);
  }, []);
  const value = useMemo(
    () => ({
      products,
      budget,
      ready,
      addProduct,
      editProduct,
      removeProduct,
      changeBudget,
    }),
    [
      products,
      budget,
      ready,
      addProduct,
      editProduct,
      removeProduct,
      changeBudget,
    ],
  );
  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}
export function useProducts() {
  const value = useContext(ProductsContext);
  if (!value)
    throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  return value;
}
