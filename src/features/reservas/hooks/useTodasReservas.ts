// Hook del listado de TODAS las reservas (vista admin, GET /api/reservas).
"use client";

import { useCallback, useEffect, useState } from "react";
import { mensajeDeError } from "@/features/common/http";
import type { Reserva } from "../domain/tipos";
import { listarTodasReservas } from "../services/reservas";
import type { EstadoDatos } from "@/features/zapatos/hooks/tipos";

// Mismo patrón que useMisReservas: resultado del último intento y
// "cargando" derivado (setState solo en callbacks del effect).
interface Resultado {
  intento: number;
  datos: Reserva[] | null;
  error: string | null;
}

const SIN_RESULTADO: Resultado = { intento: -1, datos: null, error: null };

export function useTodasReservas(): EstadoDatos<Reserva[]> {
  const [resultado, setResultado] = useState<Resultado>(SIN_RESULTADO);
  const [intento, setIntento] = useState(0);

  const reintentar = useCallback(() => {
    setIntento((actual) => actual + 1);
  }, []);

  useEffect(() => {
    let vigente = true;
    listarTodasReservas()
      .then((datos) => {
        if (vigente) {
          setResultado({ intento, datos, error: null });
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

  const cargando = resultado.intento !== intento;
  const datos = cargando ? null : resultado.datos;
  const error = cargando ? null : resultado.error;

  return { datos, cargando, error, reintentar };
}