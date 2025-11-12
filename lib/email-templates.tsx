import * as React from "react";
import { render } from "@react-email/render";
import { CourseReminderEmail } from "@/emails/course-reminder";

interface CourseReminderEmailProps {
  employeeName: string;
  courseName: string;
  courseUrl: string;
}

// Function to render React Email component to HTML string
export const renderCourseReminderEmail = async (
  props: CourseReminderEmailProps
): Promise<string> => {
  try {
    const html = await render(<CourseReminderEmail {...props} />, {
      pretty: false,
    });
    return html;
  } catch (error) {
    console.error("Error rendering email template:", error);
    throw error;
  }
};
