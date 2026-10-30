"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormularioCheckout from "@/features/pedidos/components/FormularioCheckout";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCarrito } from "@/features/carrito/hooks/useCarrito";

// Página de checkout protegida: solo con sesión y solo con carrito.
// Sin sesión → /login; con sesión y carrito vacío (sin pedido recién
// confirmado) → /carrito. El formulario muestra sola la confirmación.
export default function CheckoutPagina() {
  const router = useRouter();
  const { usuario, listo } = useAuth();
  const { items, listo: carritoListo } = useCarrito();
  // True cuando el POST ya confirmó un pedido (y vació el carrito).
  const [comprado, setComprado] = useState(false);

  useEffect(() => {
    if (listo && usuario === null) router.replace("/login");
  }, [listo, usuario, router]);

  useEffect(() => {
    if (!listo || !carritoListo || comprado) return;
    if (items.length === 0) router.replace("/carrito");
  }, [listo, carritoListo, comprado, items.length, router]);

  if (!listo || !carritoListo) return null;
  if (usuario === null) return null;
  if (!comprado && items.length === 0) return null;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Confirma tu pedido
      </h1>
      <p className="mt-2 max-w-[60ch] text-texto-suave">
        Revisa tus datos de entrega: pagas contra entrega cuando los zapatos
        lleguen, así que el pedido queda pendiente de pago hasta ese momento.
      </p>
      <div className="mt-8">
        <FormularioCheckout
          items={items}
          alCreado={() => setComprado(true)}
        />
      </div>
    </main>
  );
}