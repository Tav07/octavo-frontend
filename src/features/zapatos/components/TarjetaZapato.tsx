import Image from "next/image";
import type { Zapato } from "../domain/tipos";
import { formatearPrecio } from "../domain/precio";

// Tarjeta del catálogo, igual a .tarjeta de la Entrega 1:
// imagen, nombre, marca, descripción y pie con precio y talla.
interface Props {
  zapato: Zapato;
}

export default function TarjetaZapato({ zapato }: Props) {
  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-borde bg-fondo transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-gris-suave">
        <Image
          src={zapato.imagen}
          alt={`Zapato ${zapato.nombre} de la marca ${zapato.marca.nombre}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-semibold tracking-wide text-texto-suave uppercase">
          {zapato.marca.nombre} · {zapato.categoria}
        </span>
        <h3 className="font-display text-lg font-bold tracking-tight">
          {zapato.nombre}
        </h3>
        <p className="flex-1 text-sm text-texto-suave">{zapato.descripcion}</p>
        <div className="mt-2 flex items-center justify-between border-t border-borde pt-3">
          <span className="text-lg font-bold text-tinta">
            {formatearPrecio(zapato.precio)}
          </span>
          <span className="text-sm font-medium text-texto-suave">
            Talla {zapato.talla}
          </span>
        </div>
      </div>
    </li>
  );
}