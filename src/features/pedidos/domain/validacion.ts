// Validación en el cliente del formulario de checkout. Los mensajes son
// idénticos a los del zod del backend, para que si la capa cliente deja
// pasar algo el error del servidor no le suene distinto al usuario.
// La talla de cada ítem ya viene validada por la tarjeta del catálogo y
// el backend la rechaza con detalle por ítem si cambió.

export const REGEX_TELEFONO = /^[0-9+\s()-]{7,15}$/;

export interface DatosCheckout {
  direccion: string;
  telefono: string;
  nota: string;
}

export function validarCheckout(datos: DatosCheckout): Record<string, string> {
  const errores: Record<string, string> = {};

  const direccion = datos.direccion.trim();
  if (direccion.length < 10) {
    errores["direccion"] = "La dirección debe tener al menos 10 caracteres.";
  } else if (direccion.length > 200) {
    errores["direccion"] = "La dirección es muy larga (máximo 200).";
  }

  const telefono = datos.telefono.trim();
  if (!REGEX_TELEFONO.test(telefono)) {
    errores["telefono"] = "El teléfono debe tener entre 7 y 15 dígitos.";
  }

  if (datos.nota.trim().length > 300) {
    errores["nota"] = "La nota es muy larga (máximo 300).";
  }

  return Object.keys(errores).length > 0 ? errores : {};
}