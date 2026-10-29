// Sección "Nuestras marcas" de la Entrega 1, alimentada por /api/marcas.
"use client";

import Loading from "@/features/common/components/Loading";
import Empty from "@/features/common/components/Empty";
import ErrorState from "@/features/common/components/ErrorState";
import { useMarcas } from "../hooks/useMarcas";
import TarjetaMarca from "./TarjetaMarca";

export default function ListaMarcas() {
  const { datos, cargando, error, reintentar } = useMarcas();

  if (cargando) {
    return <Loading texto="Cargando marcas…" />;
  }

  if (error !== null) {
    return <ErrorState mensaje={error} alReintentar={reintentar} />;
  }

  if (datos === null || datos.length === 0) {
    return <Empty texto="No hay marcas registradas por ahora." />;
  }

  return (
    <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {datos.map((marca) => (
        <TarjetaMarca key={marca.id} marca={marca} />
      ))}
    </ul>
  );
}