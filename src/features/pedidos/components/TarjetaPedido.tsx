import Image from "next/image";
import type { EstadoPedido, Pedido } from "../domain/tipos";
import { formatearPrecio } from "@/features/zapatos/domain/precio";
import { formatearFecha } from "../domain/fecha";

const ETIQUETAS_ESTADO: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente de pago",
  ENTREGADO: "Entregado",
};

// Tarjeta de un pedido: sus ítems con precio congelado, los datos de
// entrega y el total. La vista de admin además muestra quién compró.
interface Props {
  pedido: Pedido;
  mostrarUsuario?: boolean;
}

export default function TarjetaPedido({
  pedido,
  mostrarUsuario = false,
}: Props) {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-borde bg-fondo p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg font-bold tracking-tight">
          Pedido #{pedido.id}
        </h3>
        {pedido.estado === "PENDIENTE" ? (
          <span className="rounded-full bg-naranja/10 px-3 py-1 text-xs font-bold text-naranja-oscuro">
            {ETIQUETAS_ESTADO[pedido.estado]}
          </span>
        ) : (
          <span className="rounded-full bg-gris-suave px-3 py-1 text-xs font-bold text-texto-suave">
            {ETIQUETAS_ESTADO[pedido.estado]}
          </span>
        )}
      </div>

      {mostrarUsuario && (
        <p className="text-sm font-semibold text-tinta">
          {pedido.usuario.nombre}{" "}
          <span className="font-normal text-texto-suave">
            ({pedido.usuario.email})
          </span>
        </p>
      )}

      <ul className="flex flex-col gap-2.5">
        {pedido.items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-borde bg-gris-suave">
              <Image
                src={item.zapato.imagen}
                alt={item.zapato.nombre}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-tinta">
                {item.zapato.nombre}
              </p>
              <p className="text-xs text-texto-suave">Talla {item.talla}</p>
            </div>
            <span className="text-sm font-semibold tabular-nums text-tinta">
              {formatearPrecio(item.precioUnitario)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-1 border-t border-borde pt-3 text-sm text-texto-suave">
        <p>Envío a: {pedido.direccion}</p>
        <p>Teléfono: {pedido.telefono}</p>
        {pedido.nota !== null && <p>Nota: &ldquo;{pedido.nota}&rdquo;</p>}
        <p className="text-xs">Hecho el {formatearFecha(pedido.createdAt)}</p>
      </div>

      <p className="flex items-center justify-between border-t border-borde pt-3 font-display text-lg font-bold text-tinta">
        Total <span>{formatearPrecio(pedido.total)}</span>
      </p>
    </li>
  );
}