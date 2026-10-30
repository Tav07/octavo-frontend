// Tipos del feature de pedidos: espejo de la entidad Pedido del backend.
// El frontend nunca manda montos: el total lo recalcula la API con los
// precios de la base y cada ítem guarda el precio congelado al crear.

export type EstadoPedido = "PENDIENTE" | "ENTREGADO";

export interface ReferenciaZapatoPedido {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
}

// Un ítem por par (zapato, talla): el mismo par en cantidad 2 llega como
// dos ítems. El backend manda el precio congelado de cada uno.
export interface ItemPedido {
  id: number;
  zapatoId: number;
  talla: number;
  precioUnitario: number;
  zapato: ReferenciaZapatoPedido;
}

export interface Pedido {
  id: number;
  userId: number;
  estado: EstadoPedido;
  total: number;
  direccion: string;
  telefono: string;
  nota: string | null;
  createdAt: string;
  items: ItemPedido[];
  usuario: { id: number; nombre: string; email: string };
}

// Datos que el frontend envía: solo identidad de ítems, y los campos del
// formulario de checkout. Sin precios ni userId (sale del token).
export interface DatosNuevoPedido {
  items: { zapatoId: number; talla: number }[];
  direccion: string;
  telefono: string;
  nota: string;
}