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

const userTypes = [
  {
    title: "Gestión Humana",
    subtitle: "Administradores y RR.HH.",
    description:
      "Acceso completo para gestión de capacitaciones, empleados y administración del sistema",
    icon: "/capacitaciones-icon.svg",
    href: "/gestion-humana",
    features: [
      "Crear y gestionar cursos",
      "Administrar empleados",
      "Ver reportes y estadísticas",
      "Configurar evaluaciones",
    ],
    buttonText: "Acceso Administrativo",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    hoverColor: "hover:bg-green-500/80",
    iconBg: "bg-green-500",
    comingSoon: false,
  },
  {
    title: "Capacitaciones",
    subtitle: "Acceso para personal",
    description:
      "Portal dedicado para empleados con acceso a sus capacitaciones y perfil personal",
    icon: "/tiempo-icon.svg",
    href: "/capacitaciones",
    features: [
      "Ver cursos asignados",
      "Realizar evaluaciones",
      "Seguimiento de progreso",
      "Certificaciones obtenidas",
    ],
    buttonText: "Portal Empleado",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
    hoverColor: "hover:bg-red-500/80",
    iconBg: "bg-red-500",
    comingSoon: false,
  },
  {
    title: "Nómina",
    subtitle: "Gestión de pagos",
    description:
      "Administración de nómina, pagos, deducciones y reportes financieros del personal",
    icon: "/capacitaciones-icon.svg",
    href: "#",
    features: [
      "Procesar nómina mensual",
      "Gestionar deducciones",
      "Reportes de pagos",
      "Historial salarial",
    ],
    buttonText: "Próximamente",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    hoverColor: "hover:bg-blue-500/80",
    iconBg: "bg-blue-500",
    comingSoon: true,
  },
  {
    title: "Tiempo y Asistencia",
    subtitle: "Control de horarios",
    description:
      "Seguimiento de asistencia, registro de horas trabajadas y gestión de permisos",
    icon: "/tiempo-icon.svg",
    href: "#",
    features: [
      "Registro de entradas/salidas",
      "Control de horas extras",
      "Gestión de vacaciones",
      "Reportes de asistencia",
    ],
    buttonText: "Próximamente",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    hoverColor: "hover:bg-purple-500/80",
    iconBg: "bg-purple-500",
    comingSoon: true,
  },
];

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto p-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold text-foreground">
            Sistema de Empleados
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Selecciona tu tipo de acceso para ingresar a la plataforma de
            gestión de recursos humanos
          </p>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* User Type Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {userTypes.map((userType) => (
            <Link
              key={userType.title}
              href={userType.href}
              className={`block ${userType.comingSoon ? "pointer-events-none" : ""}`}
            >
              <Card
                className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${userType.bgColor} ${userType.borderColor} border-2 cursor-pointer h-full ${userType.comingSoon ? "opacity-60 relative overflow-hidden" : ""}`}
              >
                {userType.comingSoon && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md z-10 blur-none">
                    Próximamente
                  </div>
                )}
                <div className={userType.comingSoon ? "blur-[2px]" : ""}>
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-6">
                      <div
                        className={`p-6 rounded-3xl ${userType.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Image
                          src={userType.icon}
                          alt={`${userType.title} Icon`}
                          width={60}
                          height={60}
                          className="filter brightness-0 invert"
                        />
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-bold text-card-foreground mb-2">
                      {userType.title}
                    </CardTitle>
                    <div className="text-sm font-medium text-primary mb-4">
                      {userType.subtitle}
                    </div>
                    <CardDescription className="text-muted-foreground text-base leading-relaxed">
                      {userType.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-card-foreground">
                        Funcionalidades disponibles:
                      </h4>
                      <ul className="space-y-3">
                        {userType.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center text-sm text-muted-foreground"
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${userType.iconBg} mr-3 flex-shrink-0`}
                            ></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
