"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { User, LogIn } from "lucide-react";
import { EmployeeDashboard } from "@/components/employee-dashboard";
import { EmployeeCourseIntro } from "@/components/employee-course-intro";
import { EmployeeTest } from "@/components/employee-test";
import { EmployeeTestResults } from "@/components/employee-test-results";
import { Capacitacion, Course, Question } from "@/types";

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

interface TestResult {
  questionId: number;
  selectedAnswerId: number;
  isCorrect: boolean;
}

type ViewState =
  | "login"
  | "dashboard"
  | "course-intro"
  | "test"
  | "test-results";

export default function EmpleadosPage() {
  const [currentView, setCurrentView] = useState<ViewState>("login");
  const [cedula, setCedula] = useState("");
  const [monthExpedition, setMonthExpedition] = useState("");
  const [dayExpedition, setDayExpedition] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Employee data
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [capacitaciones, setCapacitaciones] = useState<{
    pendientes: Capacitacion[];
    realizadas: Capacitacion[];
  }>({
    pendientes: [],
    realizadas: [],
  });

  // Course/Test data
  const [selectedCapacitacion, setSelectedCapacitacion] =
    useState<Capacitacion | null>(null);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testScore, setTestScore] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cedula.trim()) {
      toast.error("Por favor ingrese su cédula");
      return;
    }
    if (!monthExpedition.trim()) {
      toast.error("Por favor ingrese el mes de expedición");
      return;
    }
    if (!dayExpedition.trim()) {
      toast.error("Por favor ingrese el día de expedición");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/empleados?cedula=${encodeURIComponent(
          cedula
        )}&month=${encodeURIComponent(
          monthExpedition
        )}&day=${encodeURIComponent(dayExpedition)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("No se encontró un empleado con esta cédula");
          return;
        }
        throw new Error("Error al buscar empleado");
      }

      const data = await response.json();
      setEmployee(data.employee);
      setCapacitaciones(data.capacitaciones);
      setCurrentView("dashboard");
      toast.success(`¡Bienvenido, ${data.employee.NombreCompleto}!`);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error al iniciar sesión. Por favor intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCapacitacion = async (capacitacion: Capacitacion) => {
    setSelectedCapacitacion(capacitacion);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/cursos?id=${capacitacion.IdCurso}`);

      if (!response.ok) {
        throw new Error("Error al cargar el curso");
      }

      const courseData = await response.json();
      setCurrentCourse(courseData);
      setCurrentView("course-intro");
      toast.success("Curso cargado correctamente");
    } catch (error) {
      console.error("Error loading course:", error);
      toast.error("Error al cargar el curso. Por favor intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTest = () => {
    if (
      !currentCourse ||
      !currentCourse.preguntas ||
      currentCourse.preguntas.length === 0
    ) {
      toast.error("No hay preguntas disponibles para este curso");
      return;
    }
    setCurrentView("test");
  };

  const handleSubmitTest = (
    answers: { questionId: number; answerId: number }[]
  ) => {
    if (!currentCourse || !currentCourse.preguntas) {
      toast.error("Error en los datos del curso");
      return;
    }

    // Calculate results
    const results: TestResult[] = [];
    let correctCount = 0;

    answers.forEach((answer) => {
      const question = currentCourse.preguntas?.find(
        (q) => q.Id === answer.questionId
      );
      if (question) {
        const selectedAnswer = question.respuestas.find(
          (a) => a.Id === answer.answerId
        );
        const isCorrect = selectedAnswer?.Ok || false;

        if (isCorrect) correctCount++;

        results.push({
          questionId: answer.questionId,
          selectedAnswerId: answer.answerId,
          isCorrect,
        });
      }
    });

    const score = Math.round(
      (correctCount / currentCourse.preguntas.length) * 100
    );

    setTestResults(results);
    setTestScore(score);
    setCurrentView("test-results");

    toast.success(`Evaluación completada. Calificación: ${score}%`);
  };

  const handleReturnToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedCapacitacion(null);
    setCurrentCourse(null);
    setTestResults([]);
    setTestScore(0);
  };

  const handleLogout = () => {
    setCurrentView("login");
    setEmployee(null);
    setCapacitaciones({ pendientes: [], realizadas: [] });
    setCedula("");
    setMonthExpedition("");
    setDayExpedition("");
    handleReturnToDashboard();
    toast.info("Sesión cerrada correctamente");
  };

  // Loading spinner overlay
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Login view
  if (currentView === "login") {
    return (
      <div
        className="bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-y-hidden"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-6 text-3xl font-extrabold text-foreground">
              Portal de Empleados
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Accede a tus capacitaciones y evaluaciones
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Iniciar Sesión</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Label htmlFor="cedula">Número de Cédula</Label>
                  <Input
                    id="cedula"
                    type="text"
                    placeholder="Ingrese su número de cédula"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="month">Mes de Expedición</Label>
                    <Input
                      id="month"
                      type="number"
                      placeholder="MM"
                      min="1"
                      max="12"
                      value={monthExpedition}
                      onChange={(e) => setMonthExpedition(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="day">Día de Expedición</Label>
                    <Input
                      id="day"
                      type="number"
                      placeholder="DD"
                      min="1"
                      max="31"
                      value={dayExpedition}
                      onChange={(e) => setDayExpedition(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isLoading ||
                    !cedula.trim() ||
                    !monthExpedition.trim() ||
                    !dayExpedition.trim()
                  }
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {isLoading ? "Verificando..." : "Ingresar"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Ingrese su cédula y la fecha de expedición (mes y día) para
              acceder
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard view
  if (currentView === "dashboard" && employee) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              Portal de Empleados - Soporte SA
            </h1>
            <Button variant="outline" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
        <EmployeeDashboard
          employee={employee}
          capacitaciones={capacitaciones}
          onSelectCapacitacion={handleSelectCapacitacion}
        />
      </div>
    );
  }

  // Course introduction view
  if (currentView === "course-intro" && currentCourse) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              Portal de Empleados - Soporte SA
            </h1>
            <Button variant="outline" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
        <EmployeeCourseIntro
          course={currentCourse}
          onStartTest={handleStartTest}
          onBack={handleReturnToDashboard}
        />
      </div>
    );
  }

  // Test view
  if (currentView === "test" && currentCourse && currentCourse.preguntas) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <h1 className="text-xl font-semibold">
              Portal de Empleados - Soporte SA
            </h1>
          </div>
        </div>
        <EmployeeTest
          questions={currentCourse.preguntas}
          onSubmitTest={handleSubmitTest}
        />
      </div>
    );
  }

  // Test results view
  if (
    currentView === "test-results" &&
    currentCourse &&
    currentCourse.preguntas
  ) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              Portal de Empleados - Soporte SA
            </h1>
            <Button variant="outline" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
        <EmployeeTestResults
          questions={currentCourse.preguntas}
          results={testResults}
          score={testScore}
          onReturnToDashboard={handleReturnToDashboard}
        />
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Cargando aplicación...</p>
      </div>
    </div>
  );
}
