"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/features/auth/components/LoginForm";
import { useAuth } from "@/features/auth/hooks/useAuth";

// Página de login. Con sesión activa no se muestra: redirige a /.
export default function LoginPagina() {
  const router = useRouter();
  const { usuario, listo } = useAuth();

  useEffect(() => {
    if (listo && usuario !== null) router.replace("/");
  }, [listo, usuario, router]);

  if (listo && usuario !== null) return null;

  return (
    <main className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16 sm:py-24">
      <section className="rounded-2xl border border-borde bg-fondo p-8 shadow-sm">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Ingresar
        </h1>
        <p className="mt-2 text-texto-suave">
          Ingresa con tu cuenta para reservar y ver tus pedidos.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </section>
      <p className="text-center text-texto-suave">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-naranja hover:underline">
          Regístrate
        </Link>
      </p>
    </main>
  );
}