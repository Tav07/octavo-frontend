// Hook del catálogo: pide la página indicada y expone cargando/error/datos.
// La página vive en la URL (?page=); este hook solo la consume.
"use client";

import { useCallback, useEffect, useState } from "react";
import { mensajeDeError } from "@/features/common/http";
import type { RespuestaCatalogo } from "../domain/tipos";
import { listarZapatos } from "../services/zapatos";
import type { EstadoDatos } from "./tipos";

// Último resultado completado: null en errores y datos del intento previo.
interface Resultado {
  pagina: number;
  intento: number;
  datos: RespuestaCatalogo | null;
  error: string | null;
}

const SIN_RESULTADO: Resultado = { pagina: 0, intento: -1, datos: null, error: null };

export function useZapatos(
  pagina: number,
  limite: number
): EstadoDatos<RespuestaCatalogo> {
  const [resultado, setResultado] = useState<Resultado>(SIN_RESULTADO);
  const [intento, setIntento] = useState(0);

  const reintentar = useCallback(() => {
    setIntento((actual) => actual + 1);
  }, []);

  useEffect(() => {
    let vigente = true;
    listarZapatos({ page: pagina, limit: limite })
      .then((respuesta) => {
        if (vigente) {
          setResultado({ pagina, intento, datos: respuesta, error: null });
        }
      })
      .catch((causa: unknown) => {
        if (vigente) {
          setResultado({ pagina, intento, datos: null, error: mensajeDeError(causa) });
        }
      });
    // Al desmontar (o si ya cambió la página) se descarta la respuesta tardía
    return () => {
      vigente = false;
    };
  }, [pagina, limite, intento]);

  // Cargando se DERIVA (no se fija en el effect): un intento nuevo vuelve a
  // cargar hasta que su respuesta llega y reemplaza al resultado anterior.
  const cargando =
    resultado.pagina !== pagina || resultado.intento !== intento;
  const datos = cargando ? null : resultado.datos;
  const error = cargando ? null : resultado.error;

  return { datos, cargando, error, reintentar };
}