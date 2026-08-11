"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import {
  EmptyState,
  FloatingAdd,
  LoadingState,
  PageHeader,
} from "@/components/ui";
import { categories } from "@/data/categories";
import { formatCurrency } from "@/lib/format";
import { useProducts } from "@/hooks/useProducts";
import type { ProductPriority, ProductStatus } from "@/types/product";
export function ProductList({ status }: { status: ProductStatus }) {
  const { products, ready } = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<ProductPriority | "">("");
  const all = products.filter((p) => p.status === status);
  const filtered = useMemo(
    () =>
      all.filter(
        (p) =>
          p.name
            .toLocaleLowerCase("pt")
            .includes(query.toLocaleLowerCase("pt")) &&
          (!category || p.category === category) &&
          (!priority || p.priority === priority),
      ),
    [all, query, category, priority],
  );
  const bought = status === "bought";
  const total = all.reduce((sum, p) => sum + (p.price ?? 0) * p.quantity, 0);
  if (!ready) return <LoadingState />;
  return (
    <>
      <PageHeader
        title={bought ? "Comprados" : "Lista de desejos"}
        subtitle={
          bought
            ? `${all.length} produtos · ${formatCurrency(total)} gastos`
            : `${all.length} produtos que gostavas de ter`
        }
      />
      <div className="mb-6 space-y-3">
        <label className="input-wrap">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar por nome…"
            aria-label="Pesquisar por nome"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Todas as divisões</option>
            {categories.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
          {!bought && (
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as ProductPriority | "")
              }
            >
              <option value="">Todas as prioridades</option>
              <option value="essential">Essencial</option>
              <option value="important">Importante</option>
              <option value="later">Pode esperar</option>
            </select>
          )}
        </div>
      </div>
      {all.length === 0 ? (
        <EmptyState
          title={
            bought
              ? "Ainda não compraste nada."
              : "A tua lista de desejos está vazia."
          }
          text={
            bought
              ? "Quando começares a preparar o teu enxoval, os produtos vão aparecer aqui."
              : "Guarda aqui tudo o que queres comprar para a tua nova casa."
          }
          action={bought ? "Adicionar produto" : "Adicionar desejo"}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Sem resultados"
          text="Experimenta alterar a pesquisa ou os filtros."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
      <FloatingAdd />
    </>
  );
}
