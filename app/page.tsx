import Link from "next/link";
import ListaMarcas from "@/features/zapatos/components/ListaMarcas";
import FormularioReserva from "@/features/reservas/components/FormularioReserva";

// Home con las secciones y textos de la Entrega 1, ahora con el catálogo
// aparte (en /catalogo). Las marcas vienen SIEMPRE de la API.
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
          href="/catalogo"
          className="rounded-lg bg-naranja px-7 py-3 font-semibold text-fondo transition-colors hover:bg-naranja-oscuro"
        >
          Ver catálogo
        </Link>
      </section>

      {/* MARCAS (datos desde GET /api/marcas; cada tarjeta llega al catálogo filtrado) */}
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

      {/* RESERVA (opción secundaria: primero la compra en el catálogo) */}
      <section
        id="reserva"
        className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8"
      >
        <details className="group rounded-2xl border border-borde bg-gris-suave px-6 py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold tracking-tight [&::-webkit-details-marker]:hidden">
            ¿Prefieres apartar tu par antes de comprarlo?
            <span
              aria-hidden="true"
              className="shrink-0 text-2xl font-medium leading-none text-naranja transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 text-sm text-texto-suave">
            Déjanos tus datos y el par que quieres. Te contactamos para
            confirmar disponibilidad, precio final y forma de pago. Sin
            compromiso.
          </p>
          <div className="mt-6">
            <FormularioReserva />
          </div>
        </details>
      </section>
    </main>
  );
}