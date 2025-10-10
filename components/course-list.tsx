"use client";

import { CourseCard } from "./course-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";
import { useCourse } from "@/app/context/useCourse";

type SortOption = "name-asc" | "name-desc" | "id-asc" | "id-desc";

interface FilterValues {
  entidad: string;
  modalidad: string;
  ciudad: string;
  proyecto: string;
  estado: string;
  cargo: string;
  clasificacion: string;
}

export function CourseList() {
  const { state, actions } = useCourse();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("id-desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(50);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    entidad: "",
    modalidad: "",
    ciudad: "",
    proyecto: "",
    estado: "",
    cargo: "",
    clasificacion: "",
  });

  // Fetch all courses on mount for filtering/searching
  useEffect(() => {
    actions.fetchAllCourses();
  }, []);

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    const allCourses = state.courses;
    return {
      entidades: [...new Set(allCourses.map((c) => c.Entidad).filter(Boolean))],
      modalidades: [
        ...new Set(allCourses.map((c) => c.Modalidad).filter(Boolean)),
      ],
      ciudades: [...new Set(allCourses.map((c) => c.Ciudad).filter(Boolean))],
      proyectos: [
        ...new Set(allCourses.map((c) => c.Proyecto).filter(Boolean)),
      ],
      estados: [...new Set(allCourses.map((c) => c.Estado).filter(Boolean))],
      cargos: [...new Set(allCourses.map((c) => c.Cargo).filter(Boolean))],
      clasificaciones: [
        ...new Set(allCourses.map((c) => c.Clasificacion).filter(Boolean)),
      ],
    };
  }, [state.courses]);

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let result = state.courses;

    // Apply search filter
    if (searchTerm) {
      result = result.filter((course) => {
        const courseName = (course.Nombre || course.Curso || "").toLowerCase();
        const entidad = (course.Entidad || "").toLowerCase();
        const proyecto = (course.Proyecto || "").toLowerCase();
        const search = searchTerm.toLowerCase();

        return (
          courseName.includes(search) ||
          entidad.includes(search) ||
          proyecto.includes(search)
        );
      });
    }

    // Apply filters
    if (filters.entidad) {
      result = result.filter((course) => course.Entidad === filters.entidad);
    }
    if (filters.modalidad) {
      result = result.filter(
        (course) => course.Modalidad === filters.modalidad
      );
    }
    if (filters.ciudad) {
      result = result.filter((course) => course.Ciudad === filters.ciudad);
    }
    if (filters.proyecto) {
      result = result.filter((course) => course.Proyecto === filters.proyecto);
    }
    if (filters.estado) {
      result = result.filter((course) => course.Estado === filters.estado);
    }
    if (filters.cargo) {
      result = result.filter((course) => course.Cargo === filters.cargo);
    }
    if (filters.clasificacion) {
      result = result.filter(
        (course) => course.Clasificacion === filters.clasificacion
      );
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return (a.Nombre || a.Curso || "").localeCompare(
            b.Nombre || b.Curso || ""
          );
        case "name-desc":
          return (b.Nombre || b.Curso || "").localeCompare(
            a.Nombre || a.Curso || ""
          );
        case "id-asc":
          return a.Id - b.Id;
        case "id-desc":
          return b.Id - a.Id;
        default:
          return 0;
      }
    });

    return result;
  }, [state.courses, searchTerm, filters, sortOption]);

  const handleClearFilters = () => {
    setFilters({
      entidad: "",
      modalidad: "",
      ciudad: "",
      proyecto: "",
      estado: "",
      cargo: "",
      clasificacion: "",
    });
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== ""
  ).length;

  // Load more courses callback
  const loadMoreCourses = useCallback(() => {
    if (displayCount < filteredAndSortedCourses.length) {
      setDisplayCount((prev) =>
        Math.min(prev + 50, filteredAndSortedCourses.length)
      );
    }
  }, [displayCount, filteredAndSortedCourses.length]);

  // Reset display count when filters or search changes
  useEffect(() => {
    setDisplayCount(50);
  }, [searchTerm, filters, sortOption]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !state.loading) {
          loadMoreCourses();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreCourses, state.loading]);

  // Get the courses to display (limited by displayCount)
  const displayedCourses = useMemo(() => {
    return filteredAndSortedCourses.slice(0, displayCount);
  }, [filteredAndSortedCourses, displayCount]);

  const hasMore = displayCount < filteredAndSortedCourses.length;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar cursos por nombre, entidad o proyecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort Dropdown */}
        <Select
          value={sortOption}
          onValueChange={(value) => setSortOption(value as SortOption)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id-desc">ID (Mayor a Menor)</SelectItem>
            <SelectItem value="id-asc">ID (Menor a Mayor)</SelectItem>
            <SelectItem value="name-asc">Nombre (A-Z)</SelectItem>
            <SelectItem value="name-desc">Nombre (Z-A)</SelectItem>
          </SelectContent>
        </Select>

        {/* Filters Button */}
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Filtrar Cursos</DialogTitle>
              <DialogDescription>
                Selecciona los criterios para filtrar los cursos
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Entidad Filter */}
              <div className="grid gap-2">
                <Label htmlFor="entidad">Entidad</Label>
                <Select
                  value={filters.entidad === "" ? "all" : filters.entidad}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      entidad: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger id="entidad">
                    <SelectValue placeholder="Todas las entidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las entidades</SelectItem>
                    {filterOptions.entidades.map((entidad) => (
                      <SelectItem key={entidad} value={entidad}>
                        {entidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Modalidad Filter */}
              <div className="grid gap-2">
                <Label htmlFor="modalidad">Modalidad</Label>
                <Select
                  value={filters.modalidad === "" ? "all" : filters.modalidad}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      modalidad: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger id="modalidad">
                    <SelectValue placeholder="Todas las modalidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las modalidades</SelectItem>
                    {filterOptions.modalidades.map((modalidad) => (
                      <SelectItem key={modalidad} value={modalidad}>
                        {modalidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ciudad Filter */}
              <div className="grid gap-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Select
                  value={filters.ciudad === "" ? "all" : filters.ciudad}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      ciudad: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger id="ciudad">
                    <SelectValue placeholder="Todas las ciudades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ciudades</SelectItem>
                    {filterOptions.ciudades.map((ciudad) => (
                      <SelectItem key={ciudad} value={ciudad}>
                        {ciudad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Proyecto Filter */}
              <div className="grid gap-2">
                <Label htmlFor="proyecto">Proyecto</Label>
                <Select
                  value={filters.proyecto === "" ? "all" : filters.proyecto}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      proyecto: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger id="proyecto">
                    <SelectValue placeholder="Todos los proyectos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los proyectos</SelectItem>
                    {filterOptions.proyectos.map((proyecto) => (
                      <SelectItem key={proyecto} value={proyecto}>
                        {proyecto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Estado Filter */}
              <div className="grid gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={filters.estado === "" ? "all" : filters.estado}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      estado: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    {filterOptions.estados.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cargo Filter */}
              <div className="grid gap-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Select
                  value={filters.cargo === "" ? "all" : filters.cargo}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      cargo: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger id="cargo">
                    <SelectValue placeholder="Todos los cargos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los cargos</SelectItem>
                    {filterOptions.cargos.map((cargo) => (
                      <SelectItem key={cargo} value={cargo}>
                        {cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clasificación Filter */}
              <div className="grid gap-2">
                <Label htmlFor="clasificacion">Clasificación</Label>
                <Select
                  value={
                    filters.clasificacion === "" ? "all" : filters.clasificacion
                  }
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      clasificacion: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger id="clasificacion">
                    <SelectValue placeholder="Todas las clasificaciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      Todas las clasificaciones
                    </SelectItem>
                    {filterOptions.clasificaciones.map((clasificacion) => (
                      <SelectItem key={clasificacion} value={clasificacion}>
                        {clasificacion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar Filtros
              </Button>
              <Button type="button" onClick={() => setIsFilterOpen(false)}>
                Aplicar Filtros
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  <span className="font-medium capitalize">{key}:</span>
                  <span>{value}</span>
                  <button
                    onClick={() => setFilters({ ...filters, [key]: "" })}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Mostrando {filteredAndSortedCourses.length} cursos
        {(searchTerm || activeFiltersCount > 0) &&
          filteredAndSortedCourses.length !== state.courses.length &&
          ` (filtrado de ${state.courses.length} cursos totales)`}
      </div>

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
          {filteredAndSortedCourses.length > 0 ? (
            <>
              <div className="flex flex-col gap-3">
                {displayedCourses.map((course) => (
                  <CourseCard key={course.Id} course={course} />
                ))}
              </div>

              {/* Infinite Scroll Trigger */}
              {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                  <Spinner size="md" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Cargando más cursos...
                  </span>
                </div>
              )}

              {/* End of results indicator */}
              {!hasMore && displayedCourses.length > 50 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Has llegado al final de los resultados
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {searchTerm || activeFiltersCount > 0
                  ? "No se encontraron cursos que coincidan con los filtros aplicados."
                  : "No hay cursos disponibles."}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
