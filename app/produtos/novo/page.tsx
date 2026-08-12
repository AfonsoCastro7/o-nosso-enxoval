"use client";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/ProductForm";
import { PageHeader } from "@/components/ui";
import { useProducts } from "@/hooks/useProducts";
export default function NewProductPage() { const router = useRouter(); const { addProduct } = useProducts(); return <><PageHeader title="Adicionar produto" subtitle="Guarda uma compra ou algo que desejas." back="/"/><ProductForm onSubmit={async (input) => { const product = await addProduct(input); router.push(`/produtos/${product.id}`); }}/></>; }
