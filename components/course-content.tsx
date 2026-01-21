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
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Course Description */}
      <div>
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Descripción del Curso
          </h2>
        </div>
        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
          {course.Texto || "No hay descripción disponible"}
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
    </div>
  );
}
