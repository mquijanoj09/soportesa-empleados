import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { CourseProvider } from "@/app/context/course-provider";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soporte SA - Sistema de Empleados",
  description: "Sistema integral de gestión de empleados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CourseProvider>
            <header className="flex items-center h-20 border-b border-border bg-primary justify-center">
              <Link
                href="/"
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/logotipo.svg"
                  alt="Soporte SA Logo"
                  width={200}
                  height={40}
                  priority
                />
              </Link>
            </header>

            <main className="flex-1">{children}</main>

            <Toaster />
          </CourseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
