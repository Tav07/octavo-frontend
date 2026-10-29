"use client";

import Link from "next/link";
import { useState } from "react";

const ENLACES = [
  { href: "/", texto: "Inicio" },
  { href: "/#catalogo", texto: "Catálogo" },
  { href: "/#marcas", texto: "Marcas" },
  { href: "/#reserva", texto: "Reserva" },
];

// Estado de la fase 3: invitado con "Ingresar".
// En la fase 8 (sesión) el enlace se convierte en nombre + Salir,
// y en Administración para el rol admin.
export default function Navbar() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="relative z-10 flex items-center justify-between gap-8 border-b border-borde bg-fondo px-4 py-4 sm:px-6 lg:px-12">
      <Link href="/" className="font-display text-xl font-extrabold text-tinta">
        Octavo<span className="text-naranja">Zapatos</span>
      </Link>

      <button
        type="button"
        aria-expanded={abierto}
        aria-label="Abrir menú de navegación"
        className="flex flex-col gap-1.5 px-1 py-2 sm:hidden"
        onClick={() => setAbierto((v) => !v)}
      >
        <span className="h-0.5 w-6 bg-tinta" />
        <span className="h-0.5 w-6 bg-tinta" />
        <span className="h-0.5 w-6 bg-tinta" />
      </button>

      <nav
        aria-label="Navegación principal"
        className={
          abierto
            ? "absolute top-full right-0 left-0 border-b border-borde bg-fondo px-4 py-4 sm:static sm:border-none sm:px-0 sm:py-0"
            : "absolute top-full right-0 left-0 hidden bg-fondo sm:static sm:block sm:bg-none"
        }
      >
        <ul className="flex flex-col gap-4 sm:flex-row sm:gap-7">
          {ENLACES.map((enlace) => (
            <li key={enlace.href}>
              <Link
                href={enlace.href}
                className="font-medium text-tinta transition-colors hover:text-naranja"
                onClick={() => setAbierto(false)}
              >
                {enlace.texto}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link
        href="/login"
        className="hidden rounded-lg bg-naranja px-4 py-2 text-sm font-semibold text-fondo transition-colors hover:bg-naranja-oscuro sm:block"
      >
        Ingresar
      </Link>
    </header>
  );
}