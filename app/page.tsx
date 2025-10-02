"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const modules = [
  {
    title: "Tiempo",
    description:
      "Gestión de horarios, asistencia y control de tiempos de trabajo",
    icon: "/tiempo-icon.svg",
    href: "https://www.sdigitales.com/Soporte/Tiempo",
    features: [
      "Control de asistencia",
      "Horarios flexibles",
      "Reportes de tiempo",
    ],
  },
  {
    title: "Nómina",
    description: "Administración de salarios, deducciones y pagos de empleados",
    icon: "/nomina-icon.svg",
    href: "http://www.sdigitales.com/Soporte/Nomina/Nomina.php",
    features: ["Cálculo de nómina", "Deducciones", "Reportes fiscales"],
  },
  {
    title: "Capacitaciones",
    description: "Programas de formación y desarrollo profesional continuo",
    icon: "/capacitaciones-icon.svg",
    href: "/capacitaciones",
    features: ["Cursos online", "Certificaciones", "Seguimiento de progreso"],
  },
];

export default function HomePage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold text-foreground">
            Sistema de Empleados
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plataforma integral para la gestión eficiente de recursos humanos y
            administración de personal
          </p>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {modules.map((module) => (
            <Card
              key={module.title}
              className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 bg-card border-border"
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-2xl bg-primary shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={module.icon}
                      alt={`${module.title} Icon`}
                      width={80}
                      height={80}
                      className="filter brightness-0 invert"
                    />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-card-foreground">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-2">
                  {module.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-muted-foreground"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={module.href} className="block">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 cursor-pointer text-primary-foreground"
                    size="lg"
                  >
                    Acceder a {module.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-3xl shadow-lg p-8 mb-12 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Acceso disponible</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-muted-foreground">Seguro y confiable</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">∞</div>
              <div className="text-muted-foreground">
                Capacidades ilimitadas
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            ¿Necesitas ayuda?
          </h2>
          <p className="text-muted-foreground">
            Nuestro equipo de soporte está disponible para asistirte
          </p>
          <Button variant="outline" size="lg" className="hover:bg-accent">
            Contactar Soporte
          </Button>
        </div>
      </div>
    </div>
  );
}
