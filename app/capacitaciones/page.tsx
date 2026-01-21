"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { LoginForm } from "@/components/login-form";
import { EmployeeDashboard } from "@/components/employee-dashboard";
import { EmployeeCourseIntro } from "@/components/employee-course-intro";
import { EmployeeTest } from "@/components/employee-test";
import { EmployeeTestResults } from "@/components/employee-test-results";
import { EmployeeHeader } from "@/components/employee-header";
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

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem("employeeSession");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setEmployee(session.employee);
        setCapacitaciones(session.capacitaciones);
        setCurrentView("dashboard");
      } catch (error) {
        console.error("Error restoring session:", error);
        localStorage.removeItem("employeeSession");
      }
    }
  }, []);

  // Browser history management
  useEffect(() => {
    const handlePopState = () => {
      // Handle browser back button
      switch (currentView) {
        case "test-results":
        case "test":
        case "course-intro":
          handleReturnToDashboard();
          break;
        case "dashboard":
          handleLogout();
          break;
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentView]);

  useEffect(() => {
    // Push state when view changes (except login)
    if (currentView !== "login") {
      window.history.pushState({ view: currentView }, "");
    }
  }, [currentView]);

  const handleLoginSuccess = (loginData: {
    employee: Employee;
    capacitaciones: { pendientes: Capacitacion[]; realizadas: Capacitacion[] };
  }) => {
    setEmployee(loginData.employee);
    setCapacitaciones(loginData.capacitaciones);

    // Save session to localStorage
    localStorage.setItem(
      "employeeSession",
      JSON.stringify({
        employee: loginData.employee,
        capacitaciones: loginData.capacitaciones,
      })
    );

    setCurrentView("dashboard");
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

  const handleSubmitTest = async (
    answers: { questionId: number; answerId: number }[]
  ) => {
    if (!currentCourse || !currentCourse.preguntas) {
      toast.error("Error en los datos del curso");
      return;
    }

    if (!employee || !selectedCapacitacion) {
      toast.error("Error en los datos del empleado");
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

    // Determine if graduated based on approval percentage
    const requiredPercentage = currentCourse.AplicaEficiencia || 0;
    const graduated = score >= requiredPercentage;

    setTestResults(results);
    setTestScore(score);

    // Update database with test results
    try {
      const response = await fetch("/api/capacitaciones", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idEmpleado: employee.IdEmpleado,
          idCurso: selectedCapacitacion.IdCurso,
          nota: score,
          graduado: graduated,
          buenas: correctCount,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar los resultados");
      }

      // Refresh capacitaciones list to show updated status
      await refreshCapacitaciones();

      setCurrentView("test-results");
      toast.success(
        `Evaluación completada. Calificación: ${score}%${graduated ? " - ¡Aprobado!" : ""}`
      );
    } catch (error) {
      console.error("Error saving test results:", error);
      toast.error(
        "Error al guardar los resultados. Por favor intente nuevamente."
      );
    }
  };

  const refreshCapacitaciones = async () => {
    if (!employee) return;

    try {
      const response = await fetch(
        `/api/capacitaciones?idEmpleado=${employee.IdEmpleado}`
      );

      if (response.ok) {
        const capacitacionesData = await response.json();

        // Transform the flat array into pendientes/realizadas structure
        const pendientes = capacitacionesData.data.filter(
          (c: any) => !c.Realizado && !c.Cancelado
        );
        const realizadas = capacitacionesData.data.filter(
          (c: any) => c.Realizado
        );

        const newCapacitaciones = { pendientes, realizadas };
        setCapacitaciones(newCapacitaciones);

        // Update localStorage
        localStorage.setItem(
          "employeeSession",
          JSON.stringify({
            employee: employee,
            capacitaciones: newCapacitaciones,
          })
        );
      }
    } catch (error) {
      console.error("Error refreshing capacitaciones:", error);
    }
  };

  const handleReturnToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedCapacitacion(null);
    setCurrentCourse(null);
    setTestResults([]);
    setTestScore(0);
  };

  const handleBackFromTest = () => {
    setCurrentView("course-intro");
    setTestResults([]);
    setTestScore(0);
  };

  const handleLogout = () => {
    setEmployee(null);
    setCapacitaciones({ pendientes: [], realizadas: [] });
    setSelectedCapacitacion(null);
    setCurrentCourse(null);
    setTestResults([]);
    setTestScore(0);

    // Clear localStorage
    localStorage.removeItem("employeeSession");

    setCurrentView("login");
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
      <LoginForm
        title="Portal de Empleados"
        subtitle="Accede a tus capacitaciones y evaluaciones"
        apiEndpoint="/api/empleados"
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Dashboard view
  if (currentView === "dashboard" && employee) {
    return (
      <div className="min-h-screen bg-background">
        <EmployeeHeader onLogout={handleLogout} />
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
        <EmployeeHeader
          onBack={handleReturnToDashboard}
          onLogout={handleLogout}
        />
        <EmployeeCourseIntro
          course={currentCourse}
          onStartTest={handleStartTest}
        />
      </div>
    );
  }

  // Test view
  if (currentView === "test" && currentCourse && currentCourse.preguntas) {
    return (
      <div className="min-h-screen bg-background">
        <EmployeeHeader onBack={handleBackFromTest} onLogout={handleLogout} />
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
        <EmployeeHeader
          onBack={handleReturnToDashboard}
          onLogout={handleLogout}
          backLabel="Volver al Dashboard"
        />
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
