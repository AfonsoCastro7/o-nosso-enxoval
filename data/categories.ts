import type { LucideIcon } from "lucide-react";
import { Armchair, Bath, BedDouble, CookingPot, Lamp, Plug, Shirt, Sparkles, Package } from "lucide-react";

export interface Category { name: string; icon: LucideIcon }

export const categories: Category[] = [
  { name: "Cozinha", icon: CookingPot },
  { name: "Sala", icon: Armchair },
  { name: "Quarto", icon: BedDouble },
  { name: "Casa de banho", icon: Bath },
  { name: "Lavandaria", icon: Shirt },
  { name: "Limpeza", icon: Sparkles },
  { name: "Eletrodomésticos", icon: Plug },
  { name: "Decoração", icon: Lamp },
  { name: "Outros", icon: Package },
];

export const getCategory = (name: string) => categories.find((category) => category.name === name);
