"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingState } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/login";

  useEffect(() => {
    if (!loading && !user && !isLogin) router.replace("/login");
    if (!loading && user && isLogin) router.replace("/");
  }, [isLogin, loading, router, user]);

  if (loading) return <div className="mx-auto w-full max-w-md px-5 pt-20"><LoadingState /></div>;
  if ((!user && !isLogin) || (user && isLogin)) return null;
  return children;
}
