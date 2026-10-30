"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ListaMisReservas from "@/features/reservas/components/ListaMisReservas";
import { useAuth } from "@/features/auth/hooks/useAuth";

// Página protegida "mis reservas": solo con sesión. Sin sesión → /login;
// mientras la sesión rehidrata no se renderiza nada (sin desajuste).
export default function MisReservasPagina() {
  const router = useRouter();
  const { usuario, listo } = useAuth();

  useEffect(() => {
    if (listo && usuario === null) router.replace("/login");
  }, [listo, usuario, router]);

  if (listo && usuario === null) return null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Mis reservas
      </h1>
      <p className="mt-2 max-w-[60ch] text-texto-suave">
        Los pares que reservaste con tu cuenta de Octavo, esperando la
        confirmación de disponibilidad y pago.
      </p>
      {/* El listado se monta solo con sesión (así el fetch lleva token) */}
      {listo && usuario !== null ? <ListaMisReservas /> : null}
      <p className="mt-8 text-center text-texto-suave">
        ¿Quieres reservar otro par?{" "}
        <Link href="/catalogo" className="font-semibold text-naranja hover:underline">
          Vuelve al catálogo
        </Link>
      </p>
    </main>
  );
}