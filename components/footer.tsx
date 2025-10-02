"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <Image
              src="/logo.svg"
              alt="Soportesa Logo"
              width={120}
              height={40}
            />
            <p className="text-muted-foreground text-sm">
              Sistema integral de gestión de empleados para una administración
              eficiente de recursos humanos.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Módulos</h3>
            <div className="space-y-2">
              <Link
                href="/tiempo"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Gestión de Tiempo
              </Link>
              <Link
                href="/nomina"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Nómina
              </Link>
              <Link
                href="/capacitaciones"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Capacitaciones
              </Link>
            </div>
          </div>

          {/* Soporte */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Soporte</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">¿Necesitas ayuda?</p>
              <Button variant="outline" size="sm" className="w-fit">
                Contactar Soporte
              </Button>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contacto</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: soporte@soportesa.com</p>
              <p>Teléfono: +57 (1) 234-5678</p>
              <p>Horario: Lun - Vie, 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2025 Soportesa. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 text-sm">
              <Link
                href="/privacidad"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link
                href="/terminos"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
