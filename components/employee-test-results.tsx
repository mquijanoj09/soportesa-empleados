"use client";

import { Question } from "@/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface TestResult {
  questionId: number;
  selectedAnswerId: number;
  isCorrect: boolean;
}

interface EmployeeTestResultsProps {
  questions: Question[];
  results: TestResult[];
  score: number;
  onReturnToDashboard: () => void;
}

export function EmployeeTestResults({
  questions,
  results,
  score,
  onReturnToDashboard,
}: EmployeeTestResultsProps) {
  const totalQuestions = questions.length;
  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-secondary-foreground";
    return "text-destructive";
  };

  const getScoreBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return "outline";
    if (percentage >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">¡Evaluación Completada!</h1>
        <div className="flex items-center justify-center space-x-6 mb-6">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            <div className="text-sm text-gray-600">Calificación</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-sm text-muted-foreground">
              Respuestas Correctas
            </div>
          </div>
        </div>
        <Badge
          variant={getScoreBadgeVariant(percentage)}
          className="text-lg px-4 py-2"
        >
          {percentage >= 80
            ? "¡Excelente!"
            : percentage >= 60
            ? "Aprobado"
            : "Necesita Mejorar"}
        </Badge>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Revisión de Respuestas</h2>

        {questions.map((question, index) => {
          const result = results.find((r) => r.questionId === question.Id);
          const selectedAnswer = question.respuestas.find(
            (a) => a.Id === result?.selectedAnswerId
          );
          const correctAnswer = question.respuestas.find((a) => a.Ok);

          return (
            <Card key={question.Id} className="mb-4">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg flex-1">
                    {index + 1}. {question.Pregunta}
                  </CardTitle>
                  <div className="ml-4">
                    {result?.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-success" />
                    ) : (
                      <XCircle className="w-6 h-6 text-destructive" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {question.respuestas.map((answer) => {
                    const isSelected = selectedAnswer?.Id === answer.Id;
                    const isCorrect = answer.Ok;

                    let className = "p-3 border rounded-lg ";
                    if (isCorrect && isSelected) {
                      className += "border-success bg-success/10 text-success";
                    } else if (isCorrect) {
                      className += "border-success bg-success/10 text-success";
                    } else if (isSelected) {
                      className +=
                        "border-destructive bg-destructive/10 text-destructive";
                    } else {
                      className += "border-muted bg-muted";
                    }

                    return (
                      <div key={answer.Id} className={className}>
                        <div className="flex items-center justify-between">
                          <span>{answer.txtRespuesta}</span>
                          <div className="flex items-center space-x-2">
                            {isSelected && (
                              <Badge variant="outline" className="text-xs">
                                Tu respuesta
                              </Badge>
                            )}
                            {isCorrect && (
                              <Badge
                                variant="default"
                                className="text-xs bg-success"
                              >
                                Correcta
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Button onClick={onReturnToDashboard} size="lg">
          Volver al Panel Principal
        </Button>
      </div>
    </div>
  );
}
