// Formulario del admin para crear o editar un zapato. Se remonta por key
// (desde la pantalla) cuando cambia el zapato editado, así los useState
// iniciales precargan sus datos sin efectos.
"use client";

import { useState, type FormEvent } from "react";
import Button from "@/features/common/components/Button";
import Input from "@/features/common/components/Input";
import Select from "@/features/common/components/Select";
import TextArea from "@/features/common/components/TextArea";
import { HttpError, mensajeDeError } from "@/features/common/http";
import { useMarcas } from "@/features/zapatos/hooks/useMarcas";
import { formatearPrecio } from "@/features/zapatos/domain/precio";
import type { Zapato } from "@/features/zapatos/domain/tipos";
import {
  crearZapato,
  actualizarZapato,
  type DatosZapato,
} from "@/features/zapatos/services/zapatos";
import {
  validarZapato,
  aDatosZapato,
  type DatosFormularioZapato,
} from "@/features/zapatos/domain/validacion";

interface Props {
  // null → crear; un zapato → editar (el formulario llega precargado)
  zapato: Zapato | null;
  alGuardado: () => void;
  alCancelarEdicion: () => void;
}

function estadoInicial(zapato: Zapato | null): DatosFormularioZapato {
  if (zapato === null) {
    return {
      nombre: "",
      categoria: "",
      precio: "",
      talla: "",
      descripcion: "",
      imagen: "",
      marcaId: "",
    };
  }
  return {
    nombre: zapato.nombre,
    categoria: zapato.categoria,
    precio: String(zapato.precio),
    talla: String(zapato.talla),
    descripcion: zapato.descripcion,
    imagen: zapato.imagen,
    marcaId: String(zapato.marcaId),
  };
}

export default function FormularioZapato({
  zapato,
  alGuardado,
  alCancelarEdicion,
}: Props) {
  const editando = zapato !== null;
  const [datos, setDatos] = useState<DatosFormularioZapato>(() =>
    estadoInicial(zapato)
  );
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Las marcas alimentan el select (mismo pedido que en la home)
  const { datos: marcas, cargando: cargandoMarcas } = useMarcas();

  function actualizar<NOMBRE extends keyof DatosFormularioZapato>(
    campo: NOMBRE,
    valor: string
  ): void {
    setDatos((actuales) => ({ ...actuales, [campo]: valor }));
    setErrores((actuales) => ({ ...actuales, [campo]: "" }));
  }

  async function alEnviar(evento: FormEvent<HTMLFormElement>): Promise<void> {
    evento.preventDefault();
    const faltas = validarZapato(datos);
    setErrores(faltas);
    if (Object.keys(faltas).length > 0) return;

    setEnviando(true);
    setErrorGeneral(null);
    const cuerpo: DatosZapato = aDatosZapato(datos);
    try {
      if (editando) {
        await actualizarZapato(zapato.id, cuerpo);
      } else {
        await crearZapato(cuerpo);
      }
      alGuardado();
    } catch (causa: unknown) {
      setEnviando(false);
      if (causa instanceof HttpError && causa.errors !== undefined) {
        setErrores(causa.errors);
      } else {
        setErrorGeneral(mensajeDeError(causa));
      }
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={alEnviar} noValidate>
      <h3 className="font-display text-xl font-bold tracking-tight">
        {editando ? `Editar ${zapato.nombre}` : "Nuevo zapato"}
      </h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="zapato-nombre"
          label="Nombre"
          value={datos.nombre}
          onChange={(e) => actualizar("nombre", e.target.value)}
          error={errores.nombre}
          disabled={enviando}
        />
        <Select
          id="zapato-categoria"
          label="Categoría"
          value={datos.categoria}
          onChange={(e) => actualizar("categoria", e.target.value)}
          error={errores.categoria}
          disabled={enviando}
        >
          <option value="">Selecciona una categoría…</option>
          <option value="running">Running</option>
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
        </Select>
        <Select
          id="zapato-marca"
          label="Marca"
          value={datos.marcaId}
          onChange={(e) => actualizar("marcaId", e.target.value)}
          error={errores.marcaId}
          disabled={enviando || cargandoMarcas}
        >
          <option value="">
            {cargandoMarcas ? "Cargando marcas…" : "Selecciona una marca…"}
          </option>
          {marcas?.map((marca) => (
            <option key={marca.id} value={marca.id}>
              {marca.nombre}
            </option>
          ))}
        </Select>
        <Input
          id="zapato-precio"
          label={`Precio (ej.: ${formatearPrecio(289900)})`}
          type="number"
          min={1}
          value={datos.precio}
          onChange={(e) => actualizar("precio", e.target.value)}
          error={errores.precio}
          disabled={enviando}
        />
        <Input
          id="zapato-talla"
          label="Talla"
          type="number"
          min={20}
          max={50}
          value={datos.talla}
          onChange={(e) => actualizar("talla", e.target.value)}
          error={errores.talla}
          disabled={enviando}
        />
        <Input
          id="zapato-imagen"
          label="Imagen (ruta en /images/)"
          placeholder="/images/zapato1.jpg"
          value={datos.imagen}
          onChange={(e) => actualizar("imagen", e.target.value)}
          error={errores.imagen}
          disabled={enviando}
        />
      </div>
      <TextArea
        id="zapato-descripcion"
        label="Descripción"
        rows={3}
        value={datos.descripcion}
        onChange={(e) => actualizar("descripcion", e.target.value)}
        error={errores.descripcion}
        disabled={enviando}
      />

      <p aria-live="polite" className="min-h-5 text-sm text-error">
        {errorGeneral}
      </p>

      <div className="flex gap-3">
        <Button type="submit" disabled={enviando}>
          {enviando ? "Guardando…" : editando ? "Guardar cambios" : "Crear zapato"}
        </Button>
        {editando && (
          <Button type="button" disabled={enviando} onClick={alCancelarEdicion}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}