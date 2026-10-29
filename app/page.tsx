import Link from "next/link";

// Home de la fase 3: identidad de la Entrega 1 con Navbar/Footer del layout.
// En la fase 6 el catálogo, las marcas y la reserva se llenan desde la API.
export default function Home() {
  return (
    <main>
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

      {/* En la fase 6 esta sección cargará los zapatos desde la API */}
      <section id="catalogo" className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight">Catálogo</h2>
        <p className="mt-3 max-w-[60ch] text-texto-suave">
          El catálogo se conecta a la API en la fase siguiente del proyecto.
        </p>
      </section>
    </main>
  );
}