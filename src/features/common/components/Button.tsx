import type { ComponentProps } from "react";

// Botón principal de Octavo (naranja), igual al .boton-principal de la Entrega 1.
type Props = ComponentProps<"button">;

export default function Button({ className = "", type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      className={`rounded-lg bg-naranja px-7 py-3 font-semibold text-fondo transition-colors hover:bg-naranja-oscuro ${className}`}
      {...props}
    />
  );
}