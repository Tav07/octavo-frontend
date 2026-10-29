// Panel de administración: CRUD de zapatos y listado de todas las reservas.
// El acceso por rol lo controla la página /admin; aquí solo la vista.
import GestionZapatos from "./GestionZapatos";
import ListaReservasAdmin from "./ListaReservasAdmin";

export default function PanelAdmin() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <section id="admin-zapatos" className="flex flex-col gap-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Administración
          </h1>
          <p className="mt-2 max-w-[60ch] text-texto-suave">
            Gestiona el catálogo y revisa todas las reservas de la tienda.
          </p>
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Catálogo
        </h2>
        <GestionZapatos />
      </section>

      <section id="admin-reservas" className="flex flex-col gap-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Todas las reservas
        </h2>
        <ListaReservasAdmin />
      </section>
    </main>
  );
}