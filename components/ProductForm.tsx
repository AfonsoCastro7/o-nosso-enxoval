"use client";
import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { categories } from "@/data/categories";
import { ImagePicker } from "@/components/ImagePicker";
import type {
  Product,
  ProductInput,
  ProductPriority,
} from "@/types/product";

const empty: ProductInput = {
  name: "",
  description: "",
  category: "",
  status: "bought",
  image: undefined,
  price: undefined,
  targetPrice: undefined,
  store: "",
  url: "",
  quantity: 1,
  priority: "important",
  purchaseDate: "",
  notes: "",
};
const numeric = (value: string) => (value === "" ? undefined : Number(value));
export function ProductForm({
  initial,
  onSubmit,
  submitLabel = "Guardar produto",
}: {
  initial?: Product;
  onSubmit: (input: ProductInput) => Promise<void>;
  submitLabel?: string;
}) {
  const [form, setForm] = useState<ProductInput>(
    initial ? { ...initial } : empty,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((old) => ({ ...old, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSubmit(form);
    } catch (submitError) {
      console.error("Falha ao submeter produto:", submitError);
      setError(submitError instanceof Error ? submitError.message : "Não foi possível guardar o produto.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-7">
      <div className="segmented">
        <button
          type="button"
          className={form.status === "bought" ? "active" : ""}
          onClick={() => set("status", "bought")}
        >
          Comprado
        </button>
        <button
          type="button"
          className={form.status === "wishlist" ? "active" : ""}
          onClick={() => set("status", "wishlist")}
        >
          Lista de desejos
        </button>
      </div>
      <ImagePicker
        value={form.image}
        onChange={(value) => set("image", value)}
      />
      <div className="form-section">
        <label>
          <span className="label">Nome *</span>
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Ex.: Máquina de café"
          />
        </label>
        <label>
          <span className="label">Descrição</span>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Uma breve descrição…"
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="min-w-0">
            <span className="label">Divisão *</span>
            <select
              required
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option value="">Escolher</option>
              {categories.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="min-w-0">
            <span className="label">Quantidade</span>
            <input
              required
              min="1"
              type="number"
              value={form.quantity}
              onChange={(e) =>
                set("quantity", Math.max(1, Number(e.target.value)))
              }
            />
          </label>
        </div>
      </div>
      <div className="form-section">
        <div className="grid grid-cols-2 gap-4">
          <label className="min-w-0">
            <span className="label">
              {form.status === "bought"
                ? "Preço total pago"
                : "Preço atual total"}
            </span>
            <input
              min="0"
              step="0.01"
              inputMode="decimal"
              type="number"
              value={form.price ?? ""}
              onChange={(e) => set("price", numeric(e.target.value))}
              placeholder="0,00"
            />
            <span className="mt-1.5 block text-xs leading-5 text-slate-500">
              Valor total, independentemente da quantidade.
            </span>
          </label>
          {form.status === "bought" ? (
            <label className="min-w-0">
              <span className="label">Data da compra</span>
              <input
                type="date"
                value={form.purchaseDate}
                onChange={(e) => set("purchaseDate", e.target.value)}
              />
            </label>
          ) : (
            <label className="min-w-0">
              <span className="label">Preço alvo</span>
              <input
                min="0"
                step="0.01"
                inputMode="decimal"
                type="number"
                value={form.targetPrice ?? ""}
                onChange={(e) => set("targetPrice", numeric(e.target.value))}
                placeholder="0,00"
              />
            </label>
          )}
        </div>
        <label>
          <span className="label">Loja</span>
          <input
            value={form.store}
            onChange={(e) => set("store", e.target.value)}
            placeholder="Ex.: IKEA"
          />
        </label>
        {form.status === "wishlist" && (
          <>
            <label>
              <span className="label">Link do produto</span>
              <input
                type="url"
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
                placeholder="https://…"
              />
            </label>
            <label>
              <span className="label">Prioridade</span>
              <select
                value={form.priority}
                onChange={(e) =>
                  set("priority", e.target.value as ProductPriority)
                }
              >
                <option value="essential">Essencial</option>
                <option value="important">Importante</option>
                <option value="later">Pode esperar</option>
              </select>
            </label>
          </>
        )}
      </div>
      <label>
        <span className="label">Notas</span>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Medidas, cor, referências…"
        />
      </label>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
      <button disabled={saving} className="button-primary w-full disabled:opacity-60" type="submit">
        <Save size={18} />
        {saving ? "A guardar…" : submitLabel}
      </button>
    </form>
  );
}
