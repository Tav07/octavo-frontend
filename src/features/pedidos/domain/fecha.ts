// Fecha larga es-CO compartida por las vistas de pedidos.
export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}