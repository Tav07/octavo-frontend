// Formulario de registro: validación en el cliente; los errores del
// backend (ej.: 409 email ya registrado) se muestran junto al campo.
// Al registrarse, la página invita a iniciar sesión (no auto-login).
"use client";

import { useState, type FormEvent } from "react";
import Button from "@/features/common/components/Button";
import Input from "@/features/common/components/Input";
import { HttpError } from "@/features/common/http";
import { useAuth } from "../hooks/useAuth";
import { validarRegistro } from "../domain/validacion";

export default function RegisterForm() {
  const auth = useAuth();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [registrado, setRegistrado] = useState(false);

  function actualizarCampo(
    campo: "nombre" | "email" | "password",
    valor: string
  ): void {
    setErrores((actuales) => ({ ...actuales, [campo]: "" }));
    setErrorGeneral(null);
    if (campo === "nombre") setNombre(valor);
    else if (campo === "email") setEmail(valor);
    else setPassword(valor);
  }

  async function alEnviar(evento: FormEvent<HTMLFormElement>): Promise<void> {
    evento.preventDefault();
    const datos = { nombre, email, password };
    const faltas = validarRegistro(datos);
    setErrores(faltas);
    if (Object.keys(faltas).length > 0) return;

    setEnviando(true);
    try {
      await auth.registrar(datos.nombre.trim(), datos.email.trim(), datos.password);
      setRegistrado(true);
    } catch (error) {
      setEnviando(false);
      if (error instanceof HttpError) {
        if (error.errors !== undefined) {
          // Ej.: 409 → { email: "Ese email ya está registrado" }
          setErrores(error.errors);
        } else {
          setErrorGeneral(error.message);
        }
      } else {
        setErrorGeneral("No se pudo conectar con la API. Inténtalo de nuevo.");
      }
    }
  }

  if (registrado) {
    return (
      <div className="rounded-xl bg-gris-suave p-8 text-center">
        <p className="font-semibold text-exito">
          ¡Cuenta creada! Ahora inicia sesión con tus datos.
        </p>
        <a
          href="/login"
          className="mt-4 inline-block rounded-lg bg-naranja px-7 py-3 font-semibold text-fondo transition-colors hover:bg-naranja-oscuro"
        >
          Ingresar
        </a>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={alEnviar} noValidate>
      <Input
        id="registro-nombre"
        label="Nombre completo"
        type="text"
        autoComplete="name"
        value={nombre}
        onChange={(e) => actualizarCampo("nombre", e.target.value)}
        error={errores.nombre}
        disabled={enviando}
      />
      <Input
        id="registro-email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => actualizarCampo("email", e.target.value)}
        error={errores.email}
        disabled={enviando}
      />
      <Input
        id="registro-password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => actualizarCampo("password", e.target.value)}
        error={errores.password}
        disabled={enviando}
      />

      <p aria-live="polite" className="min-h-5 text-sm text-error">
        {errorGeneral}
      </p>

      <Button type="submit" disabled={enviando}>
        {enviando ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
    </form>
  );
}