import type { ComponentProps } from "react";

// Campo textarea con etiqueta y error junto al control (igual que Input).
interface Props extends ComponentProps<"textarea"> {
  label: string;
  error?: string;
}

export default function TextArea({ label, error, id, className = "", ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <textarea
        id={id}
        className={`w-full rounded-lg border border-borde bg-fondo px-3 py-2.5 ${
          error !== undefined && error !== "" ? "border-error" : ""
        } ${className}`}
        aria-invalid={error !== undefined && error !== ""}
        {...props}
      />
      <span aria-live="polite" className="min-h-5 text-sm text-error">
        {error}
      </span>
    </div>
  );
}