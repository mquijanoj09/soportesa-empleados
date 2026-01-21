"use client";

import { Course } from "@/types";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Edit, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";

interface CourseQuestionsProps {
  course: Course;
}

export function CourseQuestions({ course }: CourseQuestionsProps) {
  if (!course.preguntas || course.preguntas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">
            No hay preguntas disponibles
          </h3>
          <p>Este curso no tiene preguntas asociadas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Preguntas del Curso
          </h2>
        </div>
        <span className="text-xs sm:text-sm bg-primary/10 text-primary px-3 py-1 rounded-full w-fit">
          {course.preguntas.length} preguntas
        </span>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {course.preguntas.map((question, index) => (
          <div
            key={question.Id}
            className="border border-border rounded-lg p-4 sm:p-6 bg-card shadow-sm"
          >
            <h3 className="font-semibold mb-3 sm:mb-4 text-foreground text-base sm:text-lg">
              {index + 1}. {question.Pregunta}
            </h3>
            <div className="space-y-3">
              {question.respuestas.map((answer, answerIndex) => (
                <div
                  key={answer.Id}
                  className={`p-3 sm:p-4 rounded-lg border transition-colors ${
                    answer.Ok
                      ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                      : "bg-background border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="font-medium text-muted-foreground min-w-[1.5rem] text-sm sm:text-base">
                      {String.fromCharCode(65 + answerIndex)}.
                    </span>
                    <span
                      className={`flex-1 text-sm sm:text-base ${
                        answer.Ok
                          ? "text-green-700 dark:text-green-300 font-medium"
                          : "text-foreground"
                      }`}
                    >
                      {answer.txtRespuesta || `Opción ${answerIndex + 1}`}
                    </span>
                    {answer.Ok && (
                      <span className="flex items-center gap-1 text-green-700 dark:text-green-300 font-medium text-sm">
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
  );
}
