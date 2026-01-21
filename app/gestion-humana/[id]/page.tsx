"use client";

import { Course } from "@/types";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CourseContent } from "@/components/course-content";
import { CourseResults } from "@/components/course-results";
import { CourseQuestions } from "@/components/course-questions";

type TabType = "curso" | "preguntas" | "resultados";

export default function CourseDetailsPage() {
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("curso");
  const params = useParams();
  const router = useRouter();

  const tabs = [
    { id: "curso" as TabType, label: "Curso", count: null },
    {
      id: "preguntas" as TabType,
      label: "Preguntas",
      count: course?.preguntas?.length || 0,
    },
    { id: "resultados" as TabType, label: "Resultados", count: null },
  ];

  const handleViewDetails = async () => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`/api/cursos?id=${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Curso no encontrado");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }
      const course: Course = await response.json();
      setCourse(course);
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Error al cargar los detalles del curso");
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    handleViewDetails();
  }, [params.id]);

  const renderTabContent = () => {
    if (!course) return null;

    switch (activeTab) {
      case "curso":
        return <CourseContent course={course} />;
      case "preguntas":
        return <CourseQuestions course={course} />;
      case "resultados":
        return <CourseResults course={course} />;
      default:
        return <CourseContent course={course} />;
    }
  };

  if (loadingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">
            Curso no encontrado
          </h1>
          <p className="text-muted-foreground">
            El curso que buscas no existe o ha sido eliminado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/gestion-humana")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground h-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver a Capacitaciones</span>
          </Button>
        </div>

        {/* Course Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            {course.Nombre || course.Curso}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Detalles del curso y recursos de aprendizaje
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center justify-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 w-full
                  ${
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm border border-border/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }
                `}
              >
                <span className="text-xs sm:text-sm font-medium">
                  {tab.label}
                </span>
                {tab.count !== null && tab.count > 0 && (
                  <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-full text-xs font-medium">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-card rounded-lg border border-border shadow-sm">
          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
