// Listado de las reservas del usuario autenticado (GET /api/reservas/mias)
// con los estados cargando / vacío / error y reintento.
"use client";

import Loading from "@/features/common/components/Loading";
import Empty from "@/features/common/components/Empty";
import ErrorState from "@/features/common/components/ErrorState";
import { useMisReservas } from "../hooks/useMisReservas";
import TarjetaReserva from "./TarjetaReserva";

export default function ListaMisReservas() {
  const { datos, cargando, error, reintentar } = useMisReservas();

  if (cargando) {
    return <Loading texto="Cargando tus reservas…" />;
  }
  if (error !== null) {
    return <ErrorState mensaje={error} alReintentar={reintentar} />;
  }
  if (datos === null || datos.length === 0) {
    return (
      <Empty texto="Todavía no tienes reservas. Reserva un par desde el catálogo." />
    );
  }

  return (
    <ul className="mt-8 flex flex-col gap-4">
      {datos.map((reserva) => (
        <TarjetaReserva key={reserva.id} reserva={reserva} />
      ))}
    </ul>
  );
}