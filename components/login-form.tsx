import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { User, LogIn } from "lucide-react";
import { toast } from "sonner";

interface LoginFormProps {
  title: string;
  subtitle: string;
  onLoginSuccess: (data: any) => void;
  apiEndpoint: string;
  isAdminPortal?: boolean;
}

export function LoginForm({
  title,
  subtitle,
  onLoginSuccess,
  apiEndpoint,
  isAdminPortal = false,
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cedula, setCedula] = useState("");
  const [monthExpedition, setMonthExpedition] = useState("");
  const [dayExpedition, setDayExpedition] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cedula.trim()) {
      toast.error("Por favor ingrese su cédula");
      return;
    }
    if (!monthExpedition.trim()) {
      toast.error("Por favor ingrese el mes de expedición");
      return;
    }
    if (!dayExpedition.trim()) {
      toast.error("Por favor ingrese el día de expedición");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        isAdminPortal
          ? apiEndpoint
          : `${apiEndpoint}?cedula=${encodeURIComponent(
              cedula
            )}&month=${encodeURIComponent(
              monthExpedition
            )}&day=${encodeURIComponent(dayExpedition)}`,
        isAdminPortal
          ? {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: cedula,
                password: `${monthExpedition}-${dayExpedition}`,
              }),
            }
          : undefined
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Credenciales incorrectas");
          return;
        }
        if (response.status === 404) {
          toast.error("No se encontró un empleado con esta cédula");
          return;
        }
        throw new Error("Error al iniciar sesión");
      }

      const data = await response.json();
      onLoginSuccess(data);

      const welcomeName = isAdminPortal
        ? data.username
        : data.employee.NombreCompleto;
      toast.success(`¡Bienvenido, ${welcomeName}!`);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error al iniciar sesión. Por favor intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-y-hidden"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="cedula">Número de Cédula</Label>
                <Input
                  id="cedula"
                  type="text"
                  placeholder="Ingrese su número de cédula"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="month">Mes de Expedición</Label>
                  <Input
                    id="month"
                    type="number"
                    placeholder="MM"
                    min="1"
                    max="12"
                    value={monthExpedition}
                    onChange={(e) => setMonthExpedition(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="day">Día de Expedición</Label>
                  <Input
                    id="day"
                    type="number"
                    placeholder="DD"
                    min="1"
                    max="31"
                    value={dayExpedition}
                    onChange={(e) => setDayExpedition(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  isLoading ||
                  !cedula.trim() ||
                  !monthExpedition.trim() ||
                  !dayExpedition.trim()
                }
              >
                <LogIn className="w-4 h-4 mr-2" />
                {isLoading ? "Verificando..." : "Ingresar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Ingrese su cédula y la fecha de expedición (mes y día) para acceder
          </p>
        </div>
      </div>
    </div>
  );
}
