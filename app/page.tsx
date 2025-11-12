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
    href: "/capacitaciones",
    features: [
      "Crear y gestionar cursos",
      "Administrar empleados",
      "Ver reportes y estadísticas",
      "Configurar evaluaciones",
    ],
    buttonText: "Acceso Administrativo",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-500",
  },
  {
    title: "Empleados",
    subtitle: "Acceso para personal",
    description:
      "Portal dedicado para empleados con acceso a sus capacitaciones y perfil personal",
    icon: "/tiempo-icon.svg", // We'll reuse this icon or you can change it
    href: "/empleados",
    features: [
      "Ver cursos asignados",
      "Realizar evaluaciones",
      "Seguimiento de progreso",
      "Certificaciones obtenidas",
    ],
    buttonText: "Portal Empleado",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    iconBg: "bg-green-500",
  },
];

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-6 py-12">
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
            <Card
              key={userType.title}
              className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${userType.bgColor} ${userType.borderColor} border-2`}
            >
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
                <Link href={userType.href} className="block">
                  <Button
                    className={`w-full ${userType.iconBg} hover:opacity-90 text-white font-semibold py-4 text-lg`}
                    size="lg"
                  >
                    {userType.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Access Instructions */}
        <div className="bg-card rounded-3xl shadow-lg p-8 mb-12 border border-border max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              ¿No sabes cuál elegir?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Si eres del área de Recursos Humanos
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Usa <strong>Gestión Humana</strong> para administrar
                  empleados, crear cursos y ver reportes
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Si eres empleado de la empresa
                </h4>
                <p className="text-sm text-green-700 dark:text-green-200">
                  Usa <strong>Portal Empleado</strong> para acceder a tus cursos
                  y ver tu progreso
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Contact */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-foreground">
            ¿Necesitas ayuda o tienes problemas de acceso?
          </h2>
          <p className="text-muted-foreground">
            Contacta al equipo de soporte técnico para recibir asistencia
          </p>
          <Button variant="outline" size="lg" className="hover:bg-accent">
            Contactar Soporte
          </Button>
        </div>
      </div>
    </div>
  );
}
