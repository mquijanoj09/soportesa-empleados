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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    preguntas: course.preguntas || [],
  });

  const handleEditSubmit = () => {
    // TODO: Implement actual edit functionality
    toast.success(
      "Preguntas del curso actualizadas (funcionalidad en desarrollo)"
    );
    setIsEditOpen(false);
  };

  const addQuestion = () => {
    const newQuestion = {
      Id: Date.now(), // Temporary ID
      Pregunta: "",
      tipo: 1,
      respuestas: [
        { Id: Date.now() + 1, txtRespuesta: "", Ok: true },
        { Id: Date.now() + 2, txtRespuesta: "", Ok: false },
        { Id: Date.now() + 3, txtRespuesta: "", Ok: false },
        { Id: Date.now() + 4, txtRespuesta: "", Ok: false },
      ],
    };
    setEditForm({
      ...editForm,
      preguntas: [...editForm.preguntas, newQuestion],
    });
  };

  const removeQuestion = (questionIndex: number) => {
    const updatedQuestions = editForm.preguntas.filter(
      (_, index) => index !== questionIndex
    );
    setEditForm({ ...editForm, preguntas: updatedQuestions });
  };

  const updateQuestion = (
    questionIndex: number,
    field: string,
    value: string
  ) => {
    const updatedQuestions = [...editForm.preguntas];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value,
    };
    setEditForm({ ...editForm, preguntas: updatedQuestions });
  };

  const updateAnswer = (
    questionIndex: number,
    answerIndex: number,
    field: string,
    value: string | boolean
  ) => {
    const updatedQuestions = [...editForm.preguntas];
    updatedQuestions[questionIndex].respuestas[answerIndex] = {
      ...updatedQuestions[questionIndex].respuestas[answerIndex],
      [field]: value,
    };
    setEditForm({ ...editForm, preguntas: updatedQuestions });
  };

  const setCorrectAnswer = (
    questionIndex: number,
    correctAnswerIndex: number
  ) => {
    const updatedQuestions = [...editForm.preguntas];
    updatedQuestions[questionIndex].respuestas.forEach((answer, index) => {
      answer.Ok = index === correctAnswerIndex;
    });
    setEditForm({ ...editForm, preguntas: updatedQuestions });
  };
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="h-7 w-7 p-0 hover:bg-primary/10"
          >
            <Edit className="w-3 h-3 text-primary" />
          </Button>
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

      {/* Edit Questions Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Preguntas del Curso</DialogTitle>
            <DialogDescription>
              Modifica las preguntas y respuestas del curso. Marca la respuesta
              correcta para cada pregunta.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {editForm.preguntas.map((question, questionIndex) => (
              <div
                key={question.Id}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`question-${questionIndex}`}>
                      Pregunta {questionIndex + 1}
                    </Label>
                    <Input
                      id={`question-${questionIndex}`}
                      value={question.Pregunta}
                      onChange={(e) =>
                        updateQuestion(
                          questionIndex,
                          "Pregunta",
                          e.target.value
                        )
                      }
                      placeholder="Ingresa la pregunta..."
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Respuestas</Label>
                  {question.respuestas.map((answer, answerIndex) => (
                    <div key={answer.Id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${questionIndex}`}
                        checked={answer.Ok}
                        onChange={() =>
                          setCorrectAnswer(questionIndex, answerIndex)
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span className="min-w-[1.5rem] text-sm font-medium">
                        {String.fromCharCode(65 + answerIndex)}.
                      </span>
                      <Input
                        value={answer.txtRespuesta}
                        onChange={(e) =>
                          updateAnswer(
                            questionIndex,
                            answerIndex,
                            "txtRespuesta",
                            e.target.value
                          )
                        }
                        placeholder={`Respuesta ${String.fromCharCode(
                          65 + answerIndex
                        )}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addQuestion}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Pregunta
            </Button>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleEditSubmit}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
