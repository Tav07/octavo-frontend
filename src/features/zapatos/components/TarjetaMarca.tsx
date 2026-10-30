import Link from "next/link";
import type { Marca } from "../domain/tipos";

// Tarjeta de marca, igual a .tarjeta-marca de la Entrega 1:
// nombre, descripción y país. Clic → llega al catálogo filtrado por marca.
export default function TarjetaMarca({ marca }: { marca: Marca }) {
  return (
    <li className="transition-shadow hover:shadow-lg">
      <Link
        href={`/catalogo?marcaId=${marca.id}`}
        className="flex flex-col gap-2 rounded-2xl border border-borde bg-fondo p-6 transition-colors hover:border-naranja"
      >
        <h3 className="font-display text-lg font-bold tracking-tight">
          {marca.nombre}
        </h3>
        <p className="flex-1 text-sm text-texto-suave">{marca.descripcion}</p>
        <span className="w-fit rounded-full bg-gris-suave px-3 py-1 text-xs font-semibold text-tinta">
          {marca.pais}
        </span>
      </Link>
    </li>
  );
}