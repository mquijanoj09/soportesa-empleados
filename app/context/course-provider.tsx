"use client";

import React, { createContext, useCallback, ReactNode, useState } from "react";
import { Course } from "@/types";

// Define context interface
interface CourseContextType {
  state: {
    courses: Course[];
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    loading: boolean;
    error: string | null;
  };
  actions: {
    fetchAllCourses: () => Promise<void>;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API functions

  const fetchAllCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch a very large limit to get all courses
      const response = await fetch(`/api/cursos`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCourses(data.courses);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch all courses";
      setError(errorMessage);
      console.error("Error fetching all courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Context value
  const contextValue: CourseContextType = {
    state: { courses, setCourses, loading, error },
    actions: {
      fetchAllCourses,
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
