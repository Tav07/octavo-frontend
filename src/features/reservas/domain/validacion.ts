// Validación del formulario de reserva en el cliente, con los mismos
// mensajes que emite el backend (zod) para que siempre coincidan.

const REGEX_TELEFONO = /^[0-9+\s()-]{7,15}$/;

export interface DatosFormularioReserva {
  zapatoId: string;
  telefono: string;
  talla: string;
  mensaje: string;
}

export function validarReserva(
  datos: DatosFormularioReserva
): Record<string, string> {
  const errores: Record<string, string> = {};

  if (datos.zapatoId === "") {
    errores.zapatoId = "Selecciona un zapato del catálogo.";
  }

  if (!REGEX_TELEFONO.test(datos.telefono.trim())) {
    errores.telefono = "El teléfono debe tener entre 7 y 15 dígitos.";
  }

  const talla = Number(datos.talla);
  if (datos.talla.trim() === "" || !Number.isInteger(talla)) {
    errores.talla = "La talla debe ser un número entero.";
  } else if (talla < 20 || talla > 50) {
    errores.talla = "La talla debe estar entre 20 y 50.";
  }

  if (datos.mensaje.length > 300) {
    errores.mensaje = "El mensaje es muy largo (máximo 300).";
  }

  return errores;
}