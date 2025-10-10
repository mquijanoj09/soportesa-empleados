"use client";

import { useEffect } from "react";
import type { Course } from "@/types";
import { CourseList } from "@/components/course-list";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCourse } from "../context/useCourse";

export default function HomePage() {
  const { state, actions } = useCourse();

  useEffect(() => {
    actions.fetchAllCourses();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-3xl bg-primary shadow-lg">
              <Image
                src="/capacitaciones-icon.svg"
                alt="Capacitaciones Icon"
                width={80}
                height={80}
                className="filter brightness-0 invert"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Gestión de Capacitaciones
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Administración de cursos, programas de formación y desarrollo
            profesional
          </p>
        </div>

        {/* Course List */}
        <CourseList />
      </div>
    </div>
  );
}
