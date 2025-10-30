"use client";

import { useState } from "react";
import { Question, Answer } from "@/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface EmployeeTestProps {
  questions: Question[];
  onSubmitTest: (answers: { questionId: number; answerId: number }[]) => void;
}

export function EmployeeTest({ questions, onSubmitTest }: EmployeeTestProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [questionId: number]: number;
  }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const answers = Object.entries(selectedAnswers).map(
      ([questionId, answerId]) => ({
        questionId: parseInt(questionId),
        answerId: answerId as number,
      })
    );
    onSubmitTest(answers);
  };

  const isTestComplete = questions.every(
    (q) => selectedAnswers[q.Id] !== undefined
  );
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>No hay preguntas disponibles.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Evaluación</h2>
          <Badge variant="outline">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.Pregunta}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.respuestas.map((answer) => (
              <div
                key={answer.Id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedAnswers[currentQuestion.Id] === answer.Id
                    ? "border-primary bg-primary/10"
                    : "border-border"
                }`}
                onClick={() =>
                  handleAnswerSelect(currentQuestion.Id, answer.Id)
                }
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedAnswers[currentQuestion.Id] === answer.Id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedAnswers[currentQuestion.Id] === answer.Id && (
                      <div className="w-2 h-2 bg-primary-foreground rounded-full mx-auto mt-1"></div>
                    )}
                  </div>
                  <span>{answer.txtRespuesta}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Anterior
        </Button>

        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                index === currentQuestionIndex
                  ? "bg-primary"
                  : selectedAnswers[questions[index].Id] !== undefined
                  ? "bg-secondary"
                  : "bg-muted"
              }`}
              onClick={() => setCurrentQuestionIndex(index)}
            ></div>
          ))}
        </div>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={!isTestComplete}>
            Finalizar Evaluación
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
}
