import { http } from "@/features/common/http";
import type { Marca } from "../domain/tipos";

// GET /api/marcas (público)
export async function listarMarcas(): Promise<Marca[]> {
  return await http<Marca[]>("/marcas");
}