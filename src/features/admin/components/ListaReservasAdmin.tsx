// Todas las reservas (GET /api/reservas, solo admin): quien reservó,
// el zapato, los datos del formulario y la fecha.
"use client";

import Loading from "@/features/common/components/Loading";
import Empty from "@/features/common/components/Empty";
import ErrorState from "@/features/common/components/ErrorState";
import { useTodasReservas } from "@/features/reservas/hooks/useTodasReservas";
import TarjetaReserva from "@/features/reservas/components/TarjetaReserva";

export default function ListaReservasAdmin() {
  const { datos, cargando, error, reintentar } = useTodasReservas();

  if (cargando) {
    return <Loading texto="Cargando las reservas…" />;
  }
  if (error !== null) {
    return <ErrorState mensaje={error} alReintentar={reintentar} />;
  }
  if (datos === null || datos.length === 0) {
    return <Empty texto="No hay reservas todavía." />;
  }

  return (
    <ul className="flex flex-col gap-4">
      {datos.map((reserva) => (
        <TarjetaReserva key={reserva.id} reserva={reserva} mostrarUsuario />
      ))}
    </ul>
  );
}