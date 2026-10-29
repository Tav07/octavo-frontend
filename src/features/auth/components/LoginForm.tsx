// Formulario de inicio de sesión: validación en el cliente, errores del
// backend junto al campo (el 401 de login es un error del formulario,
// mostrado en la línea general, sin redirigir).
"use client";

import { useState, type FormEvent } from "react";
import Button from "@/features/common/components/Button";
import Input from "@/features/common/components/Input";
import { HttpError } from "@/features/common/http";
import { useAuth } from "../hooks/useAuth";
import { validarInicioDeSesion } from "../domain/validacion";

export default function LoginForm() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function actualizarCampo(
    campo: "email" | "password",
    valor: string
  ): void {
    if (campo === "email") setEmail(valor);
    else setPassword(valor);
    setErrores((actuales) => ({ ...actuales, [campo]: "" }));
    setErrorGeneral(null);
  }

  async function alEnviar(evento: FormEvent<HTMLFormElement>): Promise<void> {
    evento.preventDefault();
    const datos = { email, password };
    const faltas = validarInicioDeSesion(datos);
    setErrores(faltas);
    if (Object.keys(faltas).length > 0) return;

    setEnviando(true);
    try {
      await auth.iniciarSesion(datos.email.trim(), datos.password);
      window.location.replace("/");
      // No importa deshacer enviando: la página se va
    } catch (error) {
      setEnviando(false);
      if (error instanceof HttpError) {
        if (error.errors !== undefined) {
          setErrores(error.errors);
        } else {
          // 401 genérico que no dice si falló el email o la contraseña
          setErrorGeneral(error.message);
        }
      } else {
        setErrorGeneral("No se pudo conectar con la API. Inténtalo de nuevo.");
      }
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={alEnviar} noValidate>
      <Input
        id="login-email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => actualizarCampo("email", e.target.value)}
        error={errores.email}
        disabled={enviando}
      />
      <Input
        id="login-password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => actualizarCampo("password", e.target.value)}
        error={errores.password}
        disabled={enviando}
      />

      <p aria-live="polite" className="min-h-5 text-sm text-error">
        {errorGeneral}
      </p>

      <Button type="submit" disabled={enviando}>
        {enviando ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}