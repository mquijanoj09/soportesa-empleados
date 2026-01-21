"use client";

import { useEffect, useState } from "react";
import { CourseList } from "@/components/course-list";
import { EmployeeHeader } from "@/components/employee-header";
import { LoginForm } from "@/components/login-form";
import { toast } from "sonner";
import { useCourse } from "../context/useCourse";

interface Admin {
  username: string;
}

export default function HomePage() {
  const { state, actions } = useCourse();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const savedSession = localStorage.getItem("adminSession");
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setAdmin(session.admin);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error restoring session:", error);
        localStorage.removeItem("adminSession");
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      actions.fetchAllCourses();
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = (data: { username: string; userId: number }) => {
    const adminData = { username: data.username };

    setAdmin(adminData);
    setIsAuthenticated(true);

    // Save session to localStorage
    localStorage.setItem(
      "adminSession",
      JSON.stringify({
        admin: adminData,
      })
    );
  };

  const handleLogout = () => {
    setAdmin(null);
    setIsAuthenticated(false);

    // Clear localStorage
    localStorage.removeItem("adminSession");

    toast.info("Sesión cerrada correctamente");
  };

  // Login view
  if (!isAuthenticated) {
    return (
      <LoginForm
        title="Portal de Administración"
        subtitle="Gestión de Capacitaciones"
        apiEndpoint="/api/users"
        onLoginSuccess={handleLoginSuccess}
        isAdminPortal={true}
      />
    );
  }

  // Main capacitaciones view
  return (
    <div className="min-h-screen bg-background">
      <EmployeeHeader onLogout={handleLogout} />
      <div className="max-w-6xl mx-auto p-6">
        <CourseList />
      </div>
    </div>
  );
}
