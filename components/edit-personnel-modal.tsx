"use client";

import { Course, Capacitacion } from "@/types";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Users, Trash2, UserPlus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

interface EditPersonnelModalProps {
  course: Course;
  currentCapacitaciones: Capacitacion[];
  onUpdate: () => void;
}

type AssignmentType = "lugar" | "ciudad" | "cc" | "antiguedad" | "ids";

export function EditPersonnelModal({
  course,
  currentCapacitaciones,
  onUpdate,
}: EditPersonnelModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Assignment states
  const [assignmentType, setAssignmentType] = useState<AssignmentType>("ids");
  const [assignmentValue, setAssignmentValue] = useState("");
  const [assignmentIds, setAssignmentIds] = useState("");

  // Options for dropdowns
  const [lugares, setLugares] = useState<string[]>([]);
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [centrosCostos, setCentrosCostos] = useState<string[]>([]);
  const [antiguedades, setAntiguedades] = useState<string[]>([]);

  // Selected personnel to remove
  const [selectedToRemove, setSelectedToRemove] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (isOpen) {
      fetchDistinctValues();
    }
  }, [isOpen]);

  const fetchDistinctValues = async () => {
    try {
      const response = await fetch("/api/empleados?action=getDistinctValues");
      if (!response.ok) throw new Error("Error al cargar las opciones");

      const data = await response.json();
      setLugares(data.lugares || []);
      setCiudades(data.ciudades || []);
      setCentrosCostos(data.centrosCostos || []);
      setAntiguedades(data.antiguedades || []);
    } catch (error) {
      console.error("Error fetching distinct values:", error);
      toast.error("Error al cargar las opciones de asignación");
    }
  };

  const togglePersonRemoval = (capacitacionId: number) => {
    const newSelection = new Set(selectedToRemove);
    if (newSelection.has(capacitacionId)) {
      newSelection.delete(capacitacionId);
    } else {
      newSelection.add(capacitacionId);
    }
    setSelectedToRemove(newSelection);
  };

  const handleRemoveSelected = async () => {
    if (selectedToRemove.size === 0) {
      toast.error("No se han seleccionado empleados para eliminar");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/capacitaciones", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          capacitacionIds: Array.from(selectedToRemove),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar empleados");
      }

      toast.success(
        `${selectedToRemove.size} empleado${
          selectedToRemove.size !== 1 ? "s" : ""
        } eliminado${selectedToRemove.size !== 1 ? "s" : ""} del curso`
      );
      setSelectedToRemove(new Set());
      onUpdate();
    } catch (error) {
      console.error("Error removing personnel:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al eliminar los empleados"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPersonnel = async () => {
    if (assignmentType === "ids" && !assignmentIds.trim()) {
      toast.error("Por favor ingresa al menos un ID de empleado");
      return;
    }

    if (assignmentType !== "ids" && !assignmentValue) {
      toast.error("Por favor selecciona un valor para la asignación");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/capacitaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: course.Id,
          assignmentType,
          assignmentValue:
            assignmentType === "ids" ? assignmentIds : assignmentValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al agregar empleados");
      }

      const data = await response.json();
      toast.success(
        `${data.count || 0} empleado${
          data.count !== 1 ? "s" : ""
        } agregado${data.count !== 1 ? "s" : ""} al curso`
      );

      // Reset form
      setAssignmentValue("");
      setAssignmentIds("");
      onUpdate();
    } catch (error) {
      console.error("Error adding personnel:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al agregar empleados"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setAssignmentType("ids");
    setAssignmentValue("");
    setAssignmentIds("");
    setSelectedToRemove(new Set());
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          resetModal();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant="outline">
          <Users className="w-4 h-4" />
          Editar Personal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Personal del Curso</DialogTitle>
          <DialogDescription>
            Administra los empleados asignados a este curso
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add Personnel Section */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              <h3 className="font-semibold">Agregar Personal</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <Label htmlFor="assignment-type">Asignar por</Label>
                <div className="col-span-3">
                  <Select
                    value={assignmentType}
                    onValueChange={(value) => {
                      setAssignmentType(value as AssignmentType);
                      setAssignmentValue("");
                      setAssignmentIds("");
                    }}
                  >
                    <SelectTrigger id="assignment-type" className="w-full">
                      <SelectValue placeholder="Selecciona cómo asignar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lugar">Lugar</SelectItem>
                      <SelectItem value="ciudad">Ciudad</SelectItem>
                      <SelectItem value="cc">Centro de Costos</SelectItem>
                      <SelectItem value="antiguedad">Antigüedad</SelectItem>
                      <SelectItem value="ids">IDs específicos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {assignmentType !== "ids" ? (
                <div className="col-span-3">
                  <Label htmlFor="assignment-value">Valor</Label>
                  <div className="col-span-3">
                    <Select
                      value={assignmentValue}
                      onValueChange={setAssignmentValue}
                    >
                      <SelectTrigger id="assignment-value" className="w-full">
                        <SelectValue placeholder="Selecciona un valor" />
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
              ) : (
                <div className="col-span-3">
                  <Label htmlFor="assignment-ids">
                    IDs de empleados (separados por coma)
                  </Label>
                  <Input
                    id="assignment-ids"
                    placeholder="Ej: 123, 456, 789"
                    value={assignmentIds}
                    onChange={(e) => setAssignmentIds(e.target.value)}
                  />
                </div>
              )}

              <div className="col-span-3">
                <Button
                  onClick={handleAddPersonnel}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Agregar Personal
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Remove Personnel Section */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                <h3 className="font-semibold">Eliminar Personal</h3>
              </div>
              <Badge variant="secondary">
                {currentCapacitaciones.length} total
                {selectedToRemove.size > 0 &&
                  ` (${selectedToRemove.size} seleccionados)`}
              </Badge>
            </div>

            {currentCapacitaciones.length > 0 ? (
              <>
                <div className="max-h-64 overflow-y-auto border rounded-lg">
                  <div className="space-y-1 p-2">
                    {currentCapacitaciones.map((cap) => (
                      <div
                        key={cap.Id}
                        className={`flex items-center space-x-3 p-2 rounded hover:bg-muted cursor-pointer ${
                          selectedToRemove.has(cap.Id) ? "bg-muted" : ""
                        }`}
                        onClick={() => togglePersonRemoval(cap.Id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedToRemove.has(cap.Id)}
                          onChange={() => togglePersonRemoval(cap.Id)}
                          className="cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">
                              {cap.NombreCompleto}
                            </p>
                            {cap.Graduado && (
                              <Badge
                                variant="default"
                                className="bg-green-500 text-xs"
                              >
                                Graduado
                              </Badge>
                            )}
                            {cap.Realizado && !cap.Graduado && (
                              <Badge variant="destructive" className="text-xs">
                                Reprobado
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ID: {cap.Id} | Cédula: {cap.Cedula} | Lugar:{" "}
                            {cap["Lugar actual"]} | Nota: {cap.Nota || "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedToRemove.size > 0 && (
                  <Button
                    onClick={handleRemoveSelected}
                    disabled={isLoading}
                    variant="destructive"
                    className="w-full"
                  >
                    {isLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar {selectedToRemove.size} empleado
                        {selectedToRemove.size !== 1 ? "s" : ""}
                      </>
                    )}
                  </Button>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay empleados asignados a este curso
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
