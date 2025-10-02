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

export default function TiempoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center space-y-6 mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-3xl bg-primary shadow-lg">
              <Image
                src="/tiempo-icon.svg"
                alt="Tiempo Icon"
                width={80}
                height={80}
                className="filter brightness-0 invert"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Gestión de Tiempo
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Control de asistencia, horarios y seguimiento de tiempo de trabajo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                Control de Asistencia
              </CardTitle>
              <CardDescription>Registro de entrada y salida</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Marcar Entrada/Salida
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Horarios</CardTitle>
              <CardDescription>Gestión de horarios de trabajo</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full hover:bg-accent">
                Ver Horarios
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Reportes</CardTitle>
              <CardDescription>Informes de tiempo trabajado</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full hover:bg-accent">
                Generar Reporte
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
