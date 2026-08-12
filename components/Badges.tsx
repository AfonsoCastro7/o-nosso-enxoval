import { getCategory } from "@/data/categories";
import type { ProductPriority } from "@/types/product";
export function CategoryBadge({ category }: { category: string }) {
  const Icon = getCategory(category)?.icon;
  return (
    <span className="badge min-w-0 max-w-full bg-slate-100 text-slate-600">
      {Icon && <Icon className="shrink-0" size={13} />} <span className="min-w-0 break-words">{category}</span>
    </span>
  );
}
const labels: Record<ProductPriority, string> = {
  essential: "Essencial",
  important: "Importante",
  later: "Pode esperar",
};
export function PriorityBadge({ priority }: { priority?: ProductPriority }) {
  if (!priority) return null;
  return (
    <span className={`badge min-w-0 max-w-full priority-${priority}`}>{labels[priority]}</span>
  );
}
