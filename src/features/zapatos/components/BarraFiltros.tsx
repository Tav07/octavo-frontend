// Barra de filtros del catálogo: chips de marca (una por marca en la
// API, más "Todas") y buscador por texto. Ambos escriben la URL:
// cambiarlos resetea la página a 1.
"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useMarcas } from "../hooks/useMarcas";
import { urlCatalogo } from "../domain/url";

interface Props {
  marcaActiva?: number;
  qActiva?: string;
}

export default function BarraFiltros({ marcaActiva, qActiva }: Props) {
  const router = useRouter();
  // Las marcas salen de la API; si falla la carga, el bloque se ve
  // pequeño y silencioso: la chips de "Todas" siempre están disponibles
  // y así el error de este bloque no tapa el catálogo de abajo.
  const { datos: marcas, cargando } = useMarcas();

  // Chips y buscador se combinan: cambiar marca conserva el texto de
  // búsqueda y viceversa. Ambos vuelven a la página 1 al navegar.
  const navegar = (marcaId: number | undefined, q: string) => {
    router.push(urlCatalogo({ marcaId, q }));
  };

  const alBuscar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const dato = new FormData(evento.currentTarget);
    navegar(marcaActiva, String(dato.get("catalogo-q") ?? "").trim());
  };

  const baseChip =
    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors";
  const chipInactiva =
    "border-borde text-tinta hover:border-naranja hover:text-naranja";
  const chipActiva = "border-naranja bg-naranja text-fondo hover:bg-naranja-oscuro";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filtrar por marca"
      >
        {cargando ? <span className="text-sm text-texto-suave">Marcas…</span> : (
          marcas?.map((marca) => (
            <button
              key={marca.id}
              type="button"
              aria-pressed={marcaActiva === marca.id}
              className={`${baseChip} ${
                marcaActiva === marca.id ? chipActiva : chipInactiva
              }`}
              onClick={() =>
                navegar(marcaActiva === marca.id ? undefined : marca.id, qActiva ?? "")
              }
            >
              {marca.nombre}
            </button>
          ))
        )}
        <button
          type="button"
          aria-pressed={marcaActiva === undefined}
          className={`${baseChip} ${
            marcaActiva === undefined ? chipActiva : chipInactiva
          }`}
          onClick={() => navegar(undefined, qActiva ?? "")}
        >
          Todas
        </button>
      </div>

      {/* Búsqueda por texto (nombre, descripción y marca en la API) */}
      <form onSubmit={alBuscar} className="flex gap-2" role="search">
        <label htmlFor="catalogo-q" className="sr-only">
          Buscar zapatos
        </label>
        <input
          id="catalogo-q"
          name="catalogo-q"
          type="search"
          placeholder="Buscar zapatos…"
          defaultValue={qActiva ?? ""}
          className="w-full min-w-0 rounded-lg border border-borde bg-fondo px-3 py-2 text-sm text-tinta placeholder:text-texto-suave focus:border-naranja focus:outline-none sm:w-64"
        />
        <button
          type="submit"
          className="rounded-lg bg-tinta px-4 py-2 text-sm font-semibold text-fondo transition-colors hover:bg-naranja"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}