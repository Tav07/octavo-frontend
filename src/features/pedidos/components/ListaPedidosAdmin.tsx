// Listado de todas los pedidos de todos los usuarios, para el panel de
// administración (GET /api/pedidos) con los estados cargando / vacío /
// error y reintento. Cada tarjeta muestra quién compró y el estado.
"use client";

import Loading from "@/features/common/components/Loading";
import Empty from "@/features/common/components/Empty";
import ErrorState from "@/features/common/components/ErrorState";
import { useTodosPedidos } from "../hooks/useTodosPedidos";
import TarjetaPedido from "./TarjetaPedido";

export default function ListaPedidosAdmin() {
  const { datos, cargando, error, reintentar } = useTodosPedidos();

  if (cargando) {
    return <Loading texto="Cargando pedidos…" />;
  }
  if (error !== null) {
    return <ErrorState mensaje={error} alReintentar={reintentar} />;
  }
  if (datos === null || datos.length === 0) {
    return <Empty texto="Todavía no hay pedidos en la tienda." />;
  }

  return (
    <ul className="mt-8 flex flex-col gap-4">
      {datos.map((pedido) => (
        <TarjetaPedido key={pedido.id} pedido={pedido} mostrarUsuario />
      ))}
    </ul>
  );
}