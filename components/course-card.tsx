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
  MoreVertical,
  MessageCircleQuestion,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseCardProps {
  course: Course;
}

// Static data for now - will be replaced with actual data later
const getCourseStaticData = (courseId: number) => ({
  totalPreguntas: 15,
  entidad: "Instituto Nacional de Capacitación",
  horas: 40,
  modalidad: "Virtual",
  programacion: "07/22", // MM/YY format
  antiguedad: "2 años",
  clasificacion: "Capacitación Técnica - Desarrollo Profesional",
  ciudad: "Bogotá",
});

export function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();
  const staticData = getCourseStaticData(course.Id);

  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states for edit modal
  const [editForm, setEditForm] = useState({
    nombre: course.Nombre,
    entidad: staticData.entidad,
    horas: staticData.horas.toString(),
    modalidad: staticData.modalidad,
    programacion: staticData.programacion,
    antiguedad: staticData.antiguedad,
    clasificacion: staticData.clasificacion,
    ciudad: staticData.ciudad,
  });

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
                {course.Nombre}
              </CardTitle>
              <Badge variant="secondary" className="text-sm">
                ID: {course.Id}
              </Badge>
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

        <CardContent className="py-0">
          {/* Course Information - Ultra Compact */}
          <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-sm">
            {/* Row 1: Total Preguntas y Entidad */}
            <div className="flex items-center gap-1">
              <MessageCircleQuestion className="w-3 h-3 text-primary shrink-0" />
              <span className="text-muted-foreground">Preguntas:</span>
              <span className="text-foreground font-medium">
                {course.preguntas?.length || staticData.totalPreguntas}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-primary shrink-0" />
              <span className="text-foreground font-medium truncate">
                {staticData.entidad}
              </span>
            </div>

            {/* Row 2: Horas y Modalidad */}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-primary shrink-0" />
              <span className="text-muted-foreground">Horas:</span>
              <span className="text-foreground font-medium">
                {staticData.horas}h
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Monitor className="w-3 h-3 text-primary shrink-0" />
              <span className="text-muted-foreground">Modalidad:</span>
              <span className="text-foreground font-medium">
                {staticData.modalidad}
              </span>
            </div>

            {/* Row 3: Programación y Antigüedad */}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-primary shrink-0" />
              <span className="text-muted-foreground">Prog:</span>
              <span className="text-foreground font-medium">
                {staticData.programacion}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-primary shrink-0" />
              <span className="text-muted-foreground">Antigüedad:</span>
              <span className="text-foreground font-medium">
                {staticData.antiguedad}
              </span>
            </div>

            {/* Row 4: Ciudad */}
            <div className="flex items-center gap-1 col-span-2">
              <Building2 className="w-3 h-3 text-primary shrink-0" />
              <span className="text-muted-foreground">Ciudad:</span>
              <span className="text-foreground font-medium">
                {staticData.ciudad}
              </span>
            </div>
          </div>

          {/* Classification - Single Line */}
          <div className="mt-2 pt-2 border-t border-muted/50 text-sm">
            <div className="text-muted-foreground truncate">
              <strong>Clasificación:</strong> {staticData.clasificacion}
            </div>
          </div>
        </CardContent>
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
