// Servicios de pedidos: únicos puntos que tocan la API de este feature.
// Nunca se envían montos: el backend recalcula el total y congela el
// precio de cada ítem. El userId sale del Bearer token.
import { http } from "@/features/common/http";
import type { DatosNuevoPedido, Pedido } from "../domain/tipos";

export async function crearPedido(datos: DatosNuevoPedido): Promise<Pedido> {
  return await http<Pedido>("/pedidos", { method: "POST", body: datos });
}

export async function listarMisPedidos(): Promise<Pedido[]> {
  return await http<Pedido[]>("/pedidos/mias");
}

// Solo lo consume la vista de administración.
export async function listarTodosLosPedidos(): Promise<Pedido[]> {
  return await http<Pedido[]>("/pedidos");
}