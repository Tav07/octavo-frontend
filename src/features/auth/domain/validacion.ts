// Validación de los formularios en el cliente (igual que la Entrega 1):
// devuelve errores por campo, vacíos si todo pasa.
// El backend repite estas validaciones: esta capa solo evita un viaje
// innecesario y da los mismos mensajes.

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface DatosRegistroFormulario {
  nombre: string;
  email: string;
  password: string;
}

export function validarRegistro(
  datos: DatosRegistroFormulario
): Record<string, string> {
  const errores: Record<string, string> = {};

  const nombre = datos.nombre.trim();
  if (nombre === "") errores.nombre = "Escribe tu nombre.";
  else if (nombre.length < 3)
    errores.nombre = "El nombre debe tener al menos 3 letras.";

  const email = datos.email.trim();
  if (email === "") errores.email = "Escribe tu email.";
  else if (!REGEX_EMAIL.test(email))
    errores.email = "El email no tiene un formato válido (ej: nombre@correo.com).";

  if (datos.password.length < 6)
    errores.password = "La contraseña debe tener al menos 6 caracteres.";

  return errores;
}

export interface DatosInicioFormulario {
  email: string;
  password: string;
}

export function validarInicioDeSesion(
  datos: DatosInicioFormulario
): Record<string, string> {
  const errores: Record<string, string> = {};

  if (datos.email.trim() === "") errores.email = "Escribe tu email.";
  else if (!REGEX_EMAIL.test(datos.email.trim()))
    errores.email = "El email no tiene un formato válido (ej: nombre@correo.com).";

  if (datos.password === "") errores.password = "Escribe tu contraseña.";

  return errores;
}