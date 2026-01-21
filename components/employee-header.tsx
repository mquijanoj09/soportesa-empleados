import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EmployeeHeaderProps {
  onBack?: () => void;
  onLogout: () => void;
  backLabel?: string;
}

export function EmployeeHeader({
  onBack,
  onLogout,
  backLabel = "Volver",
}: EmployeeHeaderProps) {
  return (
    <div className="bg-card shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backLabel}
            </Button>
          )}
          <h1 className="text-xl font-semibold">
            Portal de Empleados - Soporte SA
          </h1>
        </div>
        <Button variant="outline" onClick={onLogout}>
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
