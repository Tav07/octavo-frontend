// Servicios de autenticación: los únicos que hablan con /api/auth.
// El 401 de estos endpoints es un error del formulario (contraseña
// incorrecta), no una sesión vencida: redirigirEn401 = false.
import { http } from "@/features/common/http";
import type { UsuarioSesion } from "../domain/sesion";

export interface DatosRegistro {
  nombre: string;
  email: string;
  password: string;
}

export interface DatosInicioDeSesion {
  email: string;
  password: string;
}

// Formato de POST /api/auth/login
export interface RespuestaInicio {
  token: string;
  usuario: UsuarioSesion;
}

export async function iniciarSesion(
  datos: DatosInicioDeSesion
): Promise<RespuestaInicio> {
  return await http<RespuestaInicio>("/auth/login", {
    method: "POST",
    body: datos,
    redirigirEn401: false,
  });
}

// El registro responde el usuario creado (sin token): quien se registra
// inicia sesión en el siguiente paso.
export async function registrar(datos: DatosRegistro): Promise<UsuarioSesion> {
  return await http<UsuarioSesion>("/auth/register", {
    method: "POST",
    body: datos,
    redirigirEn401: false,
  });
}