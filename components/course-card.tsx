"use client";

import type { Course } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Edit, Trash2, Copy, Mail, MailX, Eye } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import CourseQuestions from "./course-questions";
import { useCourse } from "@/app/context/useCourse";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [fullCourseData, setFullCourseData] = useState<Course | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (showDetails) {
      // Disable background scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable background scrolling when modal is closed
      document.body.style.overflow = "auto";
    }
  }, [showDetails]);

  const handleSetShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleViewDetails = async () => {
    setLoadingDetails(true);
    try {
      // Fetch full course details including questions and videos
      const response = await fetch(`/api/cursos?id=${course.Id}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Curso no encontrado");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }
      const fullCourse: Course = await response.json();
      setFullCourseData(fullCourse);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Error al cargar los detalles del curso");
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div>
      <Card className="group min-h-full gap-0 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary flex flex-col">
        <CardHeader className="pb-3 flex-1">
          <CardTitle className="font-playfair text-lg text-primary mb-2 line-clamp-2">
            {course.Nombre}
          </CardTitle>
          <div className="flex flex-col justify-end h-full gap-2 text-sm text-muted-foreground">
            <span className="font-medium">ID: {course.Id}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 mt-auto">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t">
            <Button
              variant="default"
              size="sm"
              onClick={handleViewDetails}
              disabled={loadingDetails}
              className="col-span-2 mb-2"
            >
              {loadingDetails ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Cargando...
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Ver Detalles del Curso
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.error("Funcionalidad en desarrollo");
              }}
              className="flex-1 min-w-0 col-span-2"
            >
              <Mail className="w-3 h-3 mr-1" />
              Email
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.error("Funcionalidad en desarrollo");
              }}
              className="flex-1 min-w-0 col-span-2"
            >
              <MailX className="w-3 h-3 mr-1" />
              No Graduados
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.error("Funcionalidad en desarrollo");
              }}
              className="flex-1 min-w-0"
            >
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                toast.error("Funcionalidad en desarrollo");
              }}
              className="flex-1 min-w-0"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Course Questions */}
      {fullCourseData && (
        <CourseQuestions
          course={fullCourseData}
          showDetails={showDetails}
          setShowDetails={handleSetShowDetails}
        />
      )}
    </div>
  );
}
