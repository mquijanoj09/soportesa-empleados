import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getConnection } from "@/lib/bd-connection";
import { renderCourseReminderEmail } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmployeeEmailData {
  capacitacionId: number;
  nombre: string;
  email: string;
}

interface SendEmailRequest {
  employees: EmployeeEmailData[];
  courseId: number;
  courseName: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendEmailRequest = await request.json();
    const { employees, courseId, courseName } = body;

    console.log("Send emails request:", {
      employeeCount: employees?.length,
      courseId,
      courseName,
    });

    if (!employees || employees.length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron empleados para enviar correos" },
        { status: 400 }
      );
    }

    if (!courseId || !courseName) {
      return NextResponse.json(
        { error: "Se requiere el ID y nombre del curso" },
        { status: 400 }
      );
    }

    // Filter employees with valid email addresses
    const employeesWithEmail = employees.filter(
      (emp) => emp.email && emp.email.trim() !== ""
    );

    if (employeesWithEmail.length === 0) {
      return NextResponse.json(
        {
          error:
            "Ninguno de los empleados seleccionados tiene correo electrónico",
          emailsSent: 0,
          totalEmployees: employees.length,
        },
        { status: 400 }
      );
    }

    // Get the app URL from environment or use default
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const courseUrl = `${appUrl}/empleados?courseId=${courseId}`;

    const connection = await getConnection();

    try {
      // Send emails
      const emailResults = await Promise.allSettled(
        employeesWithEmail.map(async (employee) => {
          try {
            console.log(`Rendering email for ${employee.nombre}...`);
            const emailHtml = await renderCourseReminderEmail({
              employeeName: employee.nombre,
              courseName: courseName,
              courseUrl: courseUrl,
            });

            console.log(`Sending email to ${employee.email}...`);
            await resend.emails.send({
              from: "Soporte SA Capacitaciones <ssta@soporte.com.co>",
              to: employee.email,
              subject: `Recordatorio: Completa el curso ${courseName}`,
              html: emailHtml,
            });

            console.log(`Email sent successfully to ${employee.email}`);

            // Update database: increment email count and update last email date
            await connection.execute(
              `UPDATE \`23_Capacitacion\`
               SET CorreoEnviado = 1,
                   FechaUltimoEmail = NOW(),
                   totalEnvios = totalEnvios + 1
               WHERE Id = ?`,
              [employee.capacitacionId]
            );

            return { success: true, email: employee.email };
          } catch (error) {
            console.error(`Error sending email to ${employee.email}:`, error);
            return {
              success: false,
              email: employee.email,
              error: error instanceof Error ? error.message : "Unknown error",
            };
          }
        })
      );

      // Count successes and failures
      const successful = emailResults.filter(
        (result) => result.status === "fulfilled" && result.value.success
      ).length;
      const failed = emailResults.length - successful;

      return NextResponse.json({
        success: true,
        message: `Correos enviados: ${successful} exitosos, ${failed} fallidos`,
        emailsSent: successful,
        emailsFailed: failed,
        totalEmployees: employees.length,
        employeesWithoutEmail: employees.length - employeesWithEmail.length,
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("Error in send-emails API:", error);
    return NextResponse.json(
      {
        error: "Error al enviar correos electrónicos",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
