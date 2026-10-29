// Estado de cargando (visible mientras la API responde).
export default function Loading({ texto = "Cargando…" }: { texto?: string }) {
  return (
    <p
      role="status"
      className="mt-8 rounded-xl bg-gris-suave p-10 text-center text-texto-suave"
    >
      {texto}
    </p>
  );
}