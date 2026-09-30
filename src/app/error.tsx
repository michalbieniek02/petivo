"use client";

import Link from "next/link";
import { PawPrint } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main-content" className="min-h-screen bg-[#06060e] text-white px-6 flex items-center justify-center">
      <div className="max-w-lg text-center">
        <PawPrint className="h-14 w-14 text-purple-300 mx-auto" aria-hidden="true" />
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-6">Coś przerwało ładowanie sklepu</h1>
        <p className="text-white/65 leading-relaxed mt-5">
          Spróbuj ponownie. Jeśli problem nie zniknie, wróć na stronę główną za chwilę.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
          <button type="button" onClick={reset} className="btn-primary min-h-11 px-6">Spróbuj ponownie</button>
          <Link href="/" className="btn-ghost min-h-11 px-6 inline-flex items-center justify-center">Strona główna</Link>
        </div>
      </div>
    </main>
  );
}
