"use client";
import { useState } from "react";
import { Check, Heart, Package, Pencil, PiggyBank, Wallet } from "lucide-react";
import { categories } from "@/data/categories";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/format";
import { FloatingAdd, LoadingState, PageHeader } from "@/components/ui";
export function Dashboard() {
  const { products, budget, ready, changeBudget } = useProducts();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [budgetError, setBudgetError] = useState("");
  if (!ready) return <LoadingState />;
  const bought = products.filter((p) => p.status === "bought");
  const wishlist = products.filter((p) => p.status === "wishlist");
  const spent = bought.reduce((s, p) => s + (p.price ?? 0), 0);
  const percent = budget ? Math.min(100, (spent / budget) * 100) : 0;
  const stats = [
    { label: "Total gasto", value: formatCurrency(spent), icon: Wallet },
    { label: "Comprados", value: String(bought.length), icon: Check },
    { label: "Desejos", value: String(wishlist.length), icon: Heart },
    { label: "Total", value: String(products.length), icon: Package },
  ];
  const save = async () => {
    const value = Number(draft);
    if (value > 0) {
      setBudgetError("");
      try {
        await changeBudget(value);
        setEditing(false);
      } catch (saveError) {
        console.error(saveError);
        setBudgetError("Não foi possível guardar o orçamento.");
      }
    }
  };
  return (
    <>
      <PageHeader
        title="O Nosso Enxoval"
        subtitle="Tudo o que precisas para a tua nova casa."
      />
      <section className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="card p-4" key={label}>
            <Icon className="mb-5 text-teal-700" size={21} />
            <p className="text-xl font-bold text-slate-900">{value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
          </div>
        ))}
      </section>
      <section className="budget-card card mt-6 overflow-hidden p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <PiggyBank size={20} />
            Orçamento
          </div>
          {budget && !editing && (
            <button
              onClick={() => {
                setDraft(String(budget));
                setEditing(true);
              }}
              className="p-2 text-slate-500"
              aria-label="Editar orçamento"
            >
              <Pencil size={17} />
            </button>
          )}
        </div>
        {budget && !editing ? (
          <>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <div>
                <span>Orçamento</span>
                <strong>{formatCurrency(budget)}</strong>
              </div>
              <div>
                <span>Gasto</span>
                <strong>{formatCurrency(spent)}</strong>
              </div>
              <div>
                <span>Restante</span>
                <strong>{formatCurrency(budget - spent)}</strong>
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/70">
              <div
                className="h-full rounded-full bg-teal-700"
                style={{ width: `${percent}%` }}
              />
            </div>
          </>
        ) : editing ? (
          <>
            <div className="mt-5 flex gap-2">
              <input
                autoFocus
                className="!border-[#D9D0C7] !bg-white/70 !text-slate-900"
                type="number"
                min="1"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="5000"
              />
              <button
                onClick={() => void save()}
                className="rounded-xl bg-teal-700 px-5 font-semibold text-white"
              >
                Guardar
              </button>
            </div>
            {budgetError && <p className="mt-3 text-sm text-red-700">{budgetError}</p>}
          </>
        ) : (
          <button
            className="mt-5 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900"
            onClick={() => setEditing(true)}
          >
            Definir orçamento
          </button>
        )}
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Por divisão</h2>
        <div className="card divide-y divide-slate-100 px-4">
          {categories.map((category) => {
            const items = products.filter((p) => p.category === category.name);
            if (!items.length) return null;
            const total = items
              .filter((p) => p.status === "bought")
              .reduce((s, p) => s + (p.price ?? 0), 0);
            const Icon = category.icon;
            return (
              <div key={category.name} className="flex min-w-0 items-center gap-3 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">
                    {category.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {items.length} {items.length === 1 ? "produto" : "produtos"}
                  </p>
                </div>
                <p className="font-semibold text-slate-700">
                  {formatCurrency(total)}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      <FloatingAdd />
    </>
  );
}
