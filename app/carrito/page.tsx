// Página del carrito: revisa lo seleccionado antes de pagar contra
// entrega (el formulario de pago se conecta en la fase siguiente).
// El contenido vive en localStorage; los montos aquí son el adelanto.
"use client";

import Link from "next/link";
import Empty from "@/features/common/components/Empty";
import { useCarrito } from "@/features/carrito/hooks/useCarrito";
import TarjetaCarrito from "@/features/carrito/components/TarjetaCarrito";
import { formatearPrecio } from "@/features/zapatos/domain/precio";

export default function CarritoPagina() {
  const { items, listo, agregar, quitarUnidad, quitarTodo, vaciar } = useCarrito();

  // Mientras el carrito rehidrata no se renderiza nada: sin desajuste.
  if (!listo) return null;

  const pares = items.reduce((n, item) => n + item.cantidad, 0);
  const total = items.reduce((n, item) => n + item.precio * item.cantidad, 0);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Tu carrito
      </h1>

      {items.length === 0 ? (
        <div className="mt-10">
          <Empty texto="Tu carrito está vacío todavía." />
          <p className="mt-4 text-center">
            <Link
              href="/catalogo"
              className="inline-block rounded-lg bg-naranja px-6 py-2.5 font-semibold text-fondo transition-colors hover:bg-naranja-oscuro"
            >
              Ver catálogo
            </Link>
          </p>
        </div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-borde">
            {items.map((item) => (
              <TarjetaCarrito
                key={`${item.zapatoId}-${item.talla}`}
                item={item}
                alMas={agregar}
                alMenos={quitarUnidad}
                alTodo={quitarTodo}
              />
            ))}
          </ul>

          {/* Resumen */}
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-borde bg-gris-suave p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-bold tracking-tight">
                Total: {formatearPrecio(total)}
              </p>
              <p className="mt-1 text-sm text-texto-suave">
                {pares} {pares === 1 ? "par" : "pares"} · pagas contra entrega:
                confirmas el pedido y lo pagas cuando llega.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/checkout"
                className="rounded-lg bg-naranja px-5 py-2.5 text-sm font-semibold text-fondo transition-colors hover:bg-naranja-oscuro"
              >
                Pagar contra entrega
              </Link>
              <Link
                href="/catalogo"
                className="rounded-lg border border-borde px-5 py-2.5 text-sm font-semibold text-tinta transition-colors hover:border-naranja"
              >
                Seguir mirando
              </Link>
              <button
                type="button"
                onClick={vaciar}
                className="rounded-lg px-5 py-2.5 text-sm font-medium text-texto-suave underline underline-offset-2 transition-colors hover:text-naranja"
              >
                Vaciar
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}