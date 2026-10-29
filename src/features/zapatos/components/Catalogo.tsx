// Sección Catálogo de la Entrega 1, ahora alimentada por la API:
// paginación por URL (?page=2), estados de cargando, vacío y error.
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/features/common/components/Loading";
import Empty from "@/features/common/components/Empty";
import ErrorState from "@/features/common/components/ErrorState";
import Pagination from "@/features/common/components/Pagination";
import { useZapatos } from "../hooks/useZapatos";
import TarjetaZapato from "./TarjetaZapato";

const LIMITE_POR_PAGINA = 10;

// La página llega de la URL; si es inválida se usa la primera.
function paginaDesde(valor: string | string[] | undefined): number {
  if (typeof valor !== "string" || valor === "") return 1;
  const numero = Number(valor);
  return Number.isInteger(numero) && numero >= 1 ? numero : 1;
}

export default function Catalogo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pagina = paginaDesde(searchParams.get("page") ?? undefined);
  const { datos, cargando, error, reintentar } = useZapatos(
    pagina,
    LIMITE_POR_PAGINA
  );

  // Cambiar de página reescribe la URL (y con el ancla vuelve al catálogo)
  const alCambiar = (nueva: number) => {
    router.push(nueva === 1 ? "/#catalogo" : `/?page=${nueva}#catalogo`);
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

  return (
    <>
      {data.length === 0 ? (
        <Empty texto="No hay zapatos para mostrar en el catálogo por ahora." />
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