import Image from "next/image";
import type { Reserva } from "../domain/tipos";
import { formatearPrecio } from "@/features/zapatos/domain/precio";

// Tarjeta de una reserva del usuario en "mis reservas": el zapato
// reservado (nombre, imagen, precio) más los datos del formulario.
interface Props {
  reserva: Reserva;
}

export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function TarjetaReserva({ reserva }: Props) {
  return (
    <li className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-borde bg-fondo p-4 sm:flex-row sm:items-center">
      <div className="relative aspect-[4/3] w-full shrink-0 bg-gris-suave sm:aspect-square sm:w-40">
        <Image
          src={reserva.zapato.imagen}
          alt={`Zapato reservado ${reserva.zapato.nombre}`}
          fill
          sizes="(max-width: 640px) 100vw, 160px"
          className="rounded-xl object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <h3 className="font-display text-lg font-bold tracking-tight">
          {reserva.zapato.nombre}
        </h3>
        <div className="flex items-center gap-3 text-sm font-semibold text-tinta">
          <span>{formatearPrecio(reserva.zapato.precio)}</span>
          <span className="rounded-full bg-gris-suave px-3 py-0.5 text-xs font-medium text-texto-suave">
            Talla {reserva.talla}
          </span>
        </div>
        <p className="text-sm text-texto-suave">
          Teléfono: {reserva.telefono}
        </p>
        {reserva.mensaje !== null && (
          <p className="text-sm text-texto-suave">&ldquo;{reserva.mensaje}&rdquo;</p>
        )}
        <p className="mt-1 text-xs text-texto-suave">
          Reservado el {formatearFecha(reserva.createdAt)}
        </p>
      </div>
    </li>
  );
}