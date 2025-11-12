import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components";

interface CourseReminderEmailProps {
  employeeName?: string;
  courseName?: string;
  courseUrl?: string;
}

export const CourseReminderEmail: React.FC<
  Readonly<CourseReminderEmailProps>
> = ({
  employeeName = "Juan",
  courseName = "Seguridad Industrial",
  courseUrl = "https://soporte.com.co/empleados?courseId=123",
}) => (
  <Html>
    <Head />
    <Preview>
      Recordatorio: Completa el curso {courseName} - Soporte SA Capacitaciones
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={content}>
          <Heading style={heading}>¡Hola {employeeName}!</Heading>

          <Text style={paragraph}>
            Te recordamos que tienes pendiente completar el curso:
          </Text>

          <Section style={courseBox}>
            <Heading as="h2" style={courseTitle}>
              {courseName}
            </Heading>
          </Section>

          <Text style={paragraph}>
            Por favor, ingresa a la plataforma para completar tu capacitación lo
            antes posible.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={courseUrl}>
              Ir al Curso
            </Button>
          </Section>

          <Text style={helpText}>
            Si tienes alguna pregunta o necesitas ayuda, no dudes en
            contactarnos.
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={footer}>
          <Text style={footerText}>
            Este es un correo automático, por favor no respondas a este mensaje.
          </Text>
          <Text style={footerText}>
            © {new Date().getFullYear()} Soporte SA. Todos los derechos
            reservados.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default CourseReminderEmail;

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const content = {
  backgroundColor: "#f8f9fa",
  borderRadius: "10px",
  padding: "30px",
};

const heading = {
  color: "#aa0000",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0 0 20px",
  padding: "0",
  lineHeight: "1.3",
};

const paragraph = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 20px",
};

const courseBox = {
  backgroundColor: "#ffffff",
  borderLeft: "4px solid #aa0000",
  borderRadius: "5px",
  padding: "15px",
  margin: "20px 0",
};

const courseTitle = {
  color: "#aa0000",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
  padding: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#aa0000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 30px",
  lineHeight: "1.5",
};

const helpText = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "30px 0 0",
};

const hr = {
  borderColor: "#e6e6e6",
  margin: "30px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#999",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: "5px 0",
};
