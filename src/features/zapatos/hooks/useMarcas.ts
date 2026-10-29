// Hook de la sección de marcas: carga GET /api/marcas con estados.
"use client";

import { useCallback, useEffect, useState } from "react";
import { mensajeDeError } from "@/features/common/http";
import type { Marca } from "../domain/tipos";
import { listarMarcas } from "../services/marcas";
import type { EstadoDatos } from "./tipos";

// Último resultado completado; intento -1 = todavía no carga nada.
interface Resultado {
  intento: number;
  datos: Marca[] | null;
  error: string | null;
}

const SIN_RESULTADO: Resultado = { intento: -1, datos: null, error: null };

export function useMarcas(): EstadoDatos<Marca[]> {
  const [resultado, setResultado] = useState<Resultado>(SIN_RESULTADO);
  const [intento, setIntento] = useState(0);

  const reintentar = useCallback(() => {
    setIntento((actual) => actual + 1);
  }, []);

  useEffect(() => {
    let vigente = true;
    listarMarcas()
      .then((respuesta) => {
        if (vigente) {
          setResultado({ intento, datos: respuesta, error: null });
        }
      })
      .catch((causa: unknown) => {
        if (vigente) {
          setResultado({ intento, datos: null, error: mensajeDeError(causa) });
        }
      });
    return () => {
      vigente = false;
    };
  }, [intento]);

  // Cargando se DERIVA: mientras la respuesta del intento activo no llegue,
  // seguimos mostrando el estado de carga (el setState vive en los callbacks).
  const cargando = resultado.intento !== intento;
  const datos = cargando ? null : resultado.datos;
  const error = cargando ? null : resultado.error;

  return { datos, cargando, error, reintentar };
}