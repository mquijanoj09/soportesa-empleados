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
    const idEmpleado = searchParams.get("idEmpleado");

    if (!courseId && !idEmpleado) {
      return NextResponse.json(
        { error: "courseId or idEmpleado parameter is required" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      // If idEmpleado is provided, return capacitaciones for that employee
      if (idEmpleado) {
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
            c.totalEnvios
          FROM \`23_Capacitacion\` c
          WHERE c.IdEmpleado = ?
          ORDER BY c.Realizado ASC, c.Id DESC`,
          [idEmpleado]
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
        }));

        return NextResponse.json({
          data: capacitaciones,
        });
      }

      // Otherwise, get capacitaciones by courseId
      // Get total count for pagination info
      const [countResult] = await connection.execute(
        `SELECT COUNT(*) as total 
         FROM \`23_Capacitacion\` c
         LEFT JOIN \`03_InformacionPersonal\` p ON c.IdEmpleado = p.Id
         LEFT JOIN \`09_ContratoActual\` ca ON c.IdEmpleado = ca.IdEmpleado
         WHERE c.\`IdCurso\` = ? AND p.EstadoActual = 1`,
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
          p.\`E- Mail Soporte\`,
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
        WHERE c.\`IdCurso\` = ? AND p.EstadoActual = 1
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { idEmpleado, idCurso, nota, graduado, buenas } = body;

    if (!idEmpleado || !idCurso || nota === undefined || buenas === undefined) {
      return NextResponse.json(
        { error: "idEmpleado, idCurso, nota, and buenas are required" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      // Get current date in format YYYY-MM-DD
      const currentDate = new Date().toISOString().split("T")[0];

      // Update the capacitacion record
      await connection.execute(
        `UPDATE \`23_Capacitacion\` 
         SET 
           \`Fecha de terminacion\` = ?,
           Realizado = 1,
           Graduado = ?,
           Nota = ?,
           Buenas = ?
         WHERE IdEmpleado = ? AND IdCurso = ?`,
        [currentDate, graduado ? 1 : 0, nota, buenas, idEmpleado, idCurso]
      );

      return NextResponse.json({
        success: true,
        message: "Capacitación actualizada correctamente",
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("Error updating capacitacion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { capacitacionIds } = body;

    if (
      !capacitacionIds ||
      !Array.isArray(capacitacionIds) ||
      capacitacionIds.length === 0
    ) {
      return NextResponse.json(
        { error: "capacitacionIds array is required" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      // Update Impreso field for all specified capacitacion IDs
      const placeholders = capacitacionIds.map(() => "?").join(",");
      await connection.execute(
        `UPDATE \`23_Capacitacion\` 
         SET Impreso = 1
         WHERE Id IN (${placeholders})`,
        capacitacionIds
      );

      return NextResponse.json({
        success: true,
        message: "Certificados marcados como impresos correctamente",
        count: capacitacionIds.length,
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("Error marking certificates as printed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, assignmentType, assignmentValue } = body;

    if (!courseId || !assignmentType || !assignmentValue) {
      return NextResponse.json(
        { error: "courseId, assignmentType, and assignmentValue are required" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      // First, get the course details
      const [courseRows] = await connection.execute(
        `SELECT Curso, Entidad, Horas, Modalidad, \`Ano Programacion\`, \`Mes Programacion\`, clasificacion
         FROM listaReglas 
         WHERE Id = ?`,
        [courseId]
      );

      if ((courseRows as any[]).length === 0) {
        await connection.end();
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }

      const course = (courseRows as any[])[0];

      // Build employee query based on assignment type
      let employeeQuery = "";
      let queryParams: any[] = [];

      if (assignmentType === "ids") {
        const ids = assignmentValue
          .split(",")
          .map((id: string) => id.trim())
          .filter((id: string) => id);

        if (ids.length === 0) {
          await connection.end();
          return NextResponse.json(
            { error: "No valid employee IDs provided" },
            { status: 400 }
          );
        }

        employeeQuery = `
          SELECT ca.IdEmpleado 
          FROM \`09_ContratoActual\` ca
          INNER JOIN \`03_InformacionPersonal\` p ON ca.IdEmpleado = p.Id
          WHERE ca.IdEmpleado IN (${ids.map(() => "?").join(",")})
          AND p.EstadoActual = 1
          AND ca.IdEmpleado NOT IN (
            SELECT IdEmpleado 
            FROM \`23_Capacitacion\` 
            WHERE IdCurso = ?
          )
        `;
        queryParams = [...ids, courseId];
      } else if (assignmentType === "lugar") {
        employeeQuery = `
          SELECT ca.IdEmpleado 
          FROM \`09_ContratoActual\` ca
          INNER JOIN \`03_InformacionPersonal\` p ON ca.IdEmpleado = p.Id
          WHERE ca.\`Lugar actual\` = ?
          AND p.EstadoActual = 1
          AND ca.IdEmpleado NOT IN (
            SELECT IdEmpleado 
            FROM \`23_Capacitacion\` 
            WHERE IdCurso = ?
          )
        `;
        queryParams = [assignmentValue, courseId];
      } else if (assignmentType === "ciudad") {
        employeeQuery = `
          SELECT ca.IdEmpleado 
          FROM \`09_ContratoActual\` ca
          INNER JOIN \`03_InformacionPersonal\` p ON ca.IdEmpleado = p.Id
          WHERE ca.\`Ciudad actual\` = ?
          AND p.EstadoActual = 1
          AND ca.IdEmpleado NOT IN (
            SELECT IdEmpleado 
            FROM \`23_Capacitacion\` 
            WHERE IdCurso = ?
          )
        `;
        queryParams = [assignmentValue, courseId];
      } else if (assignmentType === "cc") {
        employeeQuery = `
          SELECT ca.IdEmpleado 
          FROM \`09_ContratoActual\` ca
          INNER JOIN \`03_InformacionPersonal\` p ON ca.IdEmpleado = p.Id
          WHERE ca.\`Centro de costos actual\` = ?
          AND p.EstadoActual = 1
          AND ca.IdEmpleado NOT IN (
            SELECT IdEmpleado 
            FROM \`23_Capacitacion\` 
            WHERE IdCurso = ?
          )
        `;
        queryParams = [assignmentValue, courseId];
      } else if (assignmentType === "antiguedad") {
        employeeQuery = `
          SELECT ca.IdEmpleado 
          FROM \`09_ContratoActual\` ca
          INNER JOIN \`03_InformacionPersonal\` p ON ca.IdEmpleado = p.Id
          WHERE p.EstadoActual = 1
          AND ca.IdEmpleado NOT IN (
            SELECT IdEmpleado 
            FROM \`23_Capacitacion\` 
            WHERE IdCurso = ?
          )
        `;
        queryParams = [courseId];
      } else {
        await connection.end();
        return NextResponse.json(
          { error: "Invalid assignment type" },
          { status: 400 }
        );
      }

      const [employees] = await connection.execute(employeeQuery, queryParams);

      let addedCount = 0;
      if ((employees as any[]).length > 0) {
        for (const employee of employees as any[]) {
          const capacitacionQuery = `
            INSERT INTO \`23_Capacitacion\` (
              IdEmpleado,
              IdCurso,
              Curso,
              \`Fecha de terminacion\`,
              \`Entidad Educativa\`,
              \`Horas Programadas\`,
              Modalidad,
              \`Ano Programacion\`,
              \`Mes Programacion\`,
              clasificacion,
              Nota,
              EficienciaObs
            ) VALUES (?, ?, ?, '', ?, ?, ?, ?, ?, ?, 0, '')
          `;

          await connection.execute(capacitacionQuery, [
            employee.IdEmpleado,
            courseId,
            course.Curso,
            course.Entidad,
            course.Horas || 0,
            course.Modalidad,
            course["Ano Programacion"],
            course["Mes Programacion"],
            course.clasificacion,
          ]);
          addedCount++;
        }
      }

      await connection.end();

      return NextResponse.json({
        success: true,
        message: `${addedCount} empleado(s) agregado(s) exitosamente`,
        count: addedCount,
      });
    } catch (error) {
      await connection.end();
      throw error;
    }
  } catch (error) {
    console.error("Error adding personnel:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { capacitacionIds } = body;

    if (
      !capacitacionIds ||
      !Array.isArray(capacitacionIds) ||
      capacitacionIds.length === 0
    ) {
      return NextResponse.json(
        { error: "capacitacionIds array is required" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      const placeholders = capacitacionIds.map(() => "?").join(",");
      await connection.execute(
        `DELETE FROM \`23_Capacitacion\` 
         WHERE Id IN (${placeholders})`,
        capacitacionIds
      );

      return NextResponse.json({
        success: true,
        message: "Empleados eliminados del curso correctamente",
        count: capacitacionIds.length,
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("Error removing personnel:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
