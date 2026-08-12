/* eslint-disable @next/next/no-img-element -- signed URLs from private Storage */
"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ExternalLink, ImageIcon, Pencil, ShoppingBag, Store, Trash2 } from "lucide-react";
import { CategoryBadge, PriorityBadge } from "@/components/Badges";
import { ProductForm } from "@/components/ProductForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingState, PageHeader } from "@/components/ui";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency, formatDate } from "@/lib/format";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { products, ready, editProduct, removeProduct } = useProducts();
  const [editing, setEditing] = useState(false);
  const [buying, setBuying] = useState(false);
  const [actionError, setActionError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const product = products.find((item) => item.id === id);

  if (!ready) return <LoadingState />;
  if (!product) return <><PageHeader title="Produto não encontrado" back="/" /><p className="text-slate-500">Este produto já não existe.</p></>;

  if (editing) {
    return <><PageHeader title="Editar produto" back={`/produtos/${id}`} /><ProductForm initial={product} submitLabel="Guardar alterações" onSubmit={async (input) => { await editProduct({ ...product, ...input }); setEditing(false); }} /></>;
  }

  const remove = async () => {
    if (deleting) return;
    setDeleting(true);
    setActionError("");
    try {
      await removeProduct(id);
      router.push(product.status === "bought" ? "/comprados" : "/desejos");
    } catch (error) {
      console.error(error);
      setActionError("Não foi possível eliminar o produto.");
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return <>
    <PageHeader title={product.name} subtitle={product.status === "bought" ? "Produto comprado" : "Na tua lista de desejos"} back={product.status === "bought" ? "/comprados" : "/desejos"} />
    <div className="mb-5 flex h-72 items-center justify-center overflow-hidden rounded-3xl bg-slate-100 text-slate-400">{product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" /> : <ImageIcon size={42} />}</div>
    <div className="card min-w-0 max-w-full p-5">
      <div className="flex flex-wrap gap-2"><CategoryBadge category={product.category} /><PriorityBadge priority={product.status === "wishlist" ? product.priority : undefined} /></div>
      {product.description && <p className="mt-5 break-words leading-7 text-slate-600">{product.description}</p>}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Info label={product.status === "bought" ? "Preço total pago" : "Preço atual total"} value={formatCurrency(product.price)} />
        {product.targetPrice !== undefined && <Info label="Preço alvo" value={formatCurrency(product.targetPrice)} />}
        <Info label="Quantidade" value={String(product.quantity)} />
        {product.store && <Info label="Loja" value={product.store} icon={<Store size={15} />} />}
        {product.purchaseDate && <Info label="Data da compra" value={formatDate(product.purchaseDate)} icon={<Calendar size={15} />} />}
      </div>
      {product.notes && <div className="mt-6 min-w-0 border-t border-slate-100 pt-5"><p className="label">Notas</p><p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">{product.notes}</p></div>}
      {product.url && <a href={product.url} target="_blank" rel="noreferrer" className="button-secondary mt-5 w-full">Ver produto <ExternalLink size={17} /></a>}
    </div>
    {product.status === "wishlist" && <button onClick={() => setBuying(true)} className="button-primary mt-4 w-full"><ShoppingBag size={18} />Marcar como comprado</button>}
    {buying && <BuyPanel onCancel={() => setBuying(false)} onSave={async (price, store, purchaseDate) => { await editProduct({ ...product, status: "bought", price, store: store || product.store, purchaseDate }); setBuying(false); }} />}
    {actionError && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>}
    <div className="mt-4 grid grid-cols-2 gap-3"><button className="button-secondary" onClick={() => setEditing(true)}><Pencil size={17} />Editar</button><button className="button-danger" onClick={() => setDeleteDialogOpen(true)}><Trash2 size={17} />Eliminar</button></div>
    <ConfirmDialog
      open={deleteDialogOpen}
      title="Eliminar produto?"
      description="Esta ação é permanente. O produto e a imagem associada serão eliminados."
      confirmLabel="Eliminar"
      destructive
      loading={deleting}
      onCancel={() => setDeleteDialogOpen(false)}
      onConfirm={remove}
    />
  </>;
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div className="min-w-0"><p className="label">{label}</p><p className="flex min-w-0 items-center gap-1.5 break-words font-semibold text-slate-800">{icon}{value}</p></div>;
}

function BuyPanel({ onCancel, onSave }: { onCancel: () => void; onSave: (price: number, store: string, date: string) => Promise<void> }) {
  const [price, setPrice] = useState("");
  const [store, setStore] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const save = async () => { setSaving(true); setError(""); try { await onSave(Number(price), store, date); } catch (saveError) { console.error(saveError); setError("Não foi possível concluir a compra."); setSaving(false); } };
  return <div className="card mt-4 min-w-0 space-y-4 border border-teal-100 p-5"><h2 className="font-bold">Concluir compra</h2><label><span className="label">Preço total pago *</span><input autoFocus required type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} /><span className="mt-1.5 block text-xs leading-5 text-slate-500">Valor total da compra, independentemente da quantidade.</span></label><label><span className="label">Loja</span><input value={store} onChange={(event) => setStore(event.target.value)} /></label><label><span className="label">Data da compra</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>{error && <p className="text-sm text-red-700">{error}</p>}<div className="flex gap-3"><button className="button-secondary min-w-0 flex-1" onClick={onCancel}>Cancelar</button><button disabled={price === "" || saving} className="button-primary min-w-0 flex-1 disabled:opacity-50" onClick={() => void save()}>{saving ? "A guardar…" : "Guardar"}</button></div></div>;
}
