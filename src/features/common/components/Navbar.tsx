"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const ENLACES = [
  { href: "/", texto: "Inicio" },
  { href: "/#catalogo", texto: "Catálogo" },
  { href: "/#marcas", texto: "Marcas" },
  { href: "/#reserva", texto: "Reserva" },
];

// Navbar según sesión: invitado → "Ingresar"; usuario → su nombre y
// "Salir"; admin → además el enlace "Administración".
export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const { usuario, salir } = useAuth();

  const alCerrarMenu = () => setAbierto(false);

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
                onClick={alCerrarMenu}
              >
                {enlace.texto}
              </Link>
            </li>
          ))}
          {usuario?.role === "admin" && (
            <li>
              <Link
                href="/admin"
                className="font-medium text-naranja transition-colors hover:text-naranja-oscuro"
                onClick={alCerrarMenu}
              >
                Administración
              </Link>
            </li>
          )}
          {usuario !== null && (
            <li className="sm:hidden">
              <span className="font-medium text-tinta">{usuario.nombre}</span>
            </li>
          )}
          {usuario !== null && (
            <li className="sm:hidden">
              <button
                type="button"
                className="font-medium text-tinta transition-colors hover:text-naranja"
                onClick={() => {
                  alCerrarMenu();
                  salir();
                }}
              >
                Salir
              </button>
            </li>
          )}
        </ul>
      </nav>

      {usuario === null ? (
        <Link
          href="/login"
          className="rounded-lg bg-naranja px-4 py-2 text-sm font-semibold text-fondo transition-colors hover:bg-naranja-oscuro"
        >
          Ingresar
        </Link>
      ) : (
        <div className="hidden items-center gap-4 sm:flex">
          <span className="text-sm font-medium text-texto-suave max-w-40 truncate">
            {usuario.nombre}
          </span>
          <button
            type="button"
            onClick={salir}
            className="rounded-lg border border-borde px-4 py-2 text-sm font-semibold text-tinta transition-colors hover:border-naranja"
          >
            Salir
          </button>
        </div>
      )}
    </header>
  );
}