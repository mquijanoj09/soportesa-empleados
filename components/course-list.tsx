"use client";

import { CourseCard } from "./course-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useCourse } from "@/app/context/useCourse";

export function CourseList() {
  const { state, actions } = useCourse();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = useMemo(() => {
    return state.courses.filter((course) => {
      const matchesSearch = course.Nombre.toLowerCase().includes(
        searchTerm.toLowerCase()
      );

      return matchesSearch;
    });
  }, [state.courses, searchTerm]);

  const handlePageChange = async (page: number) => {
    await actions.fetchCourses(page);
    // Smooth scroll to top after page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      {/* <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar cursos por nombre, entidad o proyecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div> */}

      {/* Results Count */}
      {state.pagination && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredCourses.length} de {state.pagination.totalCourses}{" "}
          cursos
          {searchTerm &&
            ` (filtrados de ${state.courses.length} en esta página)`}
          {state.pagination.totalPages > 1 && (
            <span className="ml-2">
              - Página {state.pagination.currentPage} de{" "}
              {state.pagination.totalPages}
            </span>
          )}
        </div>
      )}

      {/* Loading Spinner */}
      {state.loading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Spinner size="lg" />
            <p className="text-muted-foreground">Cargando cursos...</p>
          </div>
        </div>
      )}

      {/* Course Grid */}
      {!state.loading && (
        <>
          {filteredCourses.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredCourses.map((course) => (
                <CourseCard key={course.Id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {searchTerm
                  ? "No se encontraron cursos que coincidan con los filtros aplicados."
                  : "No hay cursos disponibles en esta página."}
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {state.pagination && state.pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePageChange(state.pagination!.currentPage - 1)
                }
                disabled={!state.pagination.hasPrevPage || state.loading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>

              <div className="flex items-center space-x-2">
                {(() => {
                  const currentPage = state.pagination!.currentPage;
                  const totalPages = state.pagination!.totalPages;
                  const pages = [];

                  // Show first page if not current and not adjacent
                  if (currentPage > 2) {
                    pages.push(
                      <Button
                        key={1}
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        disabled={state.loading}
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
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={state.loading}
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
                      onClick={() => handlePageChange(currentPage)}
                      disabled={state.loading}
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
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={state.loading}
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
                        onClick={() => handlePageChange(totalPages)}
                        disabled={state.loading}
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
                onClick={() =>
                  handlePageChange(state.pagination!.currentPage + 1)
                }
                disabled={!state.pagination.hasNextPage || state.loading}
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
