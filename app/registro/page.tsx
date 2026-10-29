"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { useAuth } from "@/features/auth/hooks/useAuth";

// Página de registro. Con sesión activa no se muestra: redirige a /.
export default function RegistroPagina() {
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
          Crear cuenta
        </h1>
        <p className="mt-2 text-texto-suave">
          Regístrate para reservar los zapatos que te interesen.
        </p>
        <div className="mt-8">
          <RegisterForm />
        </div>
      </section>
      <p className="text-center text-texto-suave">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-naranja hover:underline">
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}