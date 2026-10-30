// Línea del carrito: foto, datos del par, cantidad y quitar.
"use client";

import Image from "next/image";
import { type ItemCarrito } from "../domain/tipos";
import { type ParaAgregar } from "./ProveedorCarrito";
import { formatearPrecio } from "@/features/zapatos/domain/precio";

interface Props {
  item: ItemCarrito;
  alMas: (item: ParaAgregar) => void;
  alMenos: (zapatoId: number, talla: number) => void;
  alTodo: (zapatoId: number, talla: number) => void;
}

export default function TarjetaCarrito({ item, alMas, alMenos, alTodo }: Props) {
  const subtotal = item.precio * item.cantidad;
  return (
    <li className="flex gap-4 py-5 sm:gap-6">
      <Image
        src={item.imagen}
        alt={`Zapato ${item.nombre}`}
        width={96}
        height={96}
        className="h-24 w-24 shrink-0 rounded-xl border border-borde object-cover"
        sizes="96px"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-xs font-semibold tracking-wide text-texto-suave uppercase">
          {item.marca}
        </span>
        <h2 className="font-display text-lg font-bold tracking-tight">
          {item.nombre}
        </h2>
        <p className="text-sm text-texto-suave">
          Talla {item.talla} · {formatearPrecio(item.precio)} c/u
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          {/* Cantidad */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Quitar una unidad de ${item.nombre} talla ${item.talla}`}
              className="h-7 w-7 rounded-md border border-borde text-sm font-bold text-tinta transition-colors hover:border-naranja hover:text-naranja disabled:cursor-not-allowed disabled:opacity-40"
              disabled={item.cantidad <= 1}
              onClick={() => alMenos(item.zapatoId, item.talla)}
            >
              −
            </button>
            <span aria-live="polite" className="w-6 text-center text-sm font-semibold tabular-nums">
              {item.cantidad}
            </span>
            <button
              type="button"
              aria-label={`Agregar una unidad más de ${item.nombre} talla ${item.talla}`}
              className="h-7 w-7 rounded-md border border-borde text-sm font-bold text-tinta transition-colors hover:border-naranja hover:text-naranja"
              onClick={() =>
                alMas({
                  zapatoId: item.zapatoId,
                  talla: item.talla,
                  nombre: item.nombre,
                  marca: item.marca,
                  imagen: item.imagen,
                  precio: item.precio,
                })
              }
            >
              +
            </button>
          </div>

          <span className="ml-auto text-sm font-bold text-tinta tabular-nums">
            {formatearPrecio(subtotal)}
          </span>

          <button
            type="button"
            className="text-sm font-medium text-texto-suave underline underline-offset-2 transition-colors hover:text-naranja"
            onClick={() => alTodo(item.zapatoId, item.talla)}
          >
            Quitar
          </button>
        </div>
      </div>
    </li>
  );
}