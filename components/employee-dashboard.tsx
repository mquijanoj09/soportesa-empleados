"use client";

import { useState } from "react";
import { Capacitacion } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Clock, BookOpen, CheckCircle, Calendar } from "lucide-react";

interface Employee {
  IdEmpleado: number;
  "Primer Nombre": string;
  "Segundo Nombre": string;
  "Primer Apellido": string;
  "Segundo Apellido": string;
  Cedula: string;
  NombreCompleto: string;
  "Lugar actual": string;
}

interface EmployeeDashboardProps {
  employee: Employee;
  capacitaciones: {
    pendientes: Capacitacion[];
    realizadas: Capacitacion[];
  };
  onSelectCapacitacion: (capacitacion: Capacitacion) => void;
}

export function EmployeeDashboard({
  employee,
  capacitaciones,
  onSelectCapacitacion,
}: EmployeeDashboardProps) {
  const [activeTab, setActiveTab] = useState<"pendientes" | "realizadas">(
    "pendientes"
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (capacitacion: Capacitacion) => {
    if (capacitacion.Graduado) {
      return <Badge className="bg-green-600">Graduado</Badge>;
    }
    if (capacitacion.Realizado) {
      return <Badge className="bg-blue-600">Completado</Badge>;
    }
    if (capacitacion.Cancelado) {
      return <Badge variant="destructive">Cancelado</Badge>;
    }
    return <Badge variant="outline">Pendiente</Badge>;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-muted p-4 rounded-lg border">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            ¡Bienvenido, {employee.NombreCompleto}!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold">Cédula:</span> {employee.Cedula}
            </div>
            <div>
              <span className="font-semibold">Ubicación:</span>{" "}
              {employee["Lugar actual"]}
            </div>
            <div>
              <span className="font-semibold">Capacitaciones:</span>{" "}
              {capacitaciones.pendientes.length} pendientes,{" "}
              {capacitaciones.realizadas.length} realizadas
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Capacitaciones Pendientes
                </p>
                <p className="text-2xl font-bold text-destructive">
                  {capacitaciones.pendientes.length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Capacitaciones Realizadas
                </p>
                <p className="text-2xl font-bold text-primary">
                  {capacitaciones.realizadas.length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Graduados
                </p>
                <p className="text-2xl font-bold text-secondary-foreground">
                  {capacitaciones.realizadas.filter((c) => c.Graduado).length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-secondary-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8 pb-5">
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "pendientes"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            }`}
            onClick={() => setActiveTab("pendientes")}
          >
            Capacitaciones Pendientes ({capacitaciones.pendientes.length})
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "realizadas"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            }`}
            onClick={() => setActiveTab("realizadas")}
          >
            Capacitaciones Realizadas ({capacitaciones.realizadas.length})
          </button>
        </nav>
      </div>

      {/* Capacitaciones List */}
      <div className="space-y-4">
        {activeTab === "pendientes" && (
          <>
            {capacitaciones.pendientes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay capacitaciones pendientes
                  </h3>
                  <p className="text-muted-foreground">
                    ¡Excelente! Has completado todas tus capacitaciones
                    asignadas.
                  </p>
                </CardContent>
              </Card>
            ) : (
              capacitaciones.pendientes.map((capacitacion) => (
                <Card
                  key={capacitacion.Id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-2">
                          {capacitacion.Curso}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {getStatusBadge(capacitacion)}
                          <Badge variant="outline">
                            <Calendar className="w-3 h-3 mr-1" />
                            {capacitacion["Ano Programacion"]} -{" "}
                            {capacitacion["Mes Programacion"]}
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {capacitacion["Horas Programadas"]} horas
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => onSelectCapacitacion(capacitacion)}
                      >
                        Iniciar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-semibold">Entidad:</span>{" "}
                        {capacitacion["Entidad Educativa"]}
                      </div>
                      <div>
                        <span className="font-semibold">Modalidad:</span>{" "}
                        {capacitacion.Modalidad}
                      </div>
                      <div>
                        <span className="font-semibold">Clasificación:</span>{" "}
                        {capacitacion.clasificacion}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}

        {activeTab === "realizadas" && (
          <>
            {capacitaciones.realizadas.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay capacitaciones realizadas
                  </h3>
                  <p className="text-muted-foreground">
                    Una vez que completes tus capacitaciones, aparecerán aquí.
                  </p>
                </CardContent>
              </Card>
            ) : (
              capacitaciones.realizadas.map((capacitacion) => (
                <Card
                  key={capacitacion.Id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-2">
                          {capacitacion.Curso}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {getStatusBadge(capacitacion)}
                          <Badge variant="outline">
                            <Calendar className="w-3 h-3 mr-1" />
                            Completado:{" "}
                            {formatDate(capacitacion["Fecha de terminacion"])}
                          </Badge>
                          {capacitacion.Nota > 0 && (
                            <Badge
                              variant={
                                capacitacion.Nota >= 80
                                  ? "default"
                                  : capacitacion.Nota >= 60
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              Nota: {capacitacion.Nota}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-semibold">Entidad:</span>{" "}
                        {capacitacion["Entidad Educativa"]}
                      </div>
                      <div>
                        <span className="font-semibold">Modalidad:</span>{" "}
                        {capacitacion.Modalidad}
                      </div>
                      <div>
                        <span className="font-semibold">Horas:</span>{" "}
                        {capacitacion["Horas Programadas"]}h
                      </div>
                      {capacitacion.Buenas > 0 && (
                        <div>
                          <span className="font-semibold">
                            Respuestas correctas:
                          </span>{" "}
                          {capacitacion.Buenas}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
