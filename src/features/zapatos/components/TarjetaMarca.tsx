import type { Marca } from "../domain/tipos";

// Tarjeta de marca, igual a .tarjeta-marca de la Entrega 1:
// nombre, descripción y país.
export default function TarjetaMarca({ marca }: { marca: Marca }) {
  return (
    <li className="flex flex-col gap-2 rounded-2xl border border-borde bg-fondo p-6 transition-shadow hover:shadow-lg">
      <h3 className="font-display text-lg font-bold tracking-tight">
        {marca.nombre}
      </h3>
      <p className="flex-1 text-sm text-texto-suave">{marca.descripcion}</p>
      <span className="w-fit rounded-full bg-gris-suave px-3 py-1 text-xs font-semibold text-tinta">
        {marca.pais}
      </span>
    </li>
  );
}