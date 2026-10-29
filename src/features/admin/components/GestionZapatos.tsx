// Gestión del catálogo en el admin: listado paginado desde la API,
// edición con el mismo formulario y borrado con confirmación en dos
// clics (sin diálogos nativos).
"use client";

import { useState } from "react";
import Image from "next/image";
import Loading from "@/features/common/components/Loading";
import Empty from "@/features/common/components/Empty";
import ErrorState from "@/features/common/components/ErrorState";
import Pagination from "@/features/common/components/Pagination";
import { mensajeDeError } from "@/features/common/http";
import { useZapatos } from "@/features/zapatos/hooks/useZapatos";
import { formatearPrecio } from "@/features/zapatos/domain/precio";
import { eliminarZapato } from "@/features/zapatos/services/zapatos";
import type { Zapato } from "@/features/zapatos/domain/tipos";
import FormularioZapato from "./FormularioZapato";

export default function GestionZapatos() {
  const [pagina, setPagina] = useState(1);
  const { datos, cargando, error, reintentar } = useZapatos(pagina, 10);

  // null → modo crear; un zapato → modo editar (el formulario se
  // remonta con key para precargar sus useState iniciales)
  const [editando, setEditando] = useState<Zapato | null>(null);
  // id en confirmación de borrado (dos clics, sin confirm() nativo)
  const [idEliminando, setIdEliminando] = useState<number | null>(null);
  const [errorMutacion, setErrorMutacion] = useState<string | null>(null);
  const [borrando, setBorrando] = useState(false);

  async function confirmarEliminar(): Promise<void> {
    if (idEliminando === null) return;
    setBorrando(true);
    setErrorMutacion(null);
    try {
      await eliminarZapato(idEliminando);
      setIdEliminando(null);
      if (editando !== null && editando.id === idEliminando) setEditando(null);
      // La lista se vuelve a pedir del todo: el hook reintentar refresca
      reintentar();
    } catch (causa: unknown) {
      setBorrando(false);
      setErrorMutacion(mensajeDeError(causa));
    }
    // borrando queda en true solo hasta el refresco que reintentar dispara
  }

  function alCancelado(): void {
    // Tras borrar el zapato que se estaba editando, volvemos al modo crear
    setEditando(null);
  }

  if (cargando) {
    return <Loading texto="Cargando el catálogo…" />;
  }
  if (error !== null) {
    return <ErrorState mensaje={error} alReintentar={reintentar} />;
  }
  if (datos === null) {
    return <Empty texto="No hay zapatos." />;
  }

  const pagination = datos.pagination;
  // Fuera de rango (ej.: se borró el último de la última página): la
  // paginación se muestra con la última página válida para poder volver.
  const paginaVisible = Math.min(pagina, pagination.totalPages);

  return (
    <div className="flex flex-col gap-8">
      {/* Formulario (crear o editar) */}
      <section className="rounded-2xl border border-borde bg-fondo p-6">
        <FormularioZapato
          key={editando?.id ?? "nuevo"}
          zapato={editando}
          alGuardado={() => {
            setEditando(null);
            reintentar();
          }}
          alCancelarEdicion={alCancelado}
        />
      </section>

      {errorMutacion !== null && (
        <p role="status" className="text-sm font-semibold text-error">
          {errorMutacion}
        </p>
      )}

      {/* Listado */}
      {datos.data.length === 0 ? (
        <Empty texto="Esta página quedó vacía tras un borrado; vuelve a la página anterior." />
      ) : (
        <ul className="flex flex-col gap-3">
          {datos.data.map((zapato) => (
            <li
              key={zapato.id}
              className="flex flex-col gap-4 rounded-2xl border border-borde bg-fondo p-4 sm:flex-row sm:items-center"
            >
              <div className="relative aspect-[4/3] w-full shrink-0 bg-gris-suave sm:aspect-square sm:w-20">
                <Image
                  src={zapato.imagen}
                  alt={`Zapato ${zapato.nombre}`}
                  fill
                  sizes="80px"
                  className="rounded-xl object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold tracking-wide text-texto-suave uppercase">
                  {zapato.marca.nombre} · {zapato.categoria} · Talla {zapato.talla}
                </p>
                <h3 className="font-display text-lg font-bold tracking-tight">
                  {zapato.nombre}
                </h3>
                <p className="text-sm font-semibold text-tinta">
                  {formatearPrecio(zapato.precio)}
                </p>
              </div>
              {idEliminando === zapato.id ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-error">¿Eliminar?</span>
                  <button
                    type="button"
                    disabled={borrando}
                    onClick={confirmarEliminar}
                    className="rounded-lg bg-error px-4 py-2 font-semibold text-white transition-opacity disabled:opacity-50"
                  >
                    {borrando ? "Eliminando…" : "Sí, eliminar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIdEliminando(null)}
                    className="rounded-lg border border-borde px-4 py-2 font-medium text-tinta transition-colors hover:border-naranja"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setEditando(zapato);
                      setIdEliminando(null);
                    }}
                    className="rounded-lg border border-borde px-4 py-2 font-medium text-tinta transition-colors hover:border-naranja"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdEliminando(zapato.id);
                      setErrorMutacion(null);
                    }}
                    className="rounded-lg border border-error px-4 py-2 font-medium text-error transition-colors hover:bg-error hover:text-white"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <Pagination
        pagina={paginaVisible}
        totalPaginas={pagination.totalPages}
        alCambiar={setPagina}
      />
    </div>
  );
}