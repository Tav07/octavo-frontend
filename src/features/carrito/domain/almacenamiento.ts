// Persistencia del carrito en localStorage. Con SSR (y con
// localStorage bloqueado) todo es silencioso y devuelve [].
import { claveDe, type ItemCarrito } from "./tipos";

export const CLAVE_CARRITO = "octavo.carrito";

// Type guard: lo que venga del localStorage no se confía sin validar.
function esItemCarrito(valor: unknown): valor is ItemCarrito {
  if (typeof valor !== "object" || valor === null) return false;
  const item = valor as Record<string, unknown>;
  return (
    typeof item.zapatoId === "number" &&
    typeof item.talla === "number" &&
    typeof item.nombre === "string" &&
    typeof item.marca === "string" &&
    typeof item.imagen === "string" &&
    typeof item.precio === "number" &&
    typeof item.cantidad === "number" &&
    item.cantidad > 0
  );
}

export function leerCarrito(): ItemCarrito[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CLAVE_CARRITO);
    if (bruto === null) return [];
    const valorDesconocido: unknown = JSON.parse(bruto);
    if (!Array.isArray(valorDesconocido)) return [];
    return valorDesconocido.filter(esItemCarrito);
  } catch {
    return [];
  }
}

export function guardarCarrito(items: ItemCarrito[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  } catch {
    // localStorage bloqueado (privado/cuota): el carrito vive solo en memoria
  }
}

export { claveDe };