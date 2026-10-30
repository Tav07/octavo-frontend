// Catálogo de la Entrega 1 en su página aparte, alimentado por la API:
// página, filtro de marca y búsqueda por URL
// (/catalogo?page=2&marcaId=3&q=nike) y estados de cargando, vacío y error.
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/features/common/components/Loading";
import Empty from "@/features/common/components/Empty";
import ErrorState from "@/features/common/components/ErrorState";
import Pagination from "@/features/common/components/Pagination";
import BarraFiltros from "./BarraFiltros";
import { useZapatos } from "../hooks/useZapatos";
import TarjetaZapato from "./TarjetaZapato";
import { numeroDeParametro, urlCatalogo } from "../domain/url";

const LIMITE_POR_PAGINA = 10;

export default function Catalogo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pagina = numeroDeParametro(searchParams.get("page")) ?? 1;
  const marcaId = numeroDeParametro(searchParams.get("marcaId"));
  const q = searchParams.get("q") ?? "";

  const { datos, cargando, error, reintentar } = useZapatos({
    page: pagina,
    limit: LIMITE_POR_PAGINA,
    marcaId,
    q: q === "" ? undefined : q,
  });

  // Cambiar de página conserva los filtros activos.
  const alCambiar = (nueva: number) => {
    router.push(urlCatalogo({ page: nueva, marcaId, q }));
  };

  if (cargando) {
    return <Loading texto="Cargando catálogo…" />;
  }

  if (error !== null) {
    return <ErrorState mensaje={error} alReintentar={reintentar} />;
  }

  if (datos === null) {
    return <Empty texto="No hay zapatos para mostrar en el catálogo por ahora." />;
  }

  const { pagination, data } = datos;
  // Si se pidió una página fuera de rango (ej.: ?page=99) se ve el estado
  // vacío, pero la paginación sigue presente para volver a una página válida.
  const paginaVisible = Math.min(pagina, pagination.totalPages);
  const hayFiltros = marcaId !== undefined || q !== "";

  return (
    <>
      <BarraFiltros marcaActiva={marcaId} qActiva={q} />

      {data.length === 0 ? (
        <Empty
          texto={
            hayFiltros
              ? "No hay zapatos que coincidan con la marca o la búsqueda."
              : "No hay zapatos para mostrar en el catálogo por ahora."
          }
        />
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((zapato) => (
            <TarjetaZapato key={zapato.id} zapato={zapato} />
          ))}
        </ul>
      )}
      <Pagination
        pagina={paginaVisible}
        totalPaginas={pagination.totalPages}
        alCambiar={alCambiar}
      />
    </>
  );
}