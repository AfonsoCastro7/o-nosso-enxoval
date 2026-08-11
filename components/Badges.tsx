import { getCategory } from "@/data/categories";
import type { ProductPriority } from "@/types/product";
export function CategoryBadge({ category }: { category: string }) {
  const Icon = getCategory(category)?.icon;
  return (
    <span className="badge bg-slate-100 text-slate-600">
      {Icon && <Icon size={13} />} {category}
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
    <span className={`badge priority-${priority}`}>{labels[priority]}</span>
  );
}
