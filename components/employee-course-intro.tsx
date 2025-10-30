"use client";

import { Course } from "@/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Play, Clock, BookOpen, Building } from "lucide-react";

interface EmployeeCourseIntroProps {
  course: Course;
  onStartTest: () => void;
  onBack: () => void;
}

export function EmployeeCourseIntro({
  course,
  onStartTest,
  onBack,
}: EmployeeCourseIntroProps) {
  const hasVideo =
    course.InduccionVideo ||
    course.InduccionVideo2 ||
    course.InduccionVideo3 ||
    course.InduccionVideo4;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4">
          ← Volver
        </Button>
        <h1 className="text-3xl font-bold mb-2">{course.Curso}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">
            <Clock className="w-4 h-4 mr-1" />
            {course.Horas} horas
          </Badge>
          <Badge variant="outline">
            <BookOpen className="w-4 h-4 mr-1" />
            {course["Total Preguntas"]} preguntas
          </Badge>
          <Badge variant="outline">
            <Building className="w-4 h-4 mr-1" />
            {course.Entidad}
          </Badge>
          <Badge variant="outline">{course.Modalidad}</Badge>
        </div>
      </div>

      <div className="grid gap-6 mb-8">
        {/* Course Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Ciudad:</span> {course.Ciudad}
              </div>
              <div>
                <span className="font-semibold">Modalidad:</span>{" "}
                {course.Modalidad}
              </div>
              <div>
                <span className="font-semibold">Clasificación:</span>{" "}
                {course.Clasificacion}
              </div>
              <div>
                <span className="font-semibold">Estado:</span> {course.Estado}
              </div>
              <div>
                <span className="font-semibold">Año:</span>{" "}
                {course["Ano Programacion"]}
              </div>
              <div>
                <span className="font-semibold">Mes:</span>{" "}
                {course["Mes Programacion"]}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Description */}
        {course.Texto && (
          <Card>
            <CardHeader>
              <CardTitle>Descripción del Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{course.Texto}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Video Resources */}
        {hasVideo && (
          <Card>
            <CardHeader>
              <CardTitle>Recursos de Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {course.InduccionVideo && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Play className="w-5 h-5 text-primary" />
                      <span>Video de Inducción 1</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(course.InduccionVideo, "_blank")
                      }
                    >
                      Ver Video
                    </Button>
                  </div>
                )}
                {course.InduccionVideo2 && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Play className="w-5 h-5 text-primary" />
                      <span>Video de Inducción 2</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(course.InduccionVideo2, "_blank")
                      }
                    >
                      Ver Video
                    </Button>
                  </div>
                )}
                {course.InduccionVideo3 && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Play className="w-5 h-5 text-primary" />
                      <span>Video de Inducción 3</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(course.InduccionVideo3, "_blank")
                      }
                    >
                      Ver Video
                    </Button>
                  </div>
                )}
                {course.InduccionVideo4 && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Play className="w-5 h-5 text-primary" />
                      <span>Video de Inducción 4</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(course.InduccionVideo4, "_blank")
                      }
                    >
                      Ver Video
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Information */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total de preguntas:</span>
                <Badge variant="outline">
                  {course["Total Preguntas"]} preguntas
                </Badge>
              </div>
              <div className="p-4 bg-muted rounded-lg border">
                <h4 className="font-semibold text-foreground mb-2">
                  Instrucciones:
                </h4>
                <ul className="text-muted-foreground text-sm space-y-1">
                  <li>• Lea cada pregunta cuidadosamente antes de responder</li>
                  <li>
                    • Puede navegar entre preguntas usando los botones de
                    navegación
                  </li>
                  <li>
                    • Debe responder todas las preguntas para completar la
                    evaluación
                  </li>
                  <li>
                    • Una vez enviada la evaluación, no podrá modificar sus
                    respuestas
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button onClick={onStartTest} size="lg">
          <Play className="w-5 h-5 mr-2" />
          Comenzar Evaluación
        </Button>
      </div>
    </div>
  );
}
