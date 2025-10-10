"use client";

import type { Course } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Edit,
  Trash2,
  Copy,
  Calendar,
  GraduationCap,
  Clock,
  Monitor,
  Building2,
  MessageCircleQuestion,
  CheckCircle,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();

  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Form states for edit modal
  const [editForm, setEditForm] = useState({
    nombre: course.Nombre || course.Curso,
    entidad: course.Entidad || "",
    horas: (course.Horas || 0).toString(),
    modalidad: course.Modalidad || "",
    programacion: `${course["Mes Programacion"] || ""}/${
      course["Ano Programacion"] || ""
    }`,
    antiguedad: course.Antiguedad || "",
    clasificacion: course.Clasificacion || "",
    ciudad: course.Ciudad || "",
  });

  console.log("Rendering CourseCard for course:", course);

  const handleCardClick = () => {
    router.push(`/capacitaciones/${course.Id}`);
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation(); // Prevent card click when clicking buttons
    action();
  };

  const handleEditSubmit = () => {
    // TODO: Implement actual edit functionality
    toast.success("Funcionalidad de edición en desarrollo");
    setIsEditOpen(false);
  };

  const handleDeleteConfirm = () => {
    // TODO: Implement actual delete functionality
    toast.success("Funcionalidad de eliminación en desarrollo");
    setIsDeleteOpen(false);
  };

  const handleDuplicate = () => {
    // TODO: Implement actual duplicate functionality
    toast.success("Curso duplicado (funcionalidad en desarrollo)");
  };

  return (
    <div>
      <Card
        className="group min-h-full gap-0 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary flex flex-col cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="font-playfair text-lg text-primary line-clamp-1 mb-1">
                {course.Nombre || course.Curso}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-base">
                  ID: {course.Id}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) =>
                    handleButtonClick(e, () => {
                      setIsExpanded(!isExpanded);
                    })
                  }
                  className="h-6 w-6 p-0 hover:bg-primary/10"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-primary" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-primary" />
                  )}
                </Button>
              </div>
            </div>
            {/* Action Menu */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) =>
                  handleButtonClick(e, () => {
                    setIsEditOpen(true);
                  })
                }
                className="h-7 w-7 p-0 hover:bg-primary/10"
              >
                <Edit className="w-3 h-3 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) =>
                  handleButtonClick(e, () => {
                    handleDuplicate();
                  })
                }
                className="h-7 w-7 p-0 hover:bg-blue-500/10"
              >
                <Copy className="w-3 h-3 text-blue-500" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) =>
                  handleButtonClick(e, () => {
                    setIsDeleteOpen(true);
                  })
                }
                className="h-7 w-7 p-0 hover:bg-destructive/10"
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="py-3">
            {/* Course Information - Compact Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2.5">
              {/* Total Preguntas */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <MessageCircleQuestion className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">
                    Total Preguntas
                  </p>
                </div>
                <p className="text-base font-semibold text-foreground">
                  {course["Total Preguntas"] || course.preguntas?.length || 0}
                </p>
              </div>

              {/* Entidad */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">Entidad</p>
                </div>
                <p className="text-base font-semibold text-foreground truncate">
                  {course.Entidad || "N/A"}
                </p>
              </div>

              {/* Horas */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">Horas</p>
                </div>
                <p className="text-base font-semibold text-foreground">
                  {course.Horas || 0}h
                </p>
              </div>

              {/* Modalidad */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Monitor className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">Modalidad</p>
                </div>
                <p className="text-base font-semibold text-foreground">
                  {course.Modalidad || "N/A"}
                </p>
              </div>

              {/* Programación */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">Programación</p>
                </div>
                <p className="text-base font-semibold text-foreground">
                  {course["Mes Programacion"] && course["Ano Programacion"]
                    ? `${course["Mes Programacion"]}/${course["Ano Programacion"]}`
                    : "N/A"}
                </p>
              </div>

              {/* Antigüedad */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">Antigüedad</p>
                </div>
                <p className="text-base font-semibold text-foreground">
                  {course.Antiguedad || "N/A"}
                </p>
              </div>

              {/* Ciudad */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">Ciudad</p>
                </div>
                <p className="text-base font-semibold text-foreground">
                  {course.Ciudad || "N/A"}
                </p>
              </div>

              {/* Proyecto */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">Proyecto</p>
                </div>
                <p className="text-base font-semibold text-foreground truncate">
                  {course.Proyecto || "N/A"}
                </p>
              </div>

              {/* Estado */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">Estado</p>
                </div>
                <p className="text-base font-semibold text-foreground">
                  {course.Estado || "N/A"}
                </p>
              </div>

              {/* Lugar */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">Lugar</p>
                </div>
                <p className="text-base font-semibold text-foreground truncate">
                  {course.Lugar || "N/A"}
                </p>
              </div>

              {/* CC (Centro de Costo) */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">C. Costo</p>
                </div>
                <p className="text-base font-semibold text-foreground">
                  {course.CC || "N/A"}
                </p>
              </div>

              {/* Cargo */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">Cargo</p>
                </div>
                <p className="text-base font-semibold text-foreground truncate">
                  {course.Cargo || "N/A"}
                </p>
              </div>

              {/* Aplica Eficiencia */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">Eficiencia</p>
                </div>
                <p className="text-base font-semibold text-foreground">
                  {course.AplicaEficiencia ? "Sí" : "No"}
                </p>
              </div>

              {/* Classification */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">Clasificación</p>
                </div>
                <p className="text-base font-semibold text-foreground truncate">
                  {course.Clasificacion || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
            <DialogDescription>
              Modifica la información del curso. Los cambios se guardarán al
              confirmar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                value={editForm.nombre}
                onChange={(e) =>
                  setEditForm({ ...editForm, nombre: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entidad" className="text-right">
                Entidad
              </Label>
              <Input
                id="entidad"
                value={editForm.entidad}
                onChange={(e) =>
                  setEditForm({ ...editForm, entidad: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="horas" className="text-right">
                Horas
              </Label>
              <Input
                id="horas"
                type="number"
                value={editForm.horas}
                onChange={(e) =>
                  setEditForm({ ...editForm, horas: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modalidad" className="text-right">
                Modalidad
              </Label>
              <Input
                id="modalidad"
                value={editForm.modalidad}
                onChange={(e) =>
                  setEditForm({ ...editForm, modalidad: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="programacion" className="text-right">
                Programación
              </Label>
              <Input
                id="programacion"
                placeholder="MM/YY"
                value={editForm.programacion}
                onChange={(e) =>
                  setEditForm({ ...editForm, programacion: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="antiguedad" className="text-right">
                Antigüedad
              </Label>
              <Input
                id="antiguedad"
                value={editForm.antiguedad}
                onChange={(e) =>
                  setEditForm({ ...editForm, antiguedad: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ciudad" className="text-right">
                Ciudad
              </Label>
              <Input
                id="ciudad"
                value={editForm.ciudad}
                onChange={(e) =>
                  setEditForm({ ...editForm, ciudad: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clasificacion" className="text-right">
                Clasificación
              </Label>
              <Input
                id="clasificacion"
                value={editForm.clasificacion}
                onChange={(e) =>
                  setEditForm({ ...editForm, clasificacion: e.target.value })
                }
                className="col-span-3"
              />
            </div>
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

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el curso "{course.Nombre}"?
              <br />
              <span className="text-destructive font-medium">
                Esta acción no se puede deshacer.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
