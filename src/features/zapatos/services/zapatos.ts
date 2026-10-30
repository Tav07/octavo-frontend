import { http } from "@/features/common/http";
import type { RespuestaCatalogo, Zapato } from "../domain/tipos";

export interface FiltrosCatalogo {
  page: number;
  limit: number;
  // Filtros del catálogo por URL: marca y búsqueda por texto (ambos opcionales).
  marcaId?: number;
  q?: string;
}

// Datos del formulario del admin: lo que exige el zod del backend
// (categorías de la Entrega 1, tallas 20-50).
export interface DatosZapato {
  nombre: string;
  categoria: string;
  precio: number;
  talla: number;
  descripcion: string;
  imagen: string;
  marcaId: number;
}

// GET /api/zapatos?page=&limit=&marcaId=&q=
export async function listarZapatos(
  filtros: FiltrosCatalogo
): Promise<RespuestaCatalogo> {
  const consulta = new URLSearchParams({
    page: String(filtros.page),
    limit: String(filtros.limit),
  });
  if (filtros.marcaId !== undefined) {
    consulta.set("marcaId", String(filtros.marcaId));
  }
  if (filtros.q !== undefined && filtros.q !== "") {
    consulta.set("q", filtros.q);
  }
  return await http<RespuestaCatalogo>(`/zapatos?${consulta.toString()}`);
}

// POST /api/zapatos (solo admin) → 201 con el zapato y su marca
export async function crearZapato(datos: DatosZapato): Promise<Zapato> {
  return await http<Zapato>("/zapatos", { method: "POST", body: datos });
}

// PUT /api/zapatos/:id (solo admin) → el zapato actualizado
export async function actualizarZapato(
  id: number,
  datos: DatosZapato
): Promise<Zapato> {
  return await http<Zapato>(`/zapatos/${id}`, {
    method: "PUT",
    body: datos,
  });
}

// DELETE /api/zapatos/:id (solo admin) → 204 sin cuerpo
export async function eliminarZapato(id: number): Promise<void> {
  await http<never>(`/zapatos/${id}`, { method: "DELETE" });
}