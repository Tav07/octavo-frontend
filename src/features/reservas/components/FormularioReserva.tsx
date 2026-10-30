// Formulario de reserva de la Entrega 1, conectado a la API. Requiere
// sesión: sin ella invita a ingresar; nombre/email salen del usuario de
// la sesión (el backend toma el userId del token, nunca del body).
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Button from "@/features/common/components/Button";
import Input from "@/features/common/components/Input";
import Select from "@/features/common/components/Select";
import TextArea from "@/features/common/components/TextArea";
import ErrorState from "@/features/common/components/ErrorState";
import { HttpError, mensajeDeError } from "@/features/common/http";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useZapatos } from "@/features/zapatos/hooks/useZapatos";
import { formatearPrecio } from "@/features/zapatos/domain/precio";
import { validarReserva, type DatosFormularioReserva } from "../domain/validacion";
import { crearReserva } from "../services/reservas";
import type { Reserva } from "../domain/tipos";

// El select del formulario necesita todos los zapatos disponibles:
// límite alto (el seed de la Entrega 1 tiene 12) para pedirlos de una vez.
const LIMITE_SELECT = 100;

export default function FormularioReserva() {
  const { usuario, listo } = useAuth();
  const { datos, cargando, error, reintentar } = useZapatos({
    page: 1,
    limit: LIMITE_SELECT,
  });

  const [zapatoId, setZapatoId] = useState("");
  const [telefono, setTelefono] = useState("");
  const [talla, setTalla] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [creada, setCreada] = useState<Reserva | null>(null);

  // Mientras la sesión rehidrata no se renderiza nada: sin desajuste de
  // hidratación (en el servidor listo es false y aquí arranca igual).
  if (!listo) return null;

  // Sin sesión: la sección invita a ingresar en lugar de redirigir (la
  // home queda visible; ya con sesión el formulario funciona de una vez).
  if (usuario === null) {
    return (
      <div className="rounded-xl border border-borde bg-gris-suave p-10 text-center">
        <p className="text-texto-suave">
          Para reservar un par necesitas una cuenta. Ingresa o regístrate y
          volveremos a contactarte con la disponibilidad de tu talla.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-block rounded-lg bg-naranja px-7 py-3 font-semibold text-fondo transition-colors hover:bg-naranja-oscuro"
        >
          Ingresar
        </Link>
      </div>
    );
  }

  async function alEnviar(evento: FormEvent<HTMLFormElement>): Promise<void> {
    evento.preventDefault();
    const formulario: DatosFormularioReserva = { zapatoId, telefono, talla, mensaje };
    const faltas = validarReserva(formulario);
    setErrores(faltas);
    if (Object.keys(faltas).length > 0) return;

    setEnviando(true);
    setErrorGeneral(null);
    try {
      const reserva = await crearReserva({
        zapatoId: Number(formulario.zapatoId),
        telefono: formulario.telefono.trim(),
        talla: Number(formulario.talla),
        mensaje: formulario.mensaje.trim() === "" ? null : formulario.mensaje.trim(),
      });
      setCreada(reserva);
    } catch (causa: unknown) {
      setEnviando(false);
      if (causa instanceof HttpError && causa.errors !== undefined) {
        setErrores(causa.errors);
      } else {
        setErrorGeneral(mensajeDeError(causa));
      }
    }
  }

  // Reserva creada: misma frase de éxito de la Entrega 1 + enlace a mis reservas.
  if (creada !== null) {
    return (
      <div
        role="status"
        className="rounded-xl border border-borde bg-exito/10 p-10 text-center"
      >
        <p className="font-semibold text-exito">
          ¡Reserva enviada! Te contactaremos muy pronto.
        </p>
        <p className="mt-2 text-texto-suave">
          Reservaste {creada.zapato.nombre} en talla {creada.talla}. Ya la ves
          en Mis reservas.
        </p>
        <Link
          href="/mis-reservas"
          className="mt-5 inline-block rounded-lg border border-borde px-5 py-2 font-medium text-tinta transition-colors hover:border-naranja"
        >
          Ver mis reservas
        </Link>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={alEnviar} noValidate>
      <fieldset className="flex flex-col gap-5 rounded-xl border border-borde p-5">
        <legend className="px-2 text-sm font-bold tracking-wide text-texto-suave uppercase">
          Tus datos
        </legend>
        {/* Los datos de la persona ya están en la cuenta: no se editan aquí */}
        <p className="text-sm text-texto-suave">
          Reservas como <span className="font-semibold text-tinta">{usuario.nombre}</span>{" "}
          ({usuario.email}). El teléfono es para contactarte.
        </p>
        <Input
          id="reserva-telefono"
          label="Teléfono"
          type="tel"
          autoComplete="tel"
          value={telefono}
          onChange={(e) => {
            setTelefono(e.target.value);
            setErrores((actuales) => ({ ...actuales, telefono: "" }));
          }}
          error={errores.telefono}
          disabled={enviando}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-5 rounded-xl border border-borde p-5">
        <legend className="px-2 text-sm font-bold tracking-wide text-texto-suave uppercase">
          Tu pedido
        </legend>
        {error !== null ? (
          <ErrorState mensaje={error} alReintentar={reintentar} />
        ) : (
          <Select
            id="reserva-zapato"
            label="Zapato que te interesa"
            value={zapatoId}
            onChange={(e) => {
              setZapatoId(e.target.value);
              setErrores((actuales) => ({ ...actuales, zapatoId: "" }));
            }}
            error={errores.zapatoId}
            disabled={enviando || cargando}
          >
            <option value="">
              {cargando ? "Cargando catálogo…" : "Selecciona un zapato…"}
            </option>
            {datos?.data.map((zapato) => (
              <option key={zapato.id} value={zapato.id}>
                {zapato.nombre} — {zapato.marca.nombre} ({formatearPrecio(zapato.precio)})
              </option>
            ))}
          </Select>
        )}
        <Input
          id="reserva-talla"
          label="Talla"
          type="number"
          min={20}
          max={50}
          value={talla}
          onChange={(e) => {
            setTalla(e.target.value);
            setErrores((actuales) => ({ ...actuales, talla: "" }));
          }}
          error={errores.talla}
          disabled={enviando}
        />
        <TextArea
          id="reserva-mensaje"
          label="Mensaje (opcional)"
          rows={3}
          placeholder="Ej: me interesa en color negro"
          value={mensaje}
          onChange={(e) => {
            setMensaje(e.target.value);
            setErrores((actuales) => ({ ...actuales, mensaje: "" }));
          }}
          error={errores.mensaje}
          disabled={enviando}
        />
      </fieldset>

      <p aria-live="polite" className="min-h-5 text-sm text-error">
        {errorGeneral}
      </p>

      <Button type="submit" disabled={enviando || cargando}>
        {enviando ? "Enviando…" : "Enviar reserva"}
      </Button>
    </form>
  );
}