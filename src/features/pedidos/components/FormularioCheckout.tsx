// Formulario de checkout: convierte el carrito en un pedido en la API.
// Requiere sesión (sin ella invita a ingresar) y recibe los ítems del
// carrito por props; el backend recalcula el total y congela los precios,
// acá solo viajan zapatoId + talla por cada par. Tras el POST exitoso el
// carrito se vacía y se muestra la confirmación con el estado del pedido.
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Button from "@/features/common/components/Button";
import Input from "@/features/common/components/Input";
import TextArea from "@/features/common/components/TextArea";
import { HttpError, mensajeDeError } from "@/features/common/http";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCarrito } from "@/features/carrito/hooks/useCarrito";
import type { ItemCarrito } from "@/features/carrito/domain/tipos";
import { formatearPrecio } from "@/features/zapatos/domain/precio";
import { validarCheckout, type DatosCheckout } from "../domain/validacion";
import { crearPedido } from "../services/pedidos";
import type { Pedido } from "../domain/tipos";

interface Props {
  // Las líneas del carrito con su cantidad: el envío al backend expande
  // cada cantidad en ítems propios.
  items: ItemCarrito[];
  // Avisa a la página que ya hay pedido, para que su guard de carrito
  // vacío no redirija a /carrito justo después de vaciarlo.
  alCreado: () => void;
}

export default function FormularioCheckout({ items, alCreado }: Props) {
  const { usuario, listo } = useAuth();
  const { vaciar } = useCarrito();

  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nota, setNota] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [pedido, setPedido] = useState<Pedido | null>(null);

  // Mientras la sesión rehidrata no se renderiza nada: sin desajuste de
  // hidratación (en el servidor listo es false y aquí arranca igual).
  if (!listo) return null;

  // Sin sesión: invita a ingresar en lugar de redirigir (el resumen del
  // carrito queda visible; ya con sesión el formulario funciona de una vez).
  if (usuario === null) {
    return (
      <div className="rounded-xl border border-borde bg-gris-suave p-10 text-center">
        <p className="text-texto-suave">
          Para confirmar el pedido necesitas una cuenta. Ingresa o regístrate y
          continuarás con tus pares ya guardados en el carrito.
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
    const formulario: DatosCheckout = { direccion, telefono, nota };
    const faltas = validarCheckout(formulario);
    setErrores(faltas);
    // Cada entrada del carrito viaja como su propio ítem: dos pares iguales
    // son dos ítems y se cobran dos veces.
    const pares = items.flatMap((item) =>
      Array.from({ length: item.cantidad }, () => ({
        zapatoId: item.zapatoId,
        talla: item.talla,
      }))
    );
    if (Object.keys(faltas).length > 0 || pares.length === 0) return;

    setEnviando(true);
    setErrorGeneral(null);
    try {
      const creado = await crearPedido({
        items: pares,
        direccion: formulario.direccion.trim(),
        telefono: formulario.telefono.trim(),
        nota: formulario.nota.trim() === "" ? "" : formulario.nota.trim(),
      });
      setPedido(creado);
      vaciar(); // El pedido ya está en la API: el carrito vuelve a cero.
      alCreado();
    } catch (causa: unknown) {
      setEnviando(false);
      if (causa instanceof HttpError && causa.errors !== undefined) {
        // Los errores de campos del formulario van a su campo; los de los
        // ítems (ej. items.Superstar.talla) se combinan con el mensaje general.
        const deCampos: Record<string, string> = {};
        for (const [campo, texto] of Object.entries(causa.errors)) {
          if (["direccion", "telefono", "nota"].includes(campo)) {
            deCampos[campo] = texto;
          }
        }
        setErrores(deCampos);
        setErrorGeneral(causa.message);
      } else {
        setErrorGeneral(mensajeDeError(causa));
      }
    }
  }

  // Pedido confirmado: el estado en la base es PENDIENTE (pendiente de pago).
  if (pedido !== null) {
    return (
      <div
        role="status"
        className="rounded-xl border border-borde bg-exito/10 p-10 text-center"
      >
        <p className="text-lg font-semibold text-exito">
          ¡Pedido #{pedido.id} confirmado!
        </p>
        <p className="mt-2 text-texto-suave">
          Queda <span className="font-semibold text-tinta">pendiente de pago</span>:
          pagarás {formatearPrecio(pedido.total)} contra entrega. Lo encuentras
          con su estado actual en Mis pedidos.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/mis-pedidos"
            className="inline-block rounded-lg bg-naranja px-5 py-2 font-semibold text-fondo transition-colors hover:bg-naranja-oscuro"
          >
            Ver mis pedidos
          </Link>
          <Link
            href="/catalogo"
            className="inline-block rounded-lg border border-borde px-5 py-2 font-medium text-tinta transition-colors hover:border-naranja"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    );
  }

  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  const pares = items.reduce((suma, item) => suma + item.cantidad, 0);

  return (
    <form className="flex flex-col gap-5" onSubmit={alEnviar} noValidate>
      <div className="rounded-xl border border-borde bg-gris-suave p-5 text-sm text-texto-suave">
        Pagas contra entrega cuando el pedido llegue. Llevas{" "}
        <span className="font-semibold text-tinta">
          {pares} {pares === 1 ? "par" : "pares"}
        </span>{" "}
        por <span className="font-semibold text-tinta">{formatearPrecio(total)}</span>.
      </div>

      <fieldset className="flex flex-col gap-5 rounded-xl border border-borde p-5">
        <legend className="px-2 text-sm font-bold tracking-wide text-texto-suave uppercase">
          Entrega
        </legend>
        <p className="text-sm text-texto-suave">
          Compras como <span className="font-semibold text-tinta">{usuario.nombre}</span>{" "}
          ({usuario.email}).
        </p>
        <Input
          id="checkout-direccion"
          label="Dirección de entrega"
          placeholder="Calle, número, ciudad"
          value={direccion}
          onChange={(e) => {
            setDireccion(e.target.value);
            setErrores((actuales) => ({ ...actuales, direccion: "" }));
          }}
          error={errores.direccion}
          disabled={enviando}
        />
        <Input
          id="checkout-telefono"
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
        <TextArea
          id="checkout-nota"
          label="Nota para la entrega (opcional)"
          rows={3}
          placeholder="Ej: dejar en portería si no estoy"
          value={nota}
          onChange={(e) => {
            setNota(e.target.value);
            setErrores((actuales) => ({ ...actuales, nota: "" }));
          }}
          error={errores.nota}
          disabled={enviando}
        />
      </fieldset>

      <p aria-live="polite" className="min-h-5 text-sm text-error">
        {errorGeneral}
      </p>

      <Button type="submit" disabled={enviando}>
        {enviando ? "Confirmando…" : "Confirmar pedido"}
      </Button>
    </form>
  );
}