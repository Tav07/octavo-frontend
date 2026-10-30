// Hook del catálogo: pide la página indicada con los filtros activos y
// expone cargando/error/datos. Los parámetros viven en la URL
// (/catalogo?page=&marcaId=&q=); este hook solo los consume.
"use client";

import { useCallback, useEffect, useState } from "react";
import { mensajeDeError } from "@/features/common/http";
import type { RespuestaCatalogo } from "../domain/tipos";
import type { FiltrosCatalogo } from "../services/zapatos";
import { listarZapatos } from "../services/zapatos";
import type { EstadoDatos } from "./tipos";

// Último resultado completado: null en errores y datos del intento previo.
interface Resultado {
  clave: string;
  intento: number;
  datos: RespuestaCatalogo | null;
  error: string | null;
}

const SIN_RESULTADO: Resultado = { clave: "", intento: -1, datos: null, error: null };

export function useZapatos(
  filtros: FiltrosCatalogo
): EstadoDatos<RespuestaCatalogo> {
  // Identidad de la consulta: cualquier cambio de página o filtro
  // dispara la carga de nuevo.
  const clave = `${filtros.page}|${filtros.marcaId ?? ""}|${filtros.q ?? ""}`;
  const [resultado, setResultado] = useState<Resultado>(SIN_RESULTADO);
  const [intento, setIntento] = useState(0);

  const reintentar = useCallback(() => {
    setIntento((actual) => actual + 1);
  }, []);

  useEffect(() => {
    let vigente = true;
    listarZapatos(filtros)
      .then((respuesta) => {
        if (vigente) {
          setResultado({ clave, intento, datos: respuesta, error: null });
        }
      })
      .catch((causa: unknown) => {
        if (vigente) {
          setResultado({ clave, intento, datos: null, error: mensajeDeError(causa) });
        }
      });
    // Al desmontar (o si ya cambió la consulta) se descarta la respuesta tardía
    return () => {
      vigente = false;
    };
    // Los filtros llegan serializados en `clave`: es su versión estable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, intento]);

  // Cargando se DERIVA (no se fija en el effect): un intento nuevo vuelve a
  // cargar hasta que su respuesta llega y reemplaza al resultado anterior.
  const cargando = resultado.clave !== clave || resultado.intento !== intento;
  const datos = cargando ? null : resultado.datos;
  const error = cargando ? null : resultado.error;

  return { datos, cargando, error, reintentar };
}