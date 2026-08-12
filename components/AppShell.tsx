"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Heart, Home, LogOut, PackageCheck, Plus } from "lucide-react";
import { ProductsProvider } from "@/hooks/useProducts";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AuthGate } from "@/components/AuthGate";
import { SyncNotices } from "@/components/SyncNotices";

const items = [
  { href: "/", label: "Início", icon: Home },
  { href: "/comprados", label: "Comprados", icon: PackageCheck },
  { href: "/desejos", label: "Desejos", icon: Heart },
  { href: "/produtos/novo", label: "Adicionar", icon: Plus },
];
export function AppShell({ children }: { children: React.ReactNode }) {
  return <AuthProvider><AuthGate><AuthenticatedShell>{children}</AuthenticatedShell></AuthGate></AuthProvider>;
}

function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [logoutError, setLogoutError] = useState("");

  if (pathname === "/login") {
    return <main className="app-content mx-auto w-full max-w-3xl flex-1 px-5 pt-7 sm:px-8 sm:pt-10">{children}</main>;
  }

  return (
    <ProductsProvider>
      <div className="app-shell">
        <main className="app-content mx-auto w-full max-w-3xl flex-1 px-5 pt-7 sm:px-8 sm:pt-10">
          <div className="mb-3 flex justify-end">
            <button onClick={async () => { setLogoutError(""); try { await logout(); } catch (error) { console.error("Falha ao terminar sessão:", error); setLogoutError("Não foi possível terminar a sessão."); } }} className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-slate-500 hover:bg-white" title={user?.email ?? ""}><LogOut size={16} />Terminar sessão</button>
          </div>
          {logoutError && <p className="mb-4 text-right text-xs text-red-700" role="alert">{logoutError}</p>}
          <SyncNotices />
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
