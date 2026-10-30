// Tarjeta del producto en el catálogo, con el diseño de .tarjeta de la
// Entrega 1 y las tallas disponibles de la API: ahora elige talla
// (chips) y agrega el par al carrito. Requiere cliente por el estado
// de la talla seleccionada.
"use client";

import Image from "next/image";
import { useState } from "react";
import type { Zapato } from "../domain/tipos";
import { formatearPrecio } from "../domain/precio";
import { useCarrito } from "@/features/carrito/hooks/useCarrito";

interface Props {
  zapato: Zapato;
}

// La talla sugerida al abrir la tarjeta es la principal de la Entrega 1
// (si está dentro del rango disponible) o la primera del rango.
function tallaInicial(zapato: Zapato): number {
  return zapato.tallas.includes(zapato.talla) ? zapato.talla : (zapato.tallas[0] ?? zapato.talla);
}

export default function TarjetaZapato({ zapato }: Props) {
  const { agregar } = useCarrito();
  const [talla, setTalla] = useState(tallaInicial(zapato));
  const [agregado, setAgregado] = useState(false);

  const alAgregar = () => {
    agregar({
      zapatoId: zapato.id,
      talla,
      nombre: zapato.nombre,
      marca: zapato.marca.nombre,
      imagen: zapato.imagen,
      precio: zapato.precio,
    });
    setAgregado(true);
    window.setTimeout(() => setAgregado(false), 1600);
  };

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
        <p className="line-clamp-2 text-sm text-texto-suave">{zapato.descripcion}</p>

        {/* Tallas disponibles (desde la API): una a la vez */}
        <div className="mt-1 flex flex-wrap gap-1.5" role="group" aria-label={`Tallas de ${zapato.nombre}`}>
          {zapato.tallas.map((op) => (
            <button
              key={op}
              type="button"
              aria-pressed={op === talla}
              onClick={() => setTalla(op)}
              className={`min-w-9 rounded-md border px-2 py-1 text-xs font-semibold tabular-nums transition-colors ${
                op === talla
                  ? "border-naranja bg-naranja text-fondo"
                  : "border-borde text-tinta hover:border-naranja hover:text-naranja"
              }`}
            >
              {op}
            </button>
          ))}
        </div>

        <div className="mt-3 border-t border-borde pt-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-lg font-bold text-tinta">
              {formatearPrecio(zapato.precio)}
            </span>
            <button
              type="button"
              onClick={alAgregar}
              className="rounded-lg bg-tinta px-4 py-2 text-sm font-semibold text-fondo transition-colors hover:bg-naranja"
            >
              {agregado ? "Agregado ✓" : "Agregar"}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}