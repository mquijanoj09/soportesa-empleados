import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Capacitacion, Course } from "@/types";

export interface CertificateData {
  employeeName: string;
  cedula: string;
  courseName: string;
  completionDate: string;
  grade: number;
  certificateId: string;
  lugarActual: string;
}

// Function to create a certificate template as HTML
function createCertificateHTML(data: CertificateData): string {
  return `
    <div id="certificate" style="width: 794px; height: 1123px; background: linear-gradient(135deg, rgb(170, 0, 0) 0%, rgb(43, 18, 43) 100%); padding: 40px; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif; position: relative; overflow: hidden;">
      <div style="background: rgb(255, 255, 255); height: 100%; border-radius: 20px; padding: 60px 50px; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
        
        <div style="text-align: center; margin-bottom: 50px;">
          <div style="color: rgb(170, 0, 0); font-size: 36px; font-weight: bold; margin-bottom: 10px; letter-spacing: 2px;">
            CERTIFICADO DE FINALIZACIÓN
          </div>
          <div style="height: 4px; background: rgb(170, 0, 0); width: 200px; margin: 20px auto; border-radius: 2px;"></div>
        </div>

        <div style="text-align: center; margin-bottom: 40px;">
          <p style="font-size: 18px; color: rgb(102, 102, 102); margin-bottom: 30px; line-height: 1.6;">
            Se certifica que
          </p>
          
          <h1 style="font-size: 42px; color: rgb(45, 55, 72); margin: 30px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
            ${data.employeeName}
          </h1>
          
          <p style="font-size: 18px; color: rgb(102, 102, 102); margin-bottom: 20px;">
            <strong>Cédula:</strong> ${data.cedula}
          </p>
          
          <p style="font-size: 20px; color: rgb(74, 85, 104); margin: 40px 0; line-height: 1.6;">
            Ha completado satisfactoriamente el curso
          </p>
          
          <h2 style="font-size: 32px; color: rgb(170, 0, 0); margin: 30px 0; font-weight: bold; line-height: 1.2;">
            "${data.courseName}"
          </h2>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 50px 0; padding: 30px; background: rgb(248, 250, 252); border-radius: 15px; border-left: 5px solid rgb(170, 0, 0);">
          <div style="text-align: left;">
            <p style="font-size: 14px; color: rgb(113, 128, 150); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
              Fecha de Finalización
            </p>
            <p style="font-size: 18px; color: rgb(45, 55, 72); font-weight: bold;">
              ${data.completionDate}
            </p>
          </div>
          
          <div style="text-align: left;">
            <p style="font-size: 14px; color: rgb(113, 128, 150); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
              Calificación
            </p>
            <p style="font-size: 18px; color: rgb(45, 55, 72); font-weight: bold;">
              ${data.grade}/100
            </p>
          </div>
          
          <div style="text-align: left;">
            <p style="font-size: 14px; color: rgb(113, 128, 150); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
              Lugar Actual
            </p>
            <p style="font-size: 18px; color: rgb(45, 55, 72); font-weight: bold;">
              ${data.lugarActual}
            </p>
          </div>
          
          <div style="text-align: left;">
            <p style="font-size: 14px; color: rgb(113, 128, 150); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
              ID del Certificado
            </p>
            <p style="font-size: 18px; color: rgb(45, 55, 72); font-weight: bold;">
              ${data.certificateId}
            </p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 2px solid rgb(226, 232, 240);">
          <p style="font-size: 16px; color: rgb(113, 128, 150); margin-bottom: 10px;">
            Certificado emitido por
          </p>
          <p style="font-size: 20px; font-weight: bold; color: rgb(45, 55, 72); margin-bottom: 5px;">
            SOPORTE SA
          </p>
          <p style="font-size: 14px; color: rgb(160, 174, 192);">
            Sistema de Gestión de Capacitaciones
          </p>
          
          <div style="margin-top: 25px; padding: 15px; color: rgb(255, 255, 255); display: inline-block; font-weight: bold; letter-spacing: 1px; text-align: center;">
            Emitido el ${new Date().toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Function to generate a single certificate
export async function generateCertificate(
  employeeData: Capacitacion,
  courseData: Course
): Promise<void> {
  const certificateData: CertificateData = {
    employeeName: employeeData.NombreCompleto || "N/A",
    cedula: employeeData.Cedula || "N/A",
    courseName: courseData.Curso || "N/A",
    completionDate: employeeData["Fecha de terminacion"]
      ? new Date(employeeData["Fecha de terminacion"]).toLocaleDateString(
          "es-ES",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )
      : "N/A",
    grade: employeeData.Nota || 0,
    certificateId: `CERT-${courseData.Id}-${employeeData.Id}-${Date.now()}`,
    lugarActual: employeeData["Lugar actual"] || "N/A",
  };

  // Create an isolated iframe to render the certificate
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.left = "-9999px";
  iframe.style.top = "-9999px";
  iframe.style.width = "794px";
  iframe.style.height = "1123px";

  document.body.appendChild(iframe);

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error("Could not access iframe document");
    }

    // Write the certificate HTML into the iframe
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          ${createCertificateHTML(certificateData)}
        </body>
      </html>
    `);
    iframeDoc.close();

    // Wait for fonts and content to load
    await new Promise((resolve) => setTimeout(resolve, 100));

    const certificateElement = iframeDoc.querySelector(
      "#certificate"
    ) as HTMLElement;
    if (!certificateElement) {
      throw new Error("Certificate element not found in iframe");
    }

    // Convert HTML to canvas
    const canvas = await html2canvas(certificateElement, {
      width: 794,
      height: 1123,
      useCORS: true,
      logging: false,
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [794, 1123],
    });

    // Add the canvas image to PDF
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, 794, 1123);

    // Download the PDF
    const fileName = `${
      employeeData.Cedula?.replace(/\s+/g, "_") || "empleado"
    }_${courseData.Curso?.replace(/\s+/g, "_") || "curso"}.pdf`;
    pdf.save(fileName);
  } finally {
    // Clean up - remove the iframe
    document.body.removeChild(iframe);
  }
}

// Function to generate multiple certificates
export async function generateMultipleCertificates(
  employeesData: Capacitacion[],
  courseData: Course
): Promise<void> {
  for (let i = 0; i < employeesData.length; i++) {
    const employee = employeesData[i];

    // Add a small delay between downloads to prevent browser blocking
    if (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    await generateCertificate(employee, courseData);
  }
}

// Function to generate all certificates as a single ZIP file (alternative approach)
export async function generateCertificatesAsZip(
  employeesData: Capacitacion[],
  courseData: Course
): Promise<void> {
  // This would require additional libraries like JSZip
  // For now, we'll use the multiple download approach
  await generateMultipleCertificates(employeesData, courseData);
}
