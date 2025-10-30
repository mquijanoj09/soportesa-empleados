"use client";

import { Course, Capacitacion } from "@/types";
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Mail,
  Search,
  Users,
  UserCheck,
  UserX,
  UserMinus,
  Filter,
  ArrowUpDown,
  X as XIcon,
  Send,
  Download,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type SortOption =
  | "id-asc"
  | "id-desc"
  | "nombre-asc"
  | "nombre-desc"
  | "nota-asc"
  | "nota-desc";

interface FilterValues {
  realizado: string;
  graduado: string;
  impreso: string;
}

interface CourseResultsProps {
  course: Course;
}

export function CourseResults({ course }: CourseResultsProps) {
  const [allCapacitaciones, setAllCapacitaciones] = useState<Capacitacion[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("id-desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(50);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    realizado: "",
    graduado: "",
    impreso: "",
  });

  // Email modal states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailOption, setEmailOption] = useState<
    "no-graduados" | "specific" | null
  >(null);
  const [selectedEmails, setSelectedEmails] = useState<Set<number>>(new Set());
  const [isSelectingEmails, setIsSelectingEmails] = useState(false);

  // Certificate modal states
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateOption, setCertificateOption] = useState<
    "todos-no-impresos" | "todos-graduados" | "specific" | null
  >(null);
  const [selectedCertificates, setSelectedCertificates] = useState<Set<number>>(
    new Set()
  );
  const [isSelectingCertificates, setIsSelectingCertificates] = useState(false);

  // Filter capacitaciones based on search term and filters
  const filteredCapacitaciones = useMemo(() => {
    let result = allCapacitaciones;

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter((cap) => {
        const id = cap.Id?.toString() || "";
        const cedula = cap.Cedula?.toLowerCase() || "";
        const nombre = cap.NombreCompleto?.toLowerCase() || "";
        const lugarActual = cap["Lugar actual"]?.toLowerCase() || "";

        return (
          id.includes(search) ||
          cedula.includes(search) ||
          nombre.includes(search) ||
          lugarActual.includes(search)
        );
      });
    }

    // Apply filters
    if (filters.realizado) {
      const filterValue = filters.realizado === "true";
      result = result.filter((cap) => cap.Realizado === filterValue);
    }
    if (filters.graduado) {
      const filterValue = filters.graduado === "true";
      result = result.filter((cap) => cap.Graduado === filterValue);
    }
    if (filters.impreso) {
      const filterValue = filters.impreso === "true";
      result = result.filter((cap) => cap.Impreso === filterValue);
    }

    return result;
  }, [allCapacitaciones, searchTerm, filters]);

  // Sort filtered capacitaciones
  const sortedCapacitaciones = useMemo(() => {
    return [...filteredCapacitaciones].sort((a, b) => {
      switch (sortOption) {
        case "id-asc":
          return a.Id - b.Id;
        case "id-desc":
          return b.Id - a.Id;
        case "nombre-asc":
          return (a.NombreCompleto || "").localeCompare(b.NombreCompleto || "");
        case "nombre-desc":
          return (b.NombreCompleto || "").localeCompare(a.NombreCompleto || "");
        case "nota-asc":
          return (a.Nota || 0) - (b.Nota || 0);
        case "nota-desc":
          return (b.Nota || 0) - (a.Nota || 0);
        default:
          return 0;
      }
    });
  }, [filteredCapacitaciones, sortOption]);

  // Get displayed capacitaciones (limited by displayCount)
  const displayedCapacitaciones = useMemo(() => {
    return sortedCapacitaciones.slice(0, displayCount);
  }, [sortedCapacitaciones, displayCount]);

  const hasMore = displayCount < sortedCapacitaciones.length;

  // Get non-graduated students for email modal
  const nonGraduatedStudents = useMemo(() => {
    return allCapacitaciones.filter((cap) => !cap.Graduado);
  }, [allCapacitaciones]);

  // Get graduated students for certificate modal
  const graduatedStudents = useMemo(() => {
    return allCapacitaciones.filter((cap) => cap.Graduado);
  }, [allCapacitaciones]);

  // Get graduated students with non-printed certificates
  const nonPrintedStudents = useMemo(() => {
    return allCapacitaciones.filter((cap) => cap.Graduado && !cap.Impreso);
  }, [allCapacitaciones]);

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== ""
  ).length;

  const handleClearFilters = () => {
    setFilters({
      realizado: "",
      graduado: "",
      impreso: "",
    });
  };

  // Email handling functions
  const handleEmailOptionChange = (option: "no-graduados" | "specific") => {
    setEmailOption(option);
    setSelectedEmails(new Set());
    setIsSelectingEmails(option === "specific");
  };

  const toggleEmailSelection = (capacitacionId: number) => {
    const newSelection = new Set(selectedEmails);
    if (newSelection.has(capacitacionId)) {
      newSelection.delete(capacitacionId);
    } else {
      newSelection.add(capacitacionId);
    }
    setSelectedEmails(newSelection);
  };

  const selectAllNonGraduated = () => {
    const nonGraduated = allCapacitaciones
      .filter((cap) => !cap.Graduado)
      .map((cap) => cap.Id);
    setSelectedEmails(new Set(nonGraduated));
  };

  const clearEmailSelection = () => {
    setSelectedEmails(new Set());
  };

  const handleSendEmails = () => {
    let emailsToSend: string[] = [];

    if (emailOption === "no-graduados") {
      // Send to all non-graduated students
      const nonGraduatedEmails = allCapacitaciones
        .filter((cap) => !cap.Graduado)
        .map((cap) => `${cap.NombreCompleto} (${cap.Cedula})`)
        .filter(Boolean);
      emailsToSend = nonGraduatedEmails;

      console.log("Enviando correo a todos los NO GRADUADOS:");
      console.log("Total de destinatarios:", nonGraduatedEmails.length);
      console.log("Destinatarios:", nonGraduatedEmails);
    } else if (emailOption === "specific") {
      // Send to specific selected students
      const specificEmails = allCapacitaciones
        .filter((cap) => selectedEmails.has(cap.Id))
        .map((cap) => `${cap.NombreCompleto} (${cap.Cedula})`)
        .filter(Boolean);
      emailsToSend = specificEmails;

      console.log("Enviando correo a empleados específicos:");
      console.log("Total de destinatarios:", specificEmails.length);
      console.log("Destinatarios:", specificEmails);
    }

    if (emailsToSend.length > 0) {
      toast.success(
        `Correos enviados exitosamente a ${emailsToSend.length} destinatario${
          emailsToSend.length !== 1 ? "s" : ""
        }`
      );
    } else {
      toast.error("No se seleccionaron destinatarios para enviar el correo");
    }

    // Reset modal state
    setIsEmailModalOpen(false);
    setEmailOption(null);
    setSelectedEmails(new Set());
    setIsSelectingEmails(false);
  };

  const resetEmailModal = () => {
    setEmailOption(null);
    setSelectedEmails(new Set());
    setIsSelectingEmails(false);
  };

  // Certificate handling functions
  const handleCertificateOptionChange = (
    option: "todos-no-impresos" | "todos-graduados" | "specific"
  ) => {
    setCertificateOption(option);
    setSelectedCertificates(new Set());
    setIsSelectingCertificates(option === "specific");
  };

  const toggleCertificateSelection = (capacitacionId: number) => {
    const newSelection = new Set(selectedCertificates);
    if (newSelection.has(capacitacionId)) {
      newSelection.delete(capacitacionId);
    } else {
      newSelection.add(capacitacionId);
    }
    setSelectedCertificates(newSelection);
  };

  const selectAllGraduated = () => {
    const graduated = allCapacitaciones
      .filter((cap) => cap.Graduado)
      .map((cap) => cap.Id);
    setSelectedCertificates(new Set(graduated));
  };

  const clearCertificateSelection = () => {
    setSelectedCertificates(new Set());
  };

  const handleDownloadCertificates = () => {
    let certificatesToDownload: string[] = [];

    if (certificateOption === "todos-no-impresos") {
      // Download for all graduated students with non-printed certificates
      const nonPrintedCertificates = allCapacitaciones
        .filter((cap) => cap.Graduado && !cap.Impreso)
        .map((cap) => `${cap.NombreCompleto} (${cap.Cedula})`)
        .filter(Boolean);
      certificatesToDownload = nonPrintedCertificates;

      console.log("Descargando certificados de todos los NO IMPRESOS:");
      console.log("Total de certificados:", nonPrintedCertificates.length);
      console.log("No impresos:", nonPrintedCertificates);
    } else if (certificateOption === "todos-graduados") {
      // Download for all graduated students
      const graduatedCertificates = allCapacitaciones
        .filter((cap) => cap.Graduado)
        .map((cap) => `${cap.NombreCompleto} (${cap.Cedula})`)
        .filter(Boolean);
      certificatesToDownload = graduatedCertificates;

      console.log("Descargando certificados de todos los GRADUADOS:");
      console.log("Total de certificados:", graduatedCertificates.length);
      console.log("Graduados:", graduatedCertificates);
    } else if (certificateOption === "specific") {
      // Download for specific selected students
      const specificCertificates = allCapacitaciones
        .filter((cap) => selectedCertificates.has(cap.Id) && cap.Graduado)
        .map((cap) => `${cap.NombreCompleto} (${cap.Cedula})`)
        .filter(Boolean);
      certificatesToDownload = specificCertificates;

      console.log("Descargando certificados de empleados específicos:");
      console.log("Total de certificados:", specificCertificates.length);
      console.log("Empleados:", specificCertificates);
    }

    if (certificatesToDownload.length > 0) {
      toast.success(
        `Certificados descargados exitosamente para ${
          certificatesToDownload.length
        } empleado${certificatesToDownload.length !== 1 ? "s" : ""}`
      );
    } else {
      toast.error(
        "No se seleccionaron empleados graduados para descargar certificados"
      );
    }

    // Reset modal state
    setIsCertificateModalOpen(false);
    setCertificateOption(null);
    setSelectedCertificates(new Set());
    setIsSelectingCertificates(false);
  };

  const resetCertificateModal = () => {
    setCertificateOption(null);
    setSelectedCertificates(new Set());
    setIsSelectingCertificates(false);
  };

  // Calculate chart data from ALL capacitaciones
  const chartData = useMemo(() => {
    const passed = allCapacitaciones.filter((cap) => cap.Graduado).length;
    const failed = allCapacitaciones.filter(
      (cap) => !cap.Graduado && cap.Realizado
    ).length;
    const notPresented = allCapacitaciones.filter(
      (cap) => !cap.Realizado
    ).length;
    const total = allCapacitaciones.length;

    return [
      {
        name: "Aprobaron",
        value: passed,
        percentage: total > 0 ? ((passed / total) * 100).toFixed(1) : "0",
        color: "#10B981",
        icon: UserCheck,
      },
      {
        name: "Reprobaron",
        value: failed,
        percentage: total > 0 ? ((failed / total) * 100).toFixed(1) : "0",
        color: "#EF4444",
        icon: UserX,
      },
      {
        name: "No presentaron",
        value: notPresented,
        percentage: total > 0 ? ((notPresented / total) * 100).toFixed(1) : "0",
        color: "#6B7280",
        icon: UserMinus,
      },
    ].filter((item) => item.value > 0);
  }, [allCapacitaciones]);

  // Fetch all capacitaciones
  useEffect(() => {
    fetchAllCapacitaciones();
  }, []);

  // Load more capacitaciones callback
  const loadMoreCapacitaciones = useCallback(() => {
    if (displayCount < sortedCapacitaciones.length) {
      setDisplayCount((prev) =>
        Math.min(prev + 50, sortedCapacitaciones.length)
      );
    }
  }, [displayCount, sortedCapacitaciones.length]);

  // Reset display count when search or filters change
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
        if (entries[0].isIntersecting && !loading) {
          loadMoreCapacitaciones();
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
  }, [loadMoreCapacitaciones, loading]);

  const fetchAllCapacitaciones = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/capacitaciones?courseId=${course.Id}`);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Error al cargar las estadísticas");
      }

      const data = await response.json();
      setAllCapacitaciones(data.data || []);
    } catch (error) {
      console.error("Error fetching all capacitaciones:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al cargar las estadísticas del curso"
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

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} estudiante{data.value !== 1 ? "s" : ""} (
            {data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
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

  if (allCapacitaciones.length === 0) {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Resultados del Curso
          </h2>
        </div>
        <Badge variant="secondary">
          {sortedCapacitaciones.length} registros
          {(searchTerm || activeFiltersCount > 0) &&
            ` (filtrados de ${allCapacitaciones.length} totales)`}
        </Badge>
      </div>

      {/* Statistics Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Estadísticas del Curso
        </h3>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <Spinner size="lg" />
              <p className="text-muted-foreground">Cargando estadísticas...</p>
            </div>
          </div>
        ) : allCapacitaciones.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percentage }) => `${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Statistics Cards */}
            <div className="space-y-4">
              {chartData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <IconComponent
                        className="w-6 h-6"
                        style={{ color: item.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {item.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.value} estudiante{item.value !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-2xl font-bold"
                        style={{ color: item.color }}
                      >
                        {item.percentage}%
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Total */}
              <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg border">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">Total</h4>
                  <p className="text-sm text-muted-foreground">
                    Empleados registrados
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {allCapacitaciones.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No hay datos disponibles para mostrar estadísticas.
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Email Modal */}
        <Dialog
          open={isEmailModalOpen}
          onOpenChange={(open) => {
            setIsEmailModalOpen(open);
            if (!open) {
              resetEmailModal();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Enviar Correo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:min-w-fit w-full max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Enviar Correos Electrónicos</DialogTitle>
              <DialogDescription>
                Selecciona a quién deseas enviar los correos electrónicos
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Email Options */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Opciones de envío:
                </Label>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      id="no-graduados"
                      name="email-option"
                      value="no-graduados"
                      checked={emailOption === "no-graduados"}
                      onChange={() => handleEmailOptionChange("no-graduados")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="no-graduados"
                        className="font-medium cursor-pointer"
                      >
                        Todos los NO graduados
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Enviar correo a todos los empleados que no se graduaron
                        ({nonGraduatedStudents.length} empleados)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      id="specific"
                      name="email-option"
                      value="specific"
                      checked={emailOption === "specific"}
                      onChange={() => handleEmailOptionChange("specific")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="specific"
                        className="font-medium cursor-pointer"
                      >
                        Seleccionar empleados específicos
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Elige manualmente qué empleados recibirán el correo
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specific Student Selection */}
              {isSelectingEmails && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      Seleccionar empleados ({selectedEmails.size}{" "}
                      seleccionados)
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearEmailSelection}
                    >
                      Limpiar selección
                    </Button>
                  </div>

                  <div className="max-h-60 overflow-y-auto border rounded-lg">
                    {allCapacitaciones.length > 0 ? (
                      <div className="space-y-1 p-2">
                        {allCapacitaciones.map((cap) => (
                          <div
                            key={cap.Id}
                            className={`flex items-center space-x-3 p-2 rounded hover:bg-muted cursor-pointer ${
                              selectedEmails.has(cap.Id) ? "bg-primary/10" : ""
                            }`}
                            onClick={() => toggleEmailSelection(cap.Id)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedEmails.has(cap.Id)}
                              onChange={() => toggleEmailSelection(cap.Id)}
                              className="cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">
                                  {cap.NombreCompleto}
                                </p>
                                {cap.Graduado ? (
                                  <Badge
                                    variant="default"
                                    className="bg-green-500 text-xs"
                                  >
                                    Graduado
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    No graduado
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                ID: {cap.Id} | Cédula: {cap.Cedula} | Nota:{" "}
                                {cap.Nota || "N/A"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        No hay empleados disponibles
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Summary */}
              {emailOption && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Resumen:</h4>
                  {emailOption === "no-graduados" ? (
                    <p className="text-sm">
                      Se enviará el correo a{" "}
                      <strong>{nonGraduatedStudents.length}</strong> estudiante
                      {nonGraduatedStudents.length !== 1 ? "s" : ""} que no se
                      graduaron.
                    </p>
                  ) : (
                    <p className="text-sm">
                      Se enviará el correo a{" "}
                      <strong>{selectedEmails.size}</strong> estudiante
                      {selectedEmails.size !== 1 ? "s" : ""} seleccionados.
                    </p>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEmailModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleSendEmails}
                disabled={
                  !emailOption ||
                  (emailOption === "specific" && selectedEmails.size === 0)
                }
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Enviar Correos
                {emailOption === "no-graduados" &&
                  ` (${nonGraduatedStudents.length})`}
                {emailOption === "specific" && ` (${selectedEmails.size})`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Certificate Modal */}
        <Dialog
          open={isCertificateModalOpen}
          onOpenChange={(open) => {
            setIsCertificateModalOpen(open);
            if (!open) {
              resetCertificateModal();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" variant="outline">
              <Download className="w-4 h-4" />
              Descargar Certificados
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:min-w-fit w-full max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Descargar Certificados</DialogTitle>
              <DialogDescription>
                Selecciona qué certificados deseas descargar
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Certificate Options */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Opciones de descarga:
                </Label>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      id="todos-no-impresos"
                      name="certificate-option"
                      value="todos-no-impresos"
                      checked={certificateOption === "todos-no-impresos"}
                      onChange={() =>
                        handleCertificateOptionChange("todos-no-impresos")
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="todos-no-impresos"
                        className="font-medium cursor-pointer"
                      >
                        Todos los no impresos
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Descargar certificados de empleados graduados que no han
                        sido impresos ({nonPrintedStudents.length} empleados)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      id="todos-graduados"
                      name="certificate-option"
                      value="todos-graduados"
                      checked={certificateOption === "todos-graduados"}
                      onChange={() =>
                        handleCertificateOptionChange("todos-graduados")
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="todos-graduados"
                        className="font-medium cursor-pointer"
                      >
                        Todos los graduados
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Descargar certificados de todos los empleados graduados
                        ({graduatedStudents.length} empleados)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      id="specific-certificates"
                      name="certificate-option"
                      value="specific"
                      checked={certificateOption === "specific"}
                      onChange={() => handleCertificateOptionChange("specific")}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="specific-certificates"
                        className="font-medium cursor-pointer"
                      >
                        Seleccionar empleados específicos
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Elige manualmente qué empleados graduados tendrán sus
                        certificados descargados
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specific Student Selection */}
              {isSelectingCertificates && (
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      Seleccionar empleados graduados (
                      {selectedCertificates.size} seleccionados)
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearCertificateSelection}
                    >
                      Limpiar selección
                    </Button>
                  </div>

                  <div className="max-h-60 overflow-y-auto border rounded-lg">
                    {graduatedStudents.length > 0 ? (
                      <div className="space-y-1 p-2">
                        {graduatedStudents.map((cap) => (
                          <div
                            key={cap.Id}
                            className={`flex items-center space-x-3 p-2 rounded hover:bg-muted cursor-pointer ${
                              selectedCertificates.has(cap.Id)
                                ? "bg-primary/10"
                                : ""
                            }`}
                            onClick={() => toggleCertificateSelection(cap.Id)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedCertificates.has(cap.Id)}
                              onChange={() =>
                                toggleCertificateSelection(cap.Id)
                              }
                              className="cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">
                                  {cap.NombreCompleto}
                                </p>
                                <Badge
                                  variant="default"
                                  className="bg-green-500 text-xs"
                                >
                                  Graduado
                                </Badge>
                                {cap.Impreso ? (
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-blue-500 text-blue-600"
                                  >
                                    Impreso
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-orange-500 text-orange-600"
                                  >
                                    No Impreso
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                ID: {cap.Id} | Cédula: {cap.Cedula} | Nota:{" "}
                                {cap.Nota || "N/A"} | Lugar:{" "}
                                {cap["Lugar actual"]}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        No hay empleados graduados disponibles
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Summary */}
              {certificateOption && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Resumen:</h4>
                  {certificateOption === "todos-no-impresos" ? (
                    <p className="text-sm">
                      Se descargarán los certificados de{" "}
                      <strong>{nonPrintedStudents.length}</strong> empleado
                      {nonPrintedStudents.length !== 1 ? "s" : ""} graduados que
                      no han sido impresos.
                    </p>
                  ) : certificateOption === "todos-graduados" ? (
                    <p className="text-sm">
                      Se descargarán los certificados de{" "}
                      <strong>{graduatedStudents.length}</strong> empleado
                      {graduatedStudents.length !== 1 ? "s" : ""} graduados.
                    </p>
                  ) : (
                    <p className="text-sm">
                      Se descargarán los certificados de{" "}
                      <strong>{selectedCertificates.size}</strong> empleado
                      {selectedCertificates.size !== 1 ? "s" : ""}{" "}
                      seleccionados.
                    </p>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCertificateModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleDownloadCertificates}
                disabled={
                  !certificateOption ||
                  (certificateOption === "specific" &&
                    selectedCertificates.size === 0)
                }
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar Certificados
                {certificateOption === "todos-no-impresos" &&
                  ` (${nonPrintedStudents.length})`}
                {certificateOption === "todos-graduados" &&
                  ` (${graduatedStudents.length})`}
                {certificateOption === "specific" &&
                  ` (${selectedCertificates.size})`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search, Sort, and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por ID, cédula, lugar actual o nombre..."
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
            <SelectItem value="nombre-asc">Nombre (A-Z)</SelectItem>
            <SelectItem value="nombre-desc">Nombre (Z-A)</SelectItem>
            <SelectItem value="nota-desc">Nota (Mayor a Menor)</SelectItem>
            <SelectItem value="nota-asc">Nota (Menor a Mayor)</SelectItem>
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
              <DialogTitle>Filtrar Resultados</DialogTitle>
              <DialogDescription>
                Selecciona los criterios para filtrar los resultados
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Realizado Filter */}
              <div className="grid gap-2">
                <Label htmlFor="realizado">Realizado</Label>
                <Select
                  value={filters.realizado === "" ? "all" : filters.realizado}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      realizado: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger id="realizado" className="w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Sí</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Graduado Filter */}
              <div className="grid gap-2">
                <Label htmlFor="graduado">Graduado</Label>
                <Select
                  value={filters.graduado === "" ? "all" : filters.graduado}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      graduado: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger id="graduado" className="w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Sí</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Impreso Filter */}
              <div className="grid gap-2">
                <Label htmlFor="impreso">Impreso</Label>
                <Select
                  value={filters.impreso === "" ? "all" : filters.impreso}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      impreso: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger id="impreso" className="w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Sí</SelectItem>
                    <SelectItem value="false">No</SelectItem>
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
                <XIcon className="w-4 h-4 mr-2" />
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
                  <span>{value === "true" ? "Sí" : "No"}</span>
                  <button
                    onClick={() => setFilters({ ...filters, [key]: "" })}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </div>
              )
          )}
        </div>
      )}

      {/* Mobile Cards View */}
      <div className="block lg:hidden space-y-4">
        {displayedCapacitaciones.map((cap) => (
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
                <p className="text-sm text-muted-foreground">
                  Lugar: {cap["Lugar actual"]}
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

        {/* Infinite Scroll Trigger for Mobile */}
        {hasMore && (
          <div ref={loadMoreRef} className="flex lg:hidden justify-center py-8">
            <Spinner size="md" />
            <span className="ml-2 text-sm text-muted-foreground">
              Cargando más resultados...
            </span>
          </div>
        )}

        {/* End of results indicator for Mobile */}
        {!hasMore && displayedCapacitaciones.length > 50 && (
          <div className="lg:hidden text-center py-8 text-sm text-muted-foreground">
            Has llegado al final de los resultados
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Cédula</th>
              <th className="px-4 py-3 text-left font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold">
                Lugar Actual
              </th>
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
            {displayedCapacitaciones.map((cap) => (
              <tr key={cap.Id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">{cap.Id}</td>
                <td className="px-4 py-3">{cap.Cedula}</td>
                <td className="px-4 py-3 font-medium">{cap.NombreCompleto}</td>
                <td className="px-4 py-3">{cap["Lugar actual"]}</td>
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

      {/* Infinite Scroll Trigger for Desktop - SHARED REF */}
      {hasMore && (
        <div ref={loadMoreRef} className="hidden lg:flex justify-center py-8">
          <Spinner size="md" />
          <span className="ml-2 text-sm text-muted-foreground">
            Cargando más resultados...
          </span>
        </div>
      )}

      {/* End of results indicator for Desktop */}
      {!hasMore && displayedCapacitaciones.length > 50 && (
        <div className="hidden lg:block text-center py-8 text-sm text-muted-foreground">
          Has llegado al final de los resultados
        </div>
      )}
    </div>
  );
}
