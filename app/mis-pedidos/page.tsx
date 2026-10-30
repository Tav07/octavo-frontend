"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ListaMisPedidos from "@/features/pedidos/components/ListaMisPedidos";
import { useAuth } from "@/features/auth/hooks/useAuth";

// Página protegida "mis pedidos": solo con sesión. Sin sesión → /login;
// mientras la sesión rehidrata no se renderiza nada (sin desajuste).
export default function MisPedidosPagina() {
  const router = useRouter();
  const { usuario, listo } = useAuth();

  useEffect(() => {
    if (listo && usuario === null) router.replace("/login");
  }, [listo, usuario, router]);

  if (listo && usuario === null) return null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Mis pedidos
      </h1>
      <p className="mt-2 max-w-[60ch] text-texto-suave">
        Confirmas el pedido y lo pagas contra entrega cuando llega: acá ves el
        estado de cada uno, pendiente de pago o entregado.
      </p>
      {/* El listado se monta solo con sesión (así el fetch lleva token) */}
      {listo && usuario !== null ? <ListaMisPedidos /> : null}
      <p className="mt-8 text-center text-texto-suave">
        ¿Quieres más pares?{" "}
        <Link href="/catalogo" className="font-semibold text-naranja hover:underline">
          Vuelve al catálogo
        </Link>
      </p>
    </main>
  );
}