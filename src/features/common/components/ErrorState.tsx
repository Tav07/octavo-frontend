"use client";

// Estado de error (la API falló o no está disponible), con reintento opcional.
export default function ErrorState({
  mensaje = "Ocurrió un error al cargar los datos.",
  alReintentar,
}: {
  mensaje?: string;
  alReintentar?: () => void;
}) {
  return (
    <div className="mt-8 rounded-xl bg-gris-suave p-10 text-center">
      <p className="font-semibold text-error">{mensaje}</p>
      {alReintentar !== undefined && (
        <button
          type="button"
          onClick={alReintentar}
          className="mt-4 rounded-lg border border-borde px-5 py-2 font-medium text-tinta transition-colors hover:border-naranja"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}