import { Suspense } from "react";
import Link from "next/link";
import Loading from "@/features/common/components/Loading";
import Catalogo from "@/features/zapatos/components/Catalogo";
import ListaMarcas from "@/features/zapatos/components/ListaMarcas";

// Home con las secciones y textos exactos de la Entrega 1.
// El catálogo y las marcas vienen SIEMPRE de la API (sin datos locales);
// el formulario de reserva se conecta en la fase siguiente.
export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section
        id="inicio"
        className="flex flex-col items-start gap-6 bg-tinta px-4 py-20 text-fondo sm:px-6 sm:py-28 lg:px-12"
      >
        <h1 className="max-w-[18ch] font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Calzado original importado a precios que otros no conocen
        </h1>
        <p className="max-w-[55ch] text-lg text-tinta-suave">
          En Octavo Zapatos traemos zapatos 100% originales de las mejores
          marcas, hasta 60% más baratos que en el mercado local. Elige tu par y
          resérvalo en línea.
        </p>
        <Link
          href="#catalogo"
          className="rounded-lg bg-naranja px-7 py-3 font-semibold text-fondo transition-colors hover:bg-naranja-oscuro"
        >
          Ver catálogo
        </Link>
      </section>

      {/* CATÁLOGO (datos desde GET /api/zapatos, paginación por URL) */}
      <section
        id="catalogo"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <h2 className="font-display text-3xl font-bold tracking-tight">
          Catálogo
        </h2>
        <p className="mt-3 max-w-[60ch] text-texto-suave">
          Filtra los zapatos por categoría, marca, talla o precio para
          encontrar tu par ideal.
        </p>
        {/* useSearchParams requiere límite de navegación dinámica: Suspense */}
        <Suspense fallback={<Loading texto="Cargando catálogo…" />}>
          <Catalogo />
        </Suspense>
      </section>

      {/* MARCAS (datos desde GET /api/marcas) */}
      <section
        id="marcas"
        className="bg-gris-suave px-4 py-20 sm:px-6"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Nuestras marcas
          </h2>
          <p className="mt-3 max-w-[60ch] text-texto-suave">
            Todos nuestros zapatos son originales, importados directamente de
            proveedores internacionales autorizados.
          </p>
          <ListaMarcas />
        </div>
      </section>

      {/* RESERVA (el formulario se conecta a la API en la fase 9) */}
      <section
        id="reserva"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <h2 className="font-display text-3xl font-bold tracking-tight">
          Reserva tu pedido
        </h2>
        <p className="mt-3 max-w-[60ch] text-texto-suave">
          Déjanos tus datos y el par que quieres. Te contactamos para confirmar
          disponibilidad, precio final y forma de pago. Sin compromiso.
        </p>
      </section>
    </main>
  );
}