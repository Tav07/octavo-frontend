import Link from "next/link";

// Página 404 con la identidad del sitio (tinta + naranja, tipografía Syne).
export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center gap-5 bg-tinta px-4 py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-naranja">404</p>
      <h1 className="font-display text-3xl font-bold text-fondo sm:text-4xl">
        Esta página no existe
      </h1>
      <p className="max-w-[45ch] text-tinta-suave">
        El par que buscas no está disponible. Vuelve al catálogo para encontrar
        tu zapato.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-naranja px-7 py-3 font-semibold text-fondo transition-colors hover:bg-naranja-oscuro"
      >
        Volver al inicio
      </Link>
    </main>
  );
}