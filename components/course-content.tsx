"use client";

import { Course } from "@/types";
import React, { useState } from "react";
import { Edit, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";

interface CourseContentProps {
  course: Course;
}

export function CourseContent({ course }: CourseContentProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    texto: course.Texto,
    induccionVideo: course.InduccionVideo || "",
    induccionVideo2: course.InduccionVideo2 || "",
    induccionVideo3: course.InduccionVideo3 || "",
    induccionVideo4: course.InduccionVideo4 || "",
  });

  const handleEditSubmit = () => {
    // TODO: Implement actual edit functionality
    toast.success(
      "Contenido del curso actualizado (funcionalidad en desarrollo)"
    );
    setIsEditOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Course Description */}
      <div>
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Descripción del Curso
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
        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
          {course.Texto}
        </p>
      </div>

      {/* Video Resources */}
      {(course.InduccionVideo ||
        course.InduccionVideo2 ||
        course.InduccionVideo3 ||
        course.InduccionVideo4) && (
        <div>
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Recursos de Inducción
            </h2>
          </div>
          <div className="space-y-3">
            {course.InduccionVideo && (
              <a
                href={course.InduccionVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 sm:p-4 bg-card border border-border rounded-lg text-primary hover:bg-muted transition-colors group"
              >
                <span className="text-lg sm:text-xl">📹</span>
                <span className="font-medium flex-1 text-sm sm:text-base">
                  Recurso de Inducción 1
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            )}
            {course.InduccionVideo2 && (
              <a
                href={course.InduccionVideo2}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg text-primary hover:bg-muted transition-colors group"
              >
                <span className="text-xl">📹</span>
                <span className="font-medium flex-1">
                  Recurso de Inducción 2
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            )}
            {course.InduccionVideo3 && (
              <a
                href={course.InduccionVideo3}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg text-primary hover:bg-muted transition-colors group"
              >
                <span className="text-xl">📹</span>
                <span className="font-medium flex-1">
                  Recurso de Inducción 3
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            )}
            {course.InduccionVideo4 && (
              <a
                href={course.InduccionVideo4}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg text-primary hover:bg-muted transition-colors group"
              >
                <span className="text-xl">📹</span>
                <span className="font-medium flex-1">
                  Recurso de Inducción 4
                </span>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Edit Content Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Contenido del Curso</DialogTitle>
            <DialogDescription>
              Modifica la descripción y recursos de inducción del curso.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="texto">Descripción del Curso</Label>
              <textarea
                id="texto"
                value={editForm.texto}
                onChange={(e) =>
                  setEditForm({ ...editForm, texto: e.target.value })
                }
                className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Ingresa la descripción del curso..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="induccionVideo">Recurso de Inducción 1</Label>
              <Input
                id="induccionVideo"
                type="url"
                value={editForm.induccionVideo}
                onChange={(e) =>
                  setEditForm({ ...editForm, induccionVideo: e.target.value })
                }
                placeholder="https://ejemplo.com/video1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="induccionVideo2">Recurso de Inducción 2</Label>
              <Input
                id="induccionVideo2"
                type="url"
                value={editForm.induccionVideo2}
                onChange={(e) =>
                  setEditForm({ ...editForm, induccionVideo2: e.target.value })
                }
                placeholder="https://ejemplo.com/video2"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="induccionVideo3">Recurso de Inducción 3</Label>
              <Input
                id="induccionVideo3"
                type="url"
                value={editForm.induccionVideo3}
                onChange={(e) =>
                  setEditForm({ ...editForm, induccionVideo3: e.target.value })
                }
                placeholder="https://ejemplo.com/video3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="induccionVideo4">Recurso de Inducción 4</Label>
              <Input
                id="induccionVideo4"
                type="url"
                value={editForm.induccionVideo4}
                onChange={(e) =>
                  setEditForm({ ...editForm, induccionVideo4: e.target.value })
                }
                placeholder="https://ejemplo.com/video4"
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
    </div>
  );
}
