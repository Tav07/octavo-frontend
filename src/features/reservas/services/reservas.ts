// Servicios de reservas: los únicos que hablan con /api/reservas.
// Ambas rutas son autenticadas: http.ts agrega el Bearer token.
import { http } from "@/features/common/http";
import type { DatosReserva, Reserva } from "../domain/tipos";

// Crea la reserva de la sesión actual: el userId lo decide el backend
// con el token; el body solo lleva los datos del formulario original.
export async function crearReserva(datos: DatosReserva): Promise<Reserva> {
  return await http<Reserva>("/reservas", {
    method: "POST",
    body: datos,
  });
}

// GET /api/reservas/mias: solo las reservas del usuario autenticado.
export async function listarMisReservas(): Promise<Reserva[]> {
  return await http<Reserva[]>("/reservas/mias");
}