"use client";

// Paginación del catálogo: Anterior/Siguiente con página actual.
// La página en sí la maneja la pantalla (en la fase 6 vive en la URL).
interface Props {
  pagina: number;
  totalPaginas: number;
  alCambiar: (nueva: number) => void;
}

export default function Pagination({ pagina, totalPaginas, alCambiar }: Props) {
  if (totalPaginas <= 1) return null;

  const anterior = () => alCambiar(pagina - 1);
  const siguiente = () => alCambiar(pagina + 1);

  const base =
    "rounded-lg border border-borde px-4 py-2 text-sm font-medium transition-colors enabled:hover:border-naranja disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-5"
      aria-label="Paginación del catálogo"
    >
      <button type="button" className={base} disabled={pagina <= 1} onClick={anterior}>
        ← Anterior
      </button>
      <span aria-live="polite" className="text-sm text-texto-suave">
        Página {pagina} de {totalPaginas}
      </span>
      <button
        type="button"
        className={base}
        disabled={pagina >= totalPaginas}
        onClick={siguiente}
      >
        Siguiente →
      </button>
    </nav>
  );
}