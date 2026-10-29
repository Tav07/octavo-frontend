// Único cliente HTTP del sitio: ningún componente ni página llama a fetch
// directo. Agrega el Bearer token de la sesión y, si una petición
// autenticada responde 401, borra la sesión y redirige a /login.
import { API_BASE_URL } from "./config";
import {
  limpiarSesion,
  leerToken,
} from "@/features/auth/domain/sesion";

// Formato de error del backend: { message: string, errors?: Record<string, string> }
export class HttpError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string>;

  constructor(status: number, message: string, errors?: Record<string, string>) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.errors = errors;
  }
}

interface OpcionesHttp {
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;

  // El 401 autenticado redirige a /login por defecto. El formulario de
  // login pasa `false` para mostrar el error junto al campo de login.
  redirigirEn401?: boolean;
}

function erroresDelCuerpo(valor: unknown): Record<string, string> | undefined {
  if (typeof valor !== "object" || valor === null) return undefined;
  const errores: Record<string, string> = {};
  for (const [campo, texto] of Object.entries(valor)) {
    if (typeof texto === "string") errores[campo] = texto;
  }
  return Object.keys(errores).length > 0 ? errores : undefined;
}

// Traduce la respuesta a { message, errors? } sin confianza en el cuerpo.
async function errorDe(respuesta: Response): Promise<{
  message: string;
  errors?: Record<string, string>;
}> {
  let message = respuesta.statusText || "Error inesperado";
  let errors: Record<string, string> | undefined;
  try {
    const cuerpo: unknown = await respuesta.json();
    if (typeof cuerpo === "object" && cuerpo !== null) {
      const registro = cuerpo as Record<string, unknown>;
      if (typeof registro["message"] === "string" && registro["message"] !== "") {
        message = registro["message"];
      }
      errors = erroresDelCuerpo(registro["errors"]);
    }
  } catch {
    // Cuerpo no-JSON (ej.: error de infraestructura): queda el mensaje genérico
  }
  return { message, errors };
}

export async function http<T>(ruta: string, opciones: OpcionesHttp = {}): Promise<T> {
  const { body, headers, signal, redirigirEn401 = true } = opciones;
  const token = leerToken();

  const cabeceras: Record<string, string> = { ...headers };
  if (body !== undefined) cabeceras["Content-Type"] = "application/json";
  if (token !== null) cabeceras["Authorization"] = `Bearer ${token}`;

  const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
    headers: cabeceras,
    signal,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!respuesta.ok) {
    const { message, errors } = await errorDe(respuesta);
    if (respuesta.status === 401 && redirigirEn401) {
      // Token vencido o inválido: la sesión ya no vale.
      limpiarSesion();
      window.location.replace("/login");
    }
    throw new HttpError(respuesta.status, message, errors);
  }

  if (respuesta.status === 204) return undefined as T;
  return (await respuesta.json()) as T;
}