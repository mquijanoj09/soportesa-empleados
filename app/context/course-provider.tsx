"use client";

import React, { createContext, useCallback, ReactNode, useState } from "react";
import { Course } from "@/types";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  coursesPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Define context interface
interface CourseContextType {
  state: {
    courses: Course[];
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    pagination: PaginationInfo | null;
    loading: boolean;
    error: string | null;
  };
  actions: {
    fetchCourses: (page?: number) => Promise<void>;
  };
}

// Create context
const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Provider component
interface CourseProviderProps {
  children: ReactNode;
}

export function CourseProvider({ children }: CourseProviderProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API functions

  const fetchCourses = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/cursos?page=${page}&limit=24`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCourses(data.courses);
      setPagination(data.pagination);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch courses";
      setError(errorMessage);
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Context value
  const contextValue: CourseContextType = {
    state: { courses, setCourses, pagination, loading, error },
    actions: {
      fetchCourses,
    },
  };

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
}

// Export context for custom hook
export { CourseContext };
