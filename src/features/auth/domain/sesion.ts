// La sesión (token + usuario) vive en localStorage: sobrevive al refrescar.
// localStorage solo existe en el navegador, así que toda función se protege
// para no romper el render en el servidor y para ignorar si está bloqueado.

const CLAVE_TOKEN = "octavo.token";
const CLAVE_USUARIO = "octavo.usuario";

export type Rol = "admin" | "user";

export interface UsuarioSesion {
  id: number;
  nombre: string;
  email: string;
  role: Rol;
}

function enElNavegador(): boolean {
  return typeof window !== "undefined";
}

// Lo que se guarda no se confía: se valida al rehidratar (unknown + guardas).
function esUsuarioSesion(valor: unknown): valor is UsuarioSesion {
  if (typeof valor !== "object" || valor === null) return false;
  const u = valor as Record<string, unknown>;
  return (
    typeof u.id === "number" &&
    typeof u.nombre === "string" &&
    typeof u.email === "string" &&
    (u.role === "admin" || u.role === "user")
  );
}

export function guardarSesion(token: string, usuario: UsuarioSesion): void {
  if (!enElNavegador()) return;
  try {
    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  } catch {
    // localStorage bloqueado: la app funciona como invitado
  }
}

export function leerToken(): string | null {
  if (!enElNavegador()) return null;
  try {
    return localStorage.getItem(CLAVE_TOKEN);
  } catch {
    return null;
  }
}

export function leerUsuario(): UsuarioSesion | null {
  if (!enElNavegador()) return null;
  try {
    const crudo = localStorage.getItem(CLAVE_USUARIO);
    if (crudo === null) return null;
    const parseado: unknown = JSON.parse(crudo);
    if (!esUsuarioSesion(parseado)) {
      limpiarSesion();
      return null;
    }
    return parseado;
  } catch {
    limpiarSesion();
    return null;
  }
}

export function limpiarSesion(): void {
  if (!enElNavegador()) return;
  try {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
  } catch {
    // nada que limpiar
  }
}