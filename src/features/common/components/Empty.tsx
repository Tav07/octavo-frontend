// Estado vacío (la API respondió bien pero no hay datos).
export default function Empty({
  texto = "No hay resultados para mostrar.",
}: {
  texto?: string;
}) {
  return (
    <p className="mt-8 rounded-xl bg-gris-suave p-10 text-center text-texto-suave">
      {texto}
    </p>
  );
}