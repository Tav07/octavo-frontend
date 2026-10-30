"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCarrito } from "@/features/carrito/hooks/useCarrito";

const ENLACES = [
  { href: "/", texto: "Inicio" },
  { href: "/catalogo", texto: "Catálogo" },
  { href: "/#marcas", texto: "Marcas" },
];

// Navbar según sesión: invitado → "Ingresar"; usuario → su nombre y
// "Salir"; admin → además el enlace "Administración".
export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const { usuario, salir } = useAuth();
  const { items, listo } = useCarrito();

  // Pares en el carrito (0 hasta rehidratar, para no desajustar el HTML)
  const pares = listo ? items.reduce((total, item) => total + item.cantidad, 0) : 0;

  const alCerrarMenu = () => setAbierto(false);

  return (
    <header className="relative z-10 flex items-center justify-between gap-4 border-b border-borde bg-fondo px-4 py-4 sm:gap-8 sm:px-6 lg:px-12">
      <Link href="/" className="font-display text-lg font-extrabold text-tinta sm:text-xl">
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
          {usuario === null && (
            <li className="sm:hidden">
              <Link
                href="/login"
                className="font-semibold text-naranja"
                onClick={alCerrarMenu}
              >
                Ingresar
              </Link>
            </li>
          )}
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

      {/* Acciones: carrito con contador + sesión */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/carrito"
          aria-label={`Carrito${pares > 0 ? `: ${pares} ${pares === 1 ? "par" : "pares"}`: " vacío"}`}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-borde px-2.5 py-2 text-sm font-semibold text-tinta transition-colors hover:border-naranja sm:px-3.5"
        >
          {/* Bolsa: ícono compacto en móvil, con texto desde sm */}
          <svg
            aria-hidden="true"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M6 7h12l1 13H5L6 7Z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          <span className="hidden sm:inline">Carrito</span>
          {listo && pares > 0 && (
            <span
              className="rounded-full bg-naranja px-1.5 pb-0.5 text-xs font-bold tabular-nums text-fondo"
            >
              {pares}
            </span>
          )}
        </Link>

        {usuario === null ? (
          <Link
            href="/login"
            className="hidden rounded-lg bg-naranja px-4 py-2 text-sm font-semibold text-fondo transition-colors hover:bg-naranja-oscuro sm:block"
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
      </div>
    </header>
  );
}