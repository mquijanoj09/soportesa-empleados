import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/bd-connection";

export interface Capacitacion {
  Id: number;
  IdEmpleado: number;
  IdCurso: number;
  Curso: string;
  "Fecha de terminacion": string;
  "Entidad Educativa": string;
  "Horas Programadas": number;
  Realizado: boolean;
  Graduado: boolean;
  Impreso: boolean;
  Cancelado: boolean;
  Modalidad: string;
  "Ano Programacion": string;
  "Mes Programacion": string;
  Aplica: boolean;
  Eficiente: boolean;
  EficienciaObs: string;
  CentroCapacitacion: boolean;
  Nota: number;
  Buenas: number;
  CorreoEnviado: boolean;
  clasificacion: string;
  FechaUltimoEmail: string | null;
  totalEnvios: number;
  // Employee information
  "Primer Nombre": string;
  "Segundo Nombre": string;
  "Primer Apellido": string;
  "Segundo Apellido": string;
  NombreCompleto: string;
  Cedula: string;
  "Lugar actual": string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId parameter is required" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      // Get total count for pagination info
      const [countResult] = await connection.execute(
        `SELECT COUNT(*) as total 
         FROM \`23_Capacitacion\` c
         LEFT JOIN \`03_InformacionPersonal\` p ON c.IdEmpleado = p.Id
         LEFT JOIN \`09_ContratoActual\` ca ON c.IdEmpleado = ca.IdEmpleado
         WHERE c.\`IdCurso\` = ?`,
        [courseId]
      );
      const totalRecords = (countResult as any)[0].total;

      // Get capacitaciones data with pagination including employee information
      const [rows] = await connection.execute(
        `SELECT 
          c.Id,
          c.IdEmpleado,
          c.IdCurso,
          c.Curso,
          c.\`Fecha de terminacion\`,
          c.\`Entidad Educativa\`,
          c.\`Horas Programadas\`,
          c.Realizado,
          c.Graduado,
          c.Impreso,
          c.Cancelado,
          c.Modalidad,
          c.\`Ano Programacion\`,
          c.\`Mes Programacion\`,
          c.Aplica,
          c.Eficiente,
          c.EficienciaObs,
          c.CentroCapacitacion,
          c.Nota,
          c.Buenas,
          c.CorreoEnviado,
          c.clasificacion,
          c.FechaUltimoEmail,
          c.totalEnvios,
          p.\`Primer Nombre\`,
          p.\`Segundo Nombre\`,
          p.\`Primer Apellido\`,
          p.\`Segundo Apellido\`,
          p.\`Numero Identificacion\` as Cedula,
          CONCAT_WS(' ', 
            TRIM(p.\`Primer Nombre\`), 
            TRIM(p.\`Segundo Nombre\`), 
            TRIM(p.\`Primer Apellido\`), 
            TRIM(p.\`Segundo Apellido\`)
          ) as NombreCompleto,
          ca.\`Lugar actual\`
        FROM \`23_Capacitacion\` c
        LEFT JOIN \`03_InformacionPersonal\` p ON c.IdEmpleado = p.Id
        LEFT JOIN \`09_ContratoActual\` ca ON c.IdEmpleado = ca.IdEmpleado
        WHERE c.\`IdCurso\` = ? 
        ORDER BY c.Id DESC`,
        [courseId]
      );

      const capacitaciones = (rows as any[]).map((row) => ({
        ...row,
        Realizado: Boolean(row.Realizado),
        Graduado: Boolean(row.Graduado),
        Impreso: Boolean(row.Impreso),
        Cancelado: Boolean(row.Cancelado),
        Aplica: Boolean(row.Aplica),
        Eficiente: Boolean(row.Eficiente),
        CentroCapacitacion: Boolean(row.CentroCapacitacion),
        CorreoEnviado: Boolean(row.CorreoEnviado),
        // Clean up empty names
        "Primer Nombre": row["Primer Nombre"] || "",
        "Segundo Nombre": row["Segundo Nombre"] || "",
        "Primer Apellido": row["Primer Apellido"] || "",
        "Segundo Apellido": row["Segundo Apellido"] || "",
        NombreCompleto: row.NombreCompleto || "Nombre no disponible",
        Cedula: row.Cedula || "N/A",
        "Lugar actual": row["Lugar actual"] || "No especificado",
      }));

      return NextResponse.json({
        data: capacitaciones,
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("Error fetching capacitaciones:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
