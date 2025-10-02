"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function NominaPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center space-y-6 mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-3xl bg-primary shadow-lg">
              <Image
                src="/nomina-icon.svg"
                alt="Nómina Icon"
                width={80}
                height={80}
                className="filter brightness-0 invert"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Gestión de Nómina
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Administración de salarios, deducciones y pagos de empleados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Cálculo de Nómina
              </CardTitle>
              <CardDescription>Procesamiento de salarios</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Calcular Nómina
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Deducciones
              </CardTitle>
              <CardDescription>Gestión de descuentos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full hover:bg-accent">
                Ver Deducciones
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Reportes Fiscales
              </CardTitle>
              <CardDescription>Informes para autoridades</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full hover:bg-accent">
                Generar Reportes
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/">
            <Button variant="ghost" className="hover:bg-accent">
              ← Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
