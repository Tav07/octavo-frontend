// Página del catálogo: sección independiente (ya no vive en la home).
// La query (?page=, ?marcaId=, ?q=) es la fuente de verdad de la vista.
import type { Metadata } from "next";
import { Suspense } from "react";
import Loading from "@/features/common/components/Loading";
import Catalogo from "@/features/zapatos/components/Catalogo";

export const metadata: Metadata = {
  title: "Catálogo | Octavo Zapatos",
  description:
    "Todos los zapatos de Octavo Zapatos: filtra por marca y busca tu par ideal.",
};

export default function CatalogoPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Catálogo
      </h1>
      <p className="mt-3 max-w-[60ch] text-texto-suave">
        Todos tus zapatos están aquí. Elige la marca o busca tu par directo en
        el buscador; pagarás contra entrega al llegar al pedido.
      </p>
      {/* useSearchParams requiere límite de navegación dinámica: Suspense */}
      <div className="mt-10">
        <Suspense fallback={<Loading texto="Cargando catálogo…" />}>
          <Catalogo />
        </Suspense>
      </div>
    </main>
  );
}