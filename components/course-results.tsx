"use client";

import { Course, Capacitacion } from "@/types";
import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Mail,
  ChevronLeft,
  ChevronRight,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseResultsProps {
  course: Course;
}

export function CourseResults({ course }: CourseResultsProps) {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    fetchCapacitaciones();
  }, [course.Id, currentPage]);

  const fetchCapacitaciones = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/capacitaciones?courseId=${course.Id}&page=${currentPage}&limit=25`
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Error al cargar los resultados");
      }

      const data = await response.json();
      setCapacitaciones(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalRecords(data.pagination?.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching capacitaciones:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al cargar los resultados del curso"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  if (capacitaciones.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium mb-2">
            No hay resultados disponibles
          </h3>
          <p>No se encontraron registros para este curso.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Resultados del Curso
          </h2>
        </div>
        <Badge variant="secondary">
          {totalRecords} registro
          {totalRecords !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Mobile Cards View */}
      <div className="block lg:hidden space-y-4">
        {capacitaciones.map((cap) => (
          <div
            key={cap.Id}
            className="border border-border rounded-lg p-4 space-y-3 bg-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-foreground">
                  {cap.NombreCompleto}
                </p>
                <p className="text-sm text-muted-foreground">ID: {cap.Id}</p>
                <p className="text-sm text-muted-foreground">
                  Cédula: {cap.Cedula}
                </p>
              </div>
              {cap.Graduado && (
                <Badge variant="default" className="bg-green-500">
                  Graduado
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Realizado:</span>
                <div className="flex items-center gap-1">
                  {cap.Realizado ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Impreso:</span>
                <div className="flex items-center gap-1">
                  {cap.Impreso ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Nota:</span>
                <span className="font-medium"> {cap.Nota}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Envíos:</span>
                <span className="font-medium"> {cap.totalEnvios}</span>
              </div>
            </div>

            <div className="pt-2 border-t text-xs text-muted-foreground">
              <p>Terminación: {formatDate(cap["Fecha de terminacion"])}</p>
              {cap.FechaUltimoEmail && (
                <p>Último email: {formatDate(cap.FechaUltimoEmail)}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Cédula</th>
              <th className="px-4 py-3 text-left font-semibold">Nombre</th>
              <th className="px-4 py-3 text-center font-semibold">Realizado</th>
              <th className="px-4 py-3 text-center font-semibold">Graduado</th>
              <th className="px-4 py-3 text-center font-semibold">Impreso</th>
              <th className="px-4 py-3 text-center font-semibold">Nota</th>
              <th className="px-4 py-3 text-left font-semibold">Fecha Term.</th>
              <th className="px-4 py-3 text-center font-semibold">Correo</th>
              <th className="px-4 py-3 text-left font-semibold">
                Último Email
              </th>
              <th className="px-4 py-3 text-center font-semibold">Envíos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {capacitaciones.map((cap) => (
              <tr key={cap.Id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">{cap.Id}</td>
                <td className="px-4 py-3">{cap.Cedula}</td>
                <td className="px-4 py-3 font-medium">{cap.NombreCompleto}</td>
                <td className="px-4 py-3 text-center">
                  {cap.Realizado ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {cap.Graduado ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {cap.Impreso ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center font-semibold">
                  {cap.Nota}
                </td>
                <td className="px-4 py-3">
                  {formatDate(cap["Fecha de terminacion"])}
                </td>
                <td className="px-4 py-3 text-center">
                  {cap.CorreoEnviado ? (
                    <Mail className="w-5 h-5 text-blue-600 mx-auto" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3">
                  {formatDate(cap.FechaUltimoEmail)}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge variant="outline">{cap.totalEnvios}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>

          <div className="flex items-center space-x-2">
            {(() => {
              const pages = [];

              // Show first page if not current and not adjacent
              if (currentPage > 2) {
                pages.push(
                  <Button
                    key={1}
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={loading}
                  >
                    1
                  </Button>
                );

                // Show ellipsis if there's a gap
                if (currentPage > 3) {
                  pages.push(
                    <span
                      key="ellipsis-start"
                      className="px-2 text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                }
              }

              // Show previous page
              if (currentPage > 1) {
                pages.push(
                  <Button
                    key={currentPage - 1}
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={loading}
                  >
                    {currentPage - 1}
                  </Button>
                );
              }

              // Show current page
              pages.push(
                <Button
                  key={currentPage}
                  variant="default"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage)}
                  disabled={loading}
                >
                  {currentPage}
                </Button>
              );

              // Show next page
              if (currentPage < totalPages) {
                pages.push(
                  <Button
                    key={currentPage + 1}
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={loading}
                  >
                    {currentPage + 1}
                  </Button>
                );
              }

              // Show last page if not current and not adjacent
              if (currentPage < totalPages - 1) {
                // Show ellipsis if there's a gap
                if (currentPage < totalPages - 2) {
                  pages.push(
                    <span
                      key="ellipsis-end"
                      className="px-2 text-muted-foreground"
                    >
                      ...
                    </span>
                  );
                }

                pages.push(
                  <Button
                    key={totalPages}
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={loading}
                  >
                    {totalPages}
                  </Button>
                );
              }

              return pages;
            })()}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
