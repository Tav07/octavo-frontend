// Tipos del feature reservas: espejo de las entidades Reserva del backend
// (createdAt llega como string porque viaja en JSON).

export interface ZapatoReservado {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
}

export interface Reserva {
  id: number;
  userId: number;
  // Campos del formulario original; nombre/email salen de la sesión.
  telefono: string;
  talla: number;
  mensaje: string | null;
  createdAt: string;
  zapato: ZapatoReservado;
  usuario: { id: number; nombre: string; email: string };
}

// Lo que manda el formulario: el userId lo pone el backend desde el token.
export interface DatosReserva {
  zapatoId: number;
  telefono: string;
  talla: number;
  mensaje: string | null;
}