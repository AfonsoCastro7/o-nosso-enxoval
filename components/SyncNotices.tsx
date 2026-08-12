"use client";

import { CloudUpload, X } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

export function SyncNotices() {
  const { error, canMigrate, migrationLoading, migrateLocalData, dismissMigration } = useProducts();
  return (
    <>
      {error && <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}
      {canMigrate && (
        <div className="card mb-6 border-teal-100 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><CloudUpload size={19} /></div>
            <div className="min-w-0 flex-1"><h2 className="font-semibold text-slate-900">Dados neste dispositivo</h2><p className="mt-1 text-sm leading-5 text-slate-500">Encontrámos dados guardados anteriormente. Só serão enviados para a tua conta se confirmares.</p></div>
            <button onClick={dismissMigration} className="p-1 text-slate-400" aria-label="Ignorar importação"><X size={18} /></button>
          </div>
          <button disabled={migrationLoading} onClick={() => void migrateLocalData()} className="button-primary mt-4 w-full disabled:opacity-60">{migrationLoading ? "A importar…" : "Importar os meus dados deste dispositivo"}</button>
        </div>
      )}
    </>
  );
}
