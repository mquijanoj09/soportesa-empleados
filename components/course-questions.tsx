import { Course } from "@/types";
import React from "react";
import { Button } from "./ui/button";
import { X, ExternalLink } from "lucide-react";

interface Props {
  course: Course;
  showDetails: boolean;
  setShowDetails: () => void;
}

export default function CourseQuestions({
  course,
  showDetails,
  setShowDetails,
}: Props) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowDetails();
    }
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails();
  };

  console.log("Rendering CourseQuestions for course:", course);

  return (
    <div>
      {/* Course Details Modal */}
      {showDetails && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
        >
          <div
            className="bg-background rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-start">
              <h2 className="text-2xl font-bold text-primary">
                {course.Nombre}
              </h2>
              <Button
                onClick={handleCloseClick}
                variant="ghost"
                size="sm"
                className="hover:bg-muted p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    Descripción
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {course.Texto}
                  </p>
                </div>

                {/* Video Links */}
                {(course.InduccionVideo ||
                  course.InduccionVideo2 ||
                  course.InduccionVideo3 ||
                  course.InduccionVideo4) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                      Recursos de Inducción
                    </h3>
                    <div className="grid gap-3">
                      {course.InduccionVideo && (
                        <a
                          href={course.InduccionVideo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg text-primary hover:bg-muted transition-colors group"
                        >
                          <span className="text-xl">📹</span>
                          <span className="font-medium flex-1">
                            Recurso de Inducción 1
                          </span>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}
                      {course.InduccionVideo2 && (
                        <a
                          href={course.InduccionVideo2}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg text-primary hover:bg-muted transition-colors group"
                        >
                          <span className="text-xl">📹</span>
                          <span className="font-medium flex-1">
                            Recurso de Inducción 2
                          </span>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}
                      {course.InduccionVideo3 && (
                        <a
                          href={course.InduccionVideo3}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg text-primary hover:bg-muted transition-colors group"
                        >
                          <span className="text-xl">📹</span>
                          <span className="font-medium flex-1">
                            Recurso de Inducción 3
                          </span>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}
                      {course.InduccionVideo4 && (
                        <a
                          href={course.InduccionVideo4}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg text-primary hover:bg-muted transition-colors group"
                        >
                          <span className="text-xl">📹</span>
                          <span className="font-medium flex-1">
                            Recurso de Inducción 4
                          </span>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Questions */}
                {course.preguntas && course.preguntas.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground">
                      Preguntas del Curso ({course.preguntas.length})
                    </h3>
                    <div className="space-y-6">
                      {course.preguntas.map((question, index) => (
                        <div
                          key={question.Id}
                          className="border border-border rounded-lg p-5 bg-muted"
                        >
                          <h4 className="font-semibold mb-4 text-foreground text-base">
                            {index + 1}. {question.Pregunta}
                          </h4>
                          <div className="space-y-3">
                            {question.respuestas.map((answer, answerIndex) => (
                              <div
                                key={answer.Id}
                                className={`p-3 rounded-lg border transition-colors ${
                                  answer.Ok
                                    ? "bg-success-foreground border-success"
                                    : "bg-background border-border"
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="font-medium text-muted-foreground min-w-[1.5rem]">
                                    {String.fromCharCode(65 + answerIndex)}.
                                  </span>
                                  <span
                                    className={`flex-1 ${
                                      answer.Ok
                                        ? "text-success font-medium"
                                        : "text-foreground"
                                    }`}
                                  >
                                    {answer.txtRespuesta ||
                                      `Opción ${answerIndex + 1}`}
                                  </span>
                                  {answer.Ok && (
                                    <span className="flex items-center gap-1 text-success font-medium text-sm">
                                      <span className="text-base">✓</span>
                                      Correcta
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
