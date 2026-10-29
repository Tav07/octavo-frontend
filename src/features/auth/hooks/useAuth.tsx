// Contexto de sesión (fase 8): el usuario activo se comparte entre el
// Navbar y las páginas. Persiste en localStorage (ver sesion.ts) y se
// rehidrata al cargar, así sobrevive al refrescar.
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  guardarSesion,
  leerUsuario,
  limpiarSesion,
  type UsuarioSesion,
} from "../domain/sesion";
import { iniciarSesion, registrar } from "../services/auth";

interface ContextoAuth {
  usuario: UsuarioSesion | null;
  // false mientras rehidrata del localStorage: las pantallas protegidas
  // esperan este valor antes de decidir si redirigen a /login.
  listo: boolean;
  iniciarSesion(email: string, password: string): Promise<void>;
  registrar(nombre: string, email: string, password: string): Promise<void>;
  salir: () => void;
}

const CONTEXTO = createContext<ContextoAuth | null>(null);

export function ProveedorAuth({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [listo, setListo] = useState(false);

  // Rehidratación de la sesión. La lectura se hace en una microtask para
  // no llamar setState de forma síncrona dentro del effect (React 19).
  useEffect(() => {
    let vigente = true;
    void Promise.resolve().then(() => {
      if (!vigente) return;
      setUsuario(leerUsuario());
      setListo(true);
    });
    return () => {
      vigente = false;
    };
  }, []);

  async function iniciar(email: string, password: string): Promise<void> {
    const { token, usuario: activo } = await iniciarSesion({ email, password });
    guardarSesion(token, activo);
    setUsuario(activo);
    setListo(true);
  }

  // El registro NO inicia sesión (el backend devuelve el usuario sin token):
  // quien se registra pasa por /login con sus nuevas credenciales.
  async function registrarUsuario(nombre: string, email: string, password: string): Promise<void> {
    await registrar({ nombre, email, password });
  }

  function salir(): void {
    limpiarSesion();
    setUsuario(null);
  }

  return (
    <CONTEXTO.Provider
      value={{ usuario, listo, iniciarSesion: iniciar, registrar: registrarUsuario, salir }}
    >
      {children}
    </CONTEXTO.Provider>
  );
}

export function useAuth(): ContextoAuth {
  const contexto = useContext(CONTEXTO);
  if (contexto === null) {
    throw new Error("useAuth debe usarse dentro de ProveedorAuth");
  }
  return contexto;
}