"use client";

import { useState, type FormEvent } from "react";
import { Home, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (loginError) {
      console.error("Falha no login:", loginError);
      setError("Não foi possível iniciar sessão. Confirma o email e a password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[75svh] w-full max-w-sm items-center">
      <div className="card w-full p-6 sm:p-8">
        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <Home size={27} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">O Nosso Enxoval</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Entra para sincronizares o teu enxoval em todos os dispositivos.</p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <label><span className="label">Email</span><input required autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label><span className="label">Password</span><input required autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
          <button disabled={submitting} className="button-primary w-full disabled:opacity-60" type="submit"><LogIn size={18} />{submitting ? "A entrar…" : "Entrar"}</button>
        </form>
      </div>
    </div>
  );
}
