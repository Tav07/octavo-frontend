// Igual a la Entrega 1: 289900 -> "$ 289.900"
export function formatearPrecio(precio: number): string {
  return `$ ${precio.toLocaleString("es-CO")}`;
}