"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, X, ArrowLeft, ArrowRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { Course } from "@/types";

interface EditCourseModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  course: Course;
}

interface Answer {
  txtRespuesta: string;
  Ok: boolean;
}

interface Question {
  Pregunta: string;
  respuestas: Answer[];
}

interface EditCourseForm {
  nombre: string;
  entidad: string;
  horas: string;
  modalidad: string;
  mesProgramacion: string;
  anoProgramacion: string;
  clasificacion: string;
  tipo: string;
  requiereAprobacion: boolean;
  porcentajeAprobacion: string;
  texto: string;
  induccionVideo: string;
  induccionVideo2: string;
  induccionVideo3: string;
  induccionVideo4: string;
}

export function EditCourseModal({
  isOpen,
  onOpenChange,
  onSuccess,
  course,
}: EditCourseModalProps) {
  const [step, setStep] = useState(1);
  const [editForm, setEditForm] = useState<EditCourseForm>({
    nombre: "",
    entidad: "",
    horas: "",
    modalidad: "",
    mesProgramacion: "",
    anoProgramacion: "",
    clasificacion: "",
    tipo: "RecursoHumano",
    requiereAprobacion: false,
    porcentajeAprobacion: "",
    texto: "",
    induccionVideo: "",
    induccionVideo2: "",
    induccionVideo3: "",
    induccionVideo4: "",
  });

  const [questions, setQuestions] = useState<Question[]>([]);

  // Step 3: Assignment
  const [assignmentType, setAssignmentType] = useState<
    "lugar" | "ciudad" | "cc" | "antiguedad" | "ids"
  >("lugar");
  const [assignmentValue, setAssignmentValue] = useState("");
  const [assignmentIds, setAssignmentIds] = useState("");

  // Distinct values from DB
  const [lugares, setLugares] = useState<string[]>([]);
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [centrosCostos, setCentrosCostos] = useState<string[]>([]);
  const [antiguedades, setAntiguedades] = useState<string[]>([]);

  // Initialize form with course data when modal opens
  useEffect(() => {
    if (isOpen && course) {
      // Fetch full course details including questions
      const fetchFullCourse = async () => {
        try {
          const response = await fetch(`/api/cursos?id=${course.Id}`);
          if (!response.ok) {
            throw new Error("Error al cargar los datos del curso");
          }
          const fullCourse = await response.json();

          const aplicaEficiencia = fullCourse.AplicaEficiencia || 0;
          setEditForm({
            nombre: fullCourse.Nombre || fullCourse.Curso || "",
            entidad: fullCourse.Entidad || "",
            horas: (fullCourse.Horas || 0).toString(),
            modalidad: fullCourse.Modalidad || "",
            mesProgramacion: fullCourse["Mes Programacion"] || "",
            anoProgramacion: fullCourse["Ano Programacion"] || "",
            clasificacion: fullCourse.Clasificacion || "",
            tipo: "RecursoHumano",
            requiereAprobacion: aplicaEficiencia > 0,
            porcentajeAprobacion:
              aplicaEficiencia > 0 ? aplicaEficiencia.toString() : "",
            texto: fullCourse.Texto || "",
            induccionVideo: fullCourse.InduccionVideo || "",
            induccionVideo2: fullCourse.InduccionVideo2 || "",
            induccionVideo3: fullCourse.InduccionVideo3 || "",
            induccionVideo4: fullCourse.InduccionVideo4 || "",
          });

          // Load questions if available
          if (fullCourse.preguntas && fullCourse.preguntas.length > 0) {
            setQuestions(
              fullCourse.preguntas.map((q: any) => ({
                Pregunta: q.Pregunta,
                respuestas: q.respuestas.map((r: any) => ({
                  txtRespuesta: r.txtRespuesta,
                  Ok: r.Ok,
                })),
              }))
            );
          } else {
            setQuestions([]);
          }

          // Load assignment data
          if (fullCourse.Lugar) {
            setAssignmentType("lugar");
            setAssignmentValue(fullCourse.Lugar);
          } else if (fullCourse.Ciudad) {
            setAssignmentType("ciudad");
            setAssignmentValue(fullCourse.Ciudad);
          } else if (fullCourse.CC) {
            setAssignmentType("cc");
            setAssignmentValue(fullCourse.CC);
          }
        } catch (error) {
          console.error("Error fetching full course:", error);
          toast.error("Error al cargar los datos del curso");
        }
      };

      fetchFullCourse();
      fetchDistinctValues();
    }
  }, [isOpen, course]);

  const fetchDistinctValues = async () => {
    try {
      const response = await fetch("/api/empleados?action=getDistinctValues");
      const data = await response.json();
      setLugares(data.lugares || []);
      setCiudades(data.ciudades || []);
      setCentrosCostos(data.centrosCostos || []);
      setAntiguedades(data.antiguedades || []);
    } catch (error) {
      console.error("Error fetching distinct values:", error);
    }
  };

  const validateStep1 = () => {
    const missingFields = [];
    if (!editForm.nombre.trim()) missingFields.push("Nombre");
    if (!editForm.entidad.trim()) missingFields.push("Entidad");
    if (!editForm.modalidad.trim()) missingFields.push("Modalidad");
    if (!editForm.mesProgramacion.trim())
      missingFields.push("Mes Programación");
    if (!editForm.anoProgramacion.trim())
      missingFields.push("Año Programación");
    if (!editForm.clasificacion.trim()) missingFields.push("Clasificación");
    if (editForm.requiereAprobacion && !editForm.porcentajeAprobacion.trim())
      missingFields.push("Porcentaje de Aprobación");

    if (missingFields.length > 0) {
      toast.error(
        `Los siguientes campos son obligatorios: ${missingFields.join(", ")}`
      );
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleEditSubmit = async () => {
    try {
      if (!validateStep1()) {
        return;
      }

      const response = await fetch(`/api/cursos?id=${course.Id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: editForm.nombre,
          entidad: editForm.entidad,
          horas: editForm.horas,
          modalidad: editForm.modalidad,
          mesProgramacion: editForm.mesProgramacion,
          anoProgramacion: editForm.anoProgramacion,
          antiguedad: "",
          clasificacion: editForm.clasificacion,
          ciudad: "",
          aplicaEficiencia: editForm.requiereAprobacion
            ? editForm.porcentajeAprobacion
            : "0",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el curso");
      }

      toast.success("Curso actualizado exitosamente");
      onOpenChange(false);
      setStep(1);
      onSuccess();
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al actualizar el curso"
      );
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        Pregunta: "",
        respuestas: [{ txtRespuesta: "", Ok: false }],
      },
    ]);
  };

  const removeQuestion = (questionIndex: number) => {
    setQuestions(questions.filter((_, i) => i !== questionIndex));
  };

  const updateQuestionField = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].Pregunta = value;
    setQuestions(updated);
  };

  const addAnswer = (questionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].respuestas.push({
      txtRespuesta: "",
      Ok: false,
    });
    setQuestions(updated);
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].respuestas = updated[
      questionIndex
    ].respuestas.filter((_, i) => i !== answerIndex);
    setQuestions(updated);
  };

  const updateAnswer = (
    questionIndex: number,
    answerIndex: number,
    value: string
  ) => {
    const updated = [...questions];
    updated[questionIndex].respuestas[answerIndex].txtRespuesta = value;
    setQuestions(updated);
  };

  const toggleCorrectAnswer = (questionIndex: number, answerIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].respuestas[answerIndex].Ok =
      !updated[questionIndex].respuestas[answerIndex].Ok;
    setQuestions(updated);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Editar Curso - Paso {step} de 3</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Modifica la información básica del curso (*campos obligatorios)"
              : step === 2
                ? "Edita preguntas y respuestas del curso"
                : "Actualiza la asignación del curso"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre *
                </Label>
                <Input
                  id="edit-nombre"
                  value={editForm.nombre}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nombre: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Nombre del curso"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-entidad" className="text-right">
                  Entidad *
                </Label>
                <Input
                  id="edit-entidad"
                  value={editForm.entidad}
                  onChange={(e) =>
                    setEditForm({ ...editForm, entidad: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-horas" className="text-right">
                  Horas
                </Label>
                <Input
                  id="edit-horas"
                  type="number"
                  value={editForm.horas}
                  onChange={(e) =>
                    setEditForm({ ...editForm, horas: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-modalidad" className="text-right">
                  Modalidad *
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editForm.modalidad}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, modalidad: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar modalidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Virtual">Virtual</SelectItem>
                      <SelectItem value="Presencial">Presencial</SelectItem>
                      <SelectItem value="Mixta">Mixta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-mesProgramacion" className="text-right">
                  Mes Prog. *
                </Label>
                <Input
                  id="edit-mesProgramacion"
                  placeholder="MM"
                  value={editForm.mesProgramacion}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      mesProgramacion: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-anoProgramacion" className="text-right">
                  Año Prog. *
                </Label>
                <Input
                  id="edit-anoProgramacion"
                  placeholder="YYYY"
                  value={editForm.anoProgramacion}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      anoProgramacion: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-clasificacion" className="text-right">
                  Clasificación *
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editForm.clasificacion}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, clasificacion: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar clasificación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Induccion">Inducción</SelectItem>
                      <SelectItem value="Capacitacion">Capacitación</SelectItem>
                      <SelectItem value="Entrenamiento">
                        Entrenamiento
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tipo" className="text-right">
                  Tipo
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editForm.tipo}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, tipo: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RecursoHumano">
                        Recurso Humano
                      </SelectItem>
                      <SelectItem value="Corporativo">Corporativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Requiere Aprobación</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Switch
                    checked={editForm.requiereAprobacion}
                    onClick={() => console.log(editForm)}
                    onCheckedChange={(checked) =>
                      setEditForm({
                        ...editForm,
                        requiereAprobacion: checked,
                        porcentajeAprobacion: checked
                          ? editForm.porcentajeAprobacion
                          : "",
                      })
                    }
                  />
                  {editForm.requiereAprobacion && (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="% Aprobación"
                      value={editForm.porcentajeAprobacion}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          porcentajeAprobacion: e.target.value,
                        })
                      }
                      className="w-32"
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-texto" className="text-right">
                  Texto
                </Label>
                <Input
                  id="edit-texto"
                  value={editForm.texto}
                  onChange={(e) =>
                    setEditForm({ ...editForm, texto: e.target.value })
                  }
                  className="col-span-3"
                  maxLength={500}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-induccionVideo" className="text-right">
                  Video 1 URL
                </Label>
                <Input
                  id="edit-induccionVideo"
                  value={editForm.induccionVideo}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      induccionVideo: e.target.value,
                    })
                  }
                  className="col-span-3"
                  placeholder="URL del video"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-induccionVideo2" className="text-right">
                  Video 2 URL
                </Label>
                <Input
                  id="edit-induccionVideo2"
                  value={editForm.induccionVideo2}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      induccionVideo2: e.target.value,
                    })
                  }
                  className="col-span-3"
                  placeholder="URL del video"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-induccionVideo3" className="text-right">
                  Video 3 URL
                </Label>
                <Input
                  id="edit-induccionVideo3"
                  value={editForm.induccionVideo3}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      induccionVideo3: e.target.value,
                    })
                  }
                  className="col-span-3"
                  placeholder="URL del video"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-induccionVideo4" className="text-right">
                  Video 4 URL
                </Label>
                <Input
                  id="edit-induccionVideo4"
                  value={editForm.induccionVideo4}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      induccionVideo4: e.target.value,
                    })
                  }
                  className="col-span-3"
                  placeholder="URL del video"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="col-span-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold">Preguntas</Label>
                  <Button
                    type="button"
                    onClick={addQuestion}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar Pregunta
                  </Button>
                </div>

                {questions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay preguntas. Haz clic en "Agregar Pregunta" para
                    comenzar.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, qIndex) => (
                      <div
                        key={qIndex}
                        className="border rounded-lg p-4 bg-muted/30"
                      >
                        <div className="flex items-start gap-2 mb-3">
                          <div className="flex-1 space-y-2">
                            <Label className="text-sm font-medium mb-1 block">
                              Pregunta {qIndex + 1}
                            </Label>
                            <Input
                              value={question.Pregunta}
                              onChange={(e) =>
                                updateQuestionField(qIndex, e.target.value)
                              }
                              placeholder="Escribe la pregunta..."
                              maxLength={500}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(qIndex)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="ml-4 space-y-2">
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Respuestas
                            </Label>
                            <Button
                              type="button"
                              onClick={() => addAnswer(qIndex)}
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Respuesta
                            </Button>
                          </div>

                          {question.respuestas.map((answer, aIndex) => (
                            <div
                              key={aIndex}
                              className="flex items-center gap-2 bg-background rounded p-2"
                            >
                              <Input
                                value={answer.txtRespuesta}
                                onChange={(e) =>
                                  updateAnswer(qIndex, aIndex, e.target.value)
                                }
                                placeholder={`Respuesta ${aIndex + 1}`}
                                className="flex-1 h-8 text-sm"
                                maxLength={200}
                              />
                              <div className="flex items-center gap-1">
                                <Label className="text-xs text-muted-foreground whitespace-nowrap">
                                  Correcta
                                </Label>
                                <Switch
                                  checked={answer.Ok}
                                  onCheckedChange={() =>
                                    toggleCorrectAnswer(qIndex, aIndex)
                                  }
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAnswer(qIndex, aIndex)}
                                className="h-7 w-7 p-0 hover:bg-destructive/10"
                                disabled={question.respuestas.length === 1}
                              >
                                <X className="w-3 h-3 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Asignar por</Label>
                  <div className="col-span-3">
                    <Select
                      value={assignmentType}
                      onValueChange={(value: any) => {
                        setAssignmentType(value);
                        setAssignmentValue("");
                        setAssignmentIds("");
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lugar">Lugar Actual</SelectItem>
                        <SelectItem value="ciudad">Ciudad Actual</SelectItem>
                        <SelectItem value="cc">Centro de Costos</SelectItem>
                        <SelectItem value="antiguedad">Antigüedad</SelectItem>
                        <SelectItem value="ids">IDs Específicos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {assignmentType === "ids" ? (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">IDs</Label>
                    <Input
                      value={assignmentIds}
                      onChange={(e) => setAssignmentIds(e.target.value)}
                      placeholder="Ej: 123, 456, 789"
                      className="col-span-3"
                    />
                    <div className="col-span-4 text-xs text-muted-foreground text-right">
                      Ingresa los IDs separados por comas
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Valor</Label>
                    <div className="col-span-3">
                      <Select
                        value={assignmentValue}
                        onValueChange={setAssignmentValue}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar valor" />
                        </SelectTrigger>
                        <SelectContent>
                          {assignmentType === "lugar" &&
                            lugares.map((lugar) => (
                              <SelectItem key={lugar} value={lugar}>
                                {lugar}
                              </SelectItem>
                            ))}
                          {assignmentType === "ciudad" &&
                            ciudades.map((ciudad) => (
                              <SelectItem key={ciudad} value={ciudad}>
                                {ciudad}
                              </SelectItem>
                            ))}
                          {assignmentType === "cc" &&
                            centrosCostos.map((cc) => (
                              <SelectItem key={cc} value={cc}>
                                {cc}
                              </SelectItem>
                            ))}
                          {assignmentType === "antiguedad" &&
                            antiguedades.map((antiguedad) => (
                              <SelectItem key={antiguedad} value={antiguedad}>
                                {antiguedad}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setStep(1);
            }}
          >
            Cancelar
          </Button>
          {step === 1 ? (
            <Button type="button" onClick={handleNext}>
              Siguiente
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : step === 2 ? (
            <>
              <Button type="button" variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
              <Button type="button" onClick={handleNext}>
                Siguiente
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
              <Button type="button" onClick={handleEditSubmit}>
                Actualizar Curso
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
