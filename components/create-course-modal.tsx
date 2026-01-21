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

interface CreateCourseModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface Answer {
  txtRespuesta: string;
  Ok: boolean;
}

interface Question {
  Pregunta: string;
  respuestas: Answer[];
}

interface CreateCourseForm {
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

export function CreateCourseModal({
  isOpen,
  onOpenChange,
  onSuccess,
}: CreateCourseModalProps) {
  const [step, setStep] = useState(1);
  const [createForm, setCreateForm] = useState<CreateCourseForm>({
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

  useEffect(() => {
    if (isOpen) {
      fetchDistinctValues();
    }
  }, [isOpen]);

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
    if (!createForm.nombre.trim()) missingFields.push("Nombre");
    if (!createForm.entidad.trim()) missingFields.push("Entidad");
    if (!createForm.modalidad.trim()) missingFields.push("Modalidad");
    if (!createForm.mesProgramacion.trim())
      missingFields.push("Mes Programación");
    if (!createForm.anoProgramacion.trim())
      missingFields.push("Año Programación");
    if (!createForm.clasificacion.trim()) missingFields.push("Clasificación");
    if (
      createForm.requiereAprobacion &&
      !createForm.porcentajeAprobacion.trim()
    )
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

  const handleCreateSubmit = async () => {
    try {
      if (!validateStep1()) {
        return;
      }

      const response = await fetch("/api/cursos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...createForm,
          aplicaEficiencia: createForm.requiereAprobacion
            ? createForm.porcentajeAprobacion
            : "0",
          tiempoMaximo: "0",
          repeticionesMaximo: "0",
          preguntas: questions.map((q) => ({
            Pregunta: q.Pregunta,
            tipo: 1,
            desordenarPreguntas: true,
            valor: 1,
            respuestas: q.respuestas,
          })),
          assignment: {
            type: assignmentType,
            value: assignmentType === "ids" ? assignmentIds : assignmentValue,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el curso");
      }

      toast.success("Curso creado exitosamente");
      onOpenChange(false);

      // Reset form
      setCreateForm({
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
      setQuestions([]);
      setAssignmentType("lugar");
      setAssignmentValue("");
      setAssignmentIds("");
      setStep(1);

      onSuccess();
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al crear el curso"
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
          <DialogTitle>Crear Nuevo Curso - Paso {step} de 3</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Completa la información básica del curso (*campos obligatorios)"
              : step === 2
                ? "Agrega preguntas y respuestas al curso"
                : "Asigna el curso a empleados"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-nombre" className="text-right">
                  Nombre *
                </Label>
                <Input
                  id="create-nombre"
                  value={createForm.nombre}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, nombre: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Nombre del curso"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-entidad" className="text-right">
                  Entidad *
                </Label>
                <Input
                  id="create-entidad"
                  value={createForm.entidad}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, entidad: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-horas" className="text-right">
                  Horas
                </Label>
                <Input
                  id="create-horas"
                  type="number"
                  value={createForm.horas}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, horas: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-modalidad" className="text-right">
                  Modalidad *
                </Label>
                <div className="col-span-3">
                  <Select
                    value={createForm.modalidad}
                    onValueChange={(value) =>
                      setCreateForm({ ...createForm, modalidad: value })
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
                <Label htmlFor="create-mesProgramacion" className="text-right">
                  Mes Prog. *
                </Label>
                <Input
                  id="create-mesProgramacion"
                  placeholder="MM"
                  value={createForm.mesProgramacion}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      mesProgramacion: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-anoProgramacion" className="text-right">
                  Año Prog. *
                </Label>
                <Input
                  id="create-anoProgramacion"
                  placeholder="YYYY"
                  value={createForm.anoProgramacion}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      anoProgramacion: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-clasificacion" className="text-right">
                  Clasificación *
                </Label>
                <div className="col-span-3">
                  <Select
                    value={createForm.clasificacion}
                    onValueChange={(value) =>
                      setCreateForm({ ...createForm, clasificacion: value })
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
                <Label htmlFor="create-tipo" className="text-right">
                  Tipo
                </Label>
                <div className="col-span-3">
                  <Select
                    value={createForm.tipo}
                    onValueChange={(value) =>
                      setCreateForm({ ...createForm, tipo: value })
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
                    checked={createForm.requiereAprobacion}
                    onClick={() =>
                      console.log(
                        "Rendering Switch with value:",
                        createForm.requiereAprobacion
                      )
                    }
                    onCheckedChange={(checked) =>
                      setCreateForm({
                        ...createForm,
                        requiereAprobacion: checked,
                        porcentajeAprobacion: checked
                          ? createForm.porcentajeAprobacion
                          : "",
                      })
                    }
                  />
                  {createForm.requiereAprobacion && (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="% Aprobación"
                      value={createForm.porcentajeAprobacion}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          porcentajeAprobacion: e.target.value,
                        })
                      }
                      className="w-32"
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-texto" className="text-right">
                  Texto
                </Label>
                <Input
                  id="create-texto"
                  value={createForm.texto}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, texto: e.target.value })
                  }
                  className="col-span-3"
                  maxLength={500}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-induccionVideo" className="text-right">
                  Video 1 URL
                </Label>
                <Input
                  id="create-induccionVideo"
                  value={createForm.induccionVideo}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      induccionVideo: e.target.value,
                    })
                  }
                  className="col-span-3"
                  placeholder="URL del video"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-induccionVideo2" className="text-right">
                  Video 2 URL
                </Label>
                <Input
                  id="create-induccionVideo2"
                  value={createForm.induccionVideo2}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      induccionVideo2: e.target.value,
                    })
                  }
                  className="col-span-3"
                  placeholder="URL del video"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-induccionVideo3" className="text-right">
                  Video 3 URL
                </Label>
                <Input
                  id="create-induccionVideo3"
                  value={createForm.induccionVideo3}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      induccionVideo3: e.target.value,
                    })
                  }
                  className="col-span-3"
                  placeholder="URL del video"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="create-induccionVideo4" className="text-right">
                  Video 4 URL
                </Label>
                <Input
                  id="create-induccionVideo4"
                  value={createForm.induccionVideo4}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
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
              <Button type="button" onClick={handleCreateSubmit}>
                Crear Curso
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
