import { useContext } from "react";
import { CourseContext } from "./course-provider";

export function useCourse() {
  const context = useContext(CourseContext);

  if (context === undefined) {
    throw new Error("useCourse must be used within a CourseProvider");
  }

  return context;
}
