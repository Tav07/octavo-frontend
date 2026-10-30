// Tipos del carrito de compras (lado cliente). El carrito vive en
// localStorage; su contenido es solo la selección del usuario: los
// montos se recalculan en el backend al confirmar el pedido.

// Un par en el carrito: zapato + talla elegida. La foto, el nombre y
// el precio son una copia del catálogo en el momento de agregar (el
// total real lo recalcula la API).
export interface ItemCarrito {
  zapatoId: number;
  talla: number;
  nombre: string;
  marca: string;
  imagen: string;
  precio: number;
  cantidad: number;
}

// Identidad de la línea: (zapato, talla). Dos tallas del mismo zapato
// son líneas distintas.
export function claveDe(zapatoId: number, talla: number): string {
  return `${zapatoId}-${talla}`;
}