import { http } from "@/features/common/http";
import type { RespuestaCatalogo, Zapato } from "../domain/tipos";

export interface FiltrosCatalogo {
  page: number;
  limit: number;
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

// GET /api/zapatos?page=&limit=
export async function listarZapatos(
  filtros: FiltrosCatalogo
): Promise<RespuestaCatalogo> {
  return await http<RespuestaCatalogo>(
    `/zapatos?page=${filtros.page}&limit=${filtros.limit}`
  );
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