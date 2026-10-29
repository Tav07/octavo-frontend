import { http } from "@/features/common/http";
import type { RespuestaCatalogo } from "../domain/tipos";

export interface FiltrosCatalogo {
  page: number;
  limit: number;
}

// GET /api/zapatos?page=&limit=
export async function listarZapatos(
  filtros: FiltrosCatalogo
): Promise<RespuestaCatalogo> {
  return await http<RespuestaCatalogo>(
    `/zapatos?page=${filtros.page}&limit=${filtros.limit}`
  );
}