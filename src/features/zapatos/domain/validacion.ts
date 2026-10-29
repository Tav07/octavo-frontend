// Validación del formulario de zapatos del admin, con los mismos mensajes
// que emite el zod del backend. La imagen exige ruta local además: es lo
// único que next/image puede servir sin errores en runtime.
import type { DatosZapato } from "../services/zapatos";

export const CATEGORIAS = ["running", "casual", "formal"] as const;

export interface DatosFormularioZapato {
  nombre: string;
  categoria: string;
  precio: string;
  talla: string;
  descripcion: string;
  imagen: string;
  marcaId: string;
}

export function validarZapato(
  datos: DatosFormularioZapato
): Record<string, string> {
  const errores: Record<string, string> = {};

  if (datos.nombre.trim().length < 3) {
    errores.nombre = "El nombre debe tener al menos 3 letras.";
  } else if (datos.nombre.trim().length > 100) {
    errores.nombre = "El nombre es muy largo (máximo 100).";
  }

  if (!CATEGORIAS.some((c) => c === datos.categoria)) {
    errores.categoria = "La categoría debe ser running, casual o formal.";
  }

  const precio = Number(datos.precio);
  if (datos.precio.trim() === "" || Number.isNaN(precio)) {
    errores.precio = "El precio debe ser un número.";
  } else if (precio < 1) {
    errores.precio = "El precio debe ser mayor a 0.";
  } else if (precio > 99999999) {
    errores.precio = "El precio es demasiado alto.";
  }

  const talla = Number(datos.talla);
  if (datos.talla.trim() === "" || !Number.isInteger(talla)) {
    errores.talla = "La talla debe ser un número entero.";
  } else if (talla < 20 || talla > 50) {
    errores.talla = "La talla debe estar entre 20 y 50.";
  }

  if (datos.descripcion.trim().length < 10) {
    errores.descripcion = "La descripción debe tener al menos 10 caracteres.";
  } else if (datos.descripcion.trim().length > 300) {
    errores.descripcion = "La descripción es muy larga (máximo 300).";
  }

  if (datos.imagen.trim().length < 3) {
    errores.imagen = "La imagen es obligatoria (ruta pública, ej.: /images/archivo.jpg).";
  } else if (datos.imagen.trim().length > 200) {
    errores.imagen = "La ruta de la imagen es muy larga.";
  } else if (!datos.imagen.trim().startsWith("/images/")) {
    // next/image solo sirve rutas locales: una URL externa rompería la tarjeta
    errores.imagen = "Usa una ruta local de /images/.";
  }

  const marcaId = Number(datos.marcaId);
  if (datos.marcaId === "" || !Number.isInteger(marcaId) || marcaId <= 0) {
    errores.marcaId = "La marca es obligatoria.";
  }

  return errores;
}

// Del formulario (strings) a lo que manda el servicio (números).
export function aDatosZapato(datos: DatosFormularioZapato): DatosZapato {
  return {
    nombre: datos.nombre.trim(),
    categoria: datos.categoria,
    precio: Number(datos.precio),
    talla: Number(datos.talla),
    descripcion: datos.descripcion.trim(),
    imagen: datos.imagen.trim(),
    marcaId: Number(datos.marcaId),
  };
}