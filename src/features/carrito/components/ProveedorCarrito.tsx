// Contexto del carrito: la selección vive en memoria y se persiste en
// localStorage. Rehidrata después del primer render para que el HTML
// de servidor y cliente coincidan (sin desajuste de hidratación).
"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import { guardarCarrito, leerCarrito } from "../domain/almacenamiento";
import { claveDe, type ItemCarrito } from "../domain/tipos";

export type ParaAgregar = Omit<ItemCarrito, "cantidad">;

export interface ValorCarrito {
  items: ItemCarrito[];
  // false hasta rehidratar: así el badge del navbar no desajusta el HTML.
  listo: boolean;
  // Suman 1 en la cantidad de la línea (o la crean).
  agregar: (item: ParaAgregar) => void;
  // Quita una unidad de la línea.
  quitarUnidad: (zapatoId: number, talla: number) => void;
  // Quita la línea completa.
  quitarTodo: (zapatoId: number, talla: number) => void;
  vaciar: () => void;
}

const CarritoContext = createContext<ValorCarrito | null>(null);

export function ProveedorCarrito({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [listo, setListo] = useState(false);

  // Rehidratación en un callback aparte del body del effect (regla
  // react-hooks/set-state-in-effect): setState vive en la promesa.
  useEffect(() => {
    let vigente = true;
    Promise.resolve().then(() => {
      if (vigente) {
        setItems(leerCarrito());
        setListo(true);
      }
    });
    return () => {
      vigente = false;
    };
  }, []);

  // Persistencia derivada: cada vez que la lista cambia (ya rehidratada)
  // se reescribe el almacenamiento. Es IO, no setState.
  useEffect(() => {
    if (listo) guardarCarrito(items);
  }, [items, listo]);

  const agregar = (item: ParaAgregar): void => {
    const clave = claveDe(item.zapatoId, item.talla);
    setItems((actuales) => {
      const existe = actuales.some((linea) => claveDe(linea.zapatoId, linea.talla) === clave);
      return existe
        ? actuales.map((linea) =>
            claveDe(linea.zapatoId, linea.talla) === clave
              ? { ...linea, cantidad: linea.cantidad + 1 }
              : linea
          )
        : [...actuales, { ...item, cantidad: 1 }];
    });
  };

  const quitarUnidad = (zapatoId: number, talla: number): void => {
    const clave = claveDe(zapatoId, talla);
    setItems((actuales) =>
      actuales
        .map((linea) =>
          claveDe(linea.zapatoId, linea.talla) === clave
            ? { ...linea, cantidad: linea.cantidad - 1 }
            : linea
        )
        .filter((linea) => linea.cantidad > 0)
    );
  };

  const quitarTodo = (zapatoId: number, talla: number): void => {
    const clave = claveDe(zapatoId, talla);
    setItems((actuales) =>
      actuales.filter((linea) => claveDe(linea.zapatoId, linea.talla) !== clave)
    );
  };

  const vaciar = (): void => {
    setItems([]);
  };

  return (
    <CarritoContext.Provider
      value={{ items, listo, agregar, quitarUnidad, quitarTodo, vaciar }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export { CarritoContext };