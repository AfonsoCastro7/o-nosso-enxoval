import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  back,
}: {
  title: string;
  subtitle?: string;
  back?: string;
}) {
  return (
    <header className="mb-7">
      {back && (
        <Link
          href={back}
          className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </Link>
      )}
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-[15px] leading-6 text-slate-500">{subtitle}</p>
      )}
    </header>
  );
}
export function LoadingState() {
  return (
    <div className="space-y-4 pt-8" aria-label="A carregar">
      <div className="h-28 animate-pulse rounded-3xl bg-slate-200/70" />
      <div className="h-28 animate-pulse rounded-3xl bg-slate-200/70" />
    </div>
  );
}
export function EmptyState({
  title,
  text,
  action = "Adicionar produto",
}: {
  title: string;
  text: string;
  action?: string;
}) {
  return (
    <div className="card flex flex-col items-center px-7 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
        <Plus />
      </div>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{text}</p>
      <Link href="/produtos/novo" className="button-primary mt-6">
        {action}
      </Link>
    </div>
  );
}
export function FloatingAdd() {
  return (
    <Link
      href="/produtos/novo"
      className="floating-add"
      aria-label="Adicionar produto"
    >
      <Plus size={25} />
    </Link>
  );
}
