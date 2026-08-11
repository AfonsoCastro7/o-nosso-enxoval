"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, PackageCheck, Plus } from "lucide-react";
import { ProductsProvider } from "@/hooks/useProducts";

const items = [
  { href: "/", label: "Início", icon: Home },
  { href: "/comprados", label: "Comprados", icon: PackageCheck },
  { href: "/desejos", label: "Desejos", icon: Heart },
  { href: "/produtos/novo", label: "Adicionar", icon: Plus },
];
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ProductsProvider>
      <div className="app-shell">
      <main className="app-content mx-auto w-full max-w-3xl flex-1 px-5 pt-7 sm:px-8 sm:pt-10">
          {children}
        </main>
        <nav className="bottom-nav" aria-label="Navegação principal">
          <div className="mx-auto flex h-full max-w-xl items-center justify-around px-3">
            {items.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href.replace("/novo", ""));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-item ${active ? "nav-item-active" : ""}`}
                >
                  <Icon size={21} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </ProductsProvider>
  );
}
