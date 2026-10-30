// Listado de los pedidos del usuario autenticado (GET /api/pedidos/mias)
// con los estados cargando / vacío / error y reintento.
"use client";

import Loading from "@/features/common/components/Loading";
import Empty from "@/features/common/components/Empty";
import ErrorState from "@/features/common/components/ErrorState";
import { useMisPedidos } from "../hooks/useMisPedidos";
import TarjetaPedido from "./TarjetaPedido";

export default function ListaMisPedidos() {
  const { datos, cargando, error, reintentar } = useMisPedidos();

  if (cargando) {
    return <Loading texto="Cargando tus pedidos…" />;
  }
  if (error !== null) {
    return <ErrorState mensaje={error} alReintentar={reintentar} />;
  }
  if (datos === null || datos.length === 0) {
    return (
      <Empty texto="Todavía no tienes pedidos. Cuando confirmes uno aparece acá." />
    );
  }

  return (
    <ul className="mt-8 flex flex-col gap-4">
      {datos.map((pedido) => (
        <TarjetaPedido key={pedido.id} pedido={pedido} />
      ))}
    </ul>
  );
}