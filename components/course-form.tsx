"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Course, CourseFormData } from "@/types";
import { Plus, Save } from "lucide-react";

interface CourseFormProps {
  onSubmit: (course: CourseFormData) => void;
  initialData?: Course;
  isEditing?: boolean;
}

export function CourseForm({
  onSubmit,
  initialData,
  isEditing = false,
}: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    nombre: initialData?.nombre || "",
    existePlataformaInterna: initialData?.existePlataformaInterna || false,
    totalPreguntas: initialData?.totalPreguntas || 0,
    entidad: initialData?.entidad || "",
    horas: initialData?.horas || 0,
    ciudad: initialData?.ciudad || "",
    proyecto: initialData?.proyecto || "",
    lugar: initialData?.lugar || "",
    centroCosto: initialData?.centroCosto || "",
    cargo: initialData?.cargo || "",
    estado: initialData?.estado || "Activo",
    modalidad: initialData?.modalidad || "Presencial",
    anioProgramacion: initialData?.anioProgramacion || new Date().getFullYear(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isEditing) {
      // Reset form after creating new course
      setFormData({
        nombre: "",
        existePlataformaInterna: false,
        totalPreguntas: 0,
        entidad: "",
        horas: 0,
        ciudad: "",
        proyecto: "",
        lugar: "",
        centroCosto: "",
        cargo: "",
        estado: "Activo",
        modalidad: "Presencial",
        anioProgramacion: new Date().getFullYear(),
      });
    }
  };

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-playfair text-2xl text-primary">
          {isEditing ? "Editar Curso" : "Crear Nuevo Curso"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Curso</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Ingrese el nombre del curso"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entidad">Entidad</Label>
              <Input
                id="entidad"
                value={formData.entidad}
                onChange={(e) => handleInputChange("entidad", e.target.value)}
                placeholder="Nombre de la entidad"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horas">Horas</Label>
              <Input
                id="horas"
                type="number"
                value={formData.horas}
                onChange={(e) =>
                  handleInputChange(
                    "horas",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                placeholder="Número de horas"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                value={formData.ciudad}
                onChange={(e) => handleInputChange("ciudad", e.target.value)}
                placeholder="Ciudad del curso"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proyecto">Proyecto</Label>
              <Input
                id="proyecto"
                value={formData.proyecto}
                onChange={(e) => handleInputChange("proyecto", e.target.value)}
                placeholder="Nombre del proyecto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lugar">Lugar</Label>
              <Input
                id="lugar"
                value={formData.lugar}
                onChange={(e) => handleInputChange("lugar", e.target.value)}
                placeholder="Lugar del curso"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="centroCosto">Centro de Costo</Label>
              <Input
                id="centroCosto"
                value={formData.centroCosto}
                onChange={(e) =>
                  handleInputChange("centroCosto", e.target.value)
                }
                placeholder="Centro de costo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={formData.cargo}
                onChange={(e) => handleInputChange("cargo", e.target.value)}
                placeholder="Cargo relacionado"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalPreguntas">Total Preguntas</Label>
              <Input
                id="totalPreguntas"
                type="number"
                value={formData.totalPreguntas}
                onChange={(e) =>
                  handleInputChange(
                    "totalPreguntas",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                placeholder="Número de preguntas"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anioProgramacion">Año de Programación</Label>
              <Input
                id="anioProgramacion"
                type="number"
                value={formData.anioProgramacion}
                onChange={(e) =>
                  handleInputChange(
                    "anioProgramacion",
                    Number.parseInt(e.target.value) || new Date().getFullYear()
                  )
                }
                placeholder="Año"
                min="2020"
                max="2030"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleInputChange("estado", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modalidad">Modalidad</Label>
              <Select
                value={formData.modalidad}
                onValueChange={(value) => handleInputChange("modalidad", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="Virtual">Virtual</SelectItem>
                  <SelectItem value="Mixta">Mixta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="existePlataformaInterna"
                checked={formData.existePlataformaInterna}
                onCheckedChange={(checked) =>
                  handleInputChange("existePlataformaInterna", checked)
                }
              />
              <Label htmlFor="existePlataformaInterna">
                Existe en Plataforma Interna
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="aplicaEficacia">Aplica Eficacia</Label>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto">
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Actualizar Curso
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Crear Curso
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
