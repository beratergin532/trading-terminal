"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [pin, setPin] = React.useState("");
  const [error, setError] = React.useState(false);
  const router = useRouter();

  const SECRET_PIN = process.env.NEXT_PUBLIC_APP_PIN || "1903";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === SECRET_PIN) {
      document.cookie = "borsai_session=active; path=/; max-age=2592000; SameSite=Lax";
      router.push("/");
      router.refresh();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 font-mono text-xl font-black">
          ⚡
        </div>
        <div>
          <h1 className="text-xl font-bold text-white font-sans">borsAI Terminal</h1>
          <p className="text-xs text-slate-400 mt-1">Özel FinTek Erişim Paneli</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            maxLength={6}
            value={pin}
            onChange={(e) => {
              setError(false);
              setPin(e.target.value);
            }}
            placeholder="••••"
            className="w-full text-center text-2xl font-mono py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-all tracking-[0.3em]"
            autoFocus
          />

          {error && (
            <p className="text-xs font-mono text-rose-400 animate-pulse">
              Hatalı PIN Kodu. Tekrar deneyin.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            Uygulamaya Giriş Yap →
          </button>
        </form>
      </div>
    </div>
  );
}