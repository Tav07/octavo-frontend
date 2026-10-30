// Hook del carrito: acceso tipado al contexto (falla si falta el provider).
"use client";

import { useContext } from "react";
import { CarritoContext } from "../components/ProveedorCarrito";
import type { ValorCarrito } from "../components/ProveedorCarrito";

export function useCarrito(): ValorCarrito {
  const valor = useContext(CarritoContext);
  if (valor === null) {
    throw new Error("useCarrito debe usarse dentro de ProveedorCarrito");
  }
  return valor;
}