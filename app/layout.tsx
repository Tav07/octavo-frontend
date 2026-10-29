import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import { ProveedorAuth } from "@/features/auth/hooks/useAuth";
import Navbar from "@/features/common/components/Navbar";
import Footer from "@/features/common/components/Footer";
import "./globals.css";

// Texto (Inter) y títulos (Syne), como en la Entrega 1.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "Octavo Zapatos | Calzado original a precio exclusivo",
  description:
    "Octavo Zapatos: calzado original importado a precios exclusivos. Running, casual y formal. Reserva tu par en línea.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${syne.variable}`}>
      <body className="font-sans">
        <ProveedorAuth>
          <Navbar />
          {children}
          <Footer />
        </ProveedorAuth>
      </body>
    </html>
  );
}