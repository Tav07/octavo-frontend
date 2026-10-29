"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PanelAdmin from "@/features/admin/components/PanelAdmin";
import { useAuth } from "@/features/auth/hooks/useAuth";

// Página protegida por rol: el admin llega directo; un usuario sin sesión
// va a /login y un user autenticado vuelve a /. Mientras la sesión
// rehidrata no se renderiza nada (sin desajuste de hidratación).
export default function AdminPagina() {
  const router = useRouter();
  const { usuario, listo } = useAuth();

  const permitido = listo && usuario !== null && usuario.role === "admin";

  useEffect(() => {
    if (!listo) return;
    if (usuario === null) {
      router.replace("/login");
    } else if (usuario.role !== "admin") {
      router.replace("/");
    }
  }, [listo, usuario, router]);

  if (!permitido) return null;

  return <PanelAdmin />;
}