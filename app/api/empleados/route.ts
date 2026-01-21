import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/bd-connection";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const cedula = searchParams.get("cedula");
    const month = searchParams.get("month");
    const day = searchParams.get("day");

    // Handle distinct values request for course assignment
    if (action === "getDistinctValues") {
      const connection = await getConnection();
      try {
        const [lugarRows] = await connection.execute(
          `SELECT DISTINCT \`Lugar actual\` FROM \`09_ContratoActual\` WHERE \`Lugar actual\` IS NOT NULL AND \`Lugar actual\` != '' ORDER BY \`Lugar actual\``
        );
        const [ciudadRows] = await connection.execute(
          `SELECT DISTINCT \`Ciudad actual\` FROM \`09_ContratoActual\` WHERE \`Ciudad actual\` IS NOT NULL AND \`Ciudad actual\` != '' ORDER BY \`Ciudad actual\``
        );
        const [ccRows] = await connection.execute(
          `SELECT DISTINCT \`Centro de costos actual\` FROM \`09_ContratoActual\` WHERE \`Centro de costos actual\` IS NOT NULL AND \`Centro de costos actual\` != 0 ORDER BY \`Centro de costos actual\``
        );
        const [antiguedadRows] = await connection.execute(
          `SELECT DISTINCT \`Antiguedad\` FROM \`listaReglas\` WHERE \`Antiguedad\` IS NOT NULL AND \`Antiguedad\` != '' ORDER BY \`Antiguedad\``
        );

        await connection.end();

        return NextResponse.json({
          lugares: (lugarRows as any[]).map((r) => r["Lugar actual"]),
          ciudades: (ciudadRows as any[]).map((r) => r["Ciudad actual"]),
          centrosCostos: (ccRows as any[]).map((r) =>
            r["Centro de costos actual"].toString()
          ),
          antiguedades: (antiguedadRows as any[]).map((r) => r["Antiguedad"]),
        });
      } catch (error) {
        await connection.end();
        throw error;
      }
    }

    if (!cedula) {
      return NextResponse.json(
        { error: "cedula parameter is required" },
        { status: 400 }
      );
    }

    if (!month || !day) {
      return NextResponse.json(
        { error: "month and day parameters are required" },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    try {
      // Get employee information by cedula
      const [employeeRows] = await connection.execute(
        `SELECT 
          p.Id as IdEmpleado,
          p.\`Primer Nombre\`,
          p.\`Segundo Nombre\`,
          p.\`Primer Apellido\`,
          p.\`Segundo Apellido\`,
          p.\`Numero Identificacion\` as Cedula,
          p.\`Fecha De Expedicion\`,
          CONCAT_WS(' ', 
            TRIM(p.\`Primer Nombre\`), 
            TRIM(p.\`Segundo Nombre\`), 
            TRIM(p.\`Primer Apellido\`), 
            TRIM(p.\`Segundo Apellido\`)
          ) as NombreCompleto,
          ca.\`Lugar actual\`
        FROM \`03_InformacionPersonal\` p
        LEFT JOIN \`09_ContratoActual\` ca ON p.Id = ca.IdEmpleado
        WHERE p.\`Numero Identificacion\` = ?`,
        [cedula]
      );

      if ((employeeRows as any[]).length === 0) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }

      const employee = (employeeRows as any[])[0];

      // Log for debugging
      console.log("Employee found:", {
        cedula: employee.Cedula,
        fechaExpedicion: employee["Fecha De Expedicion"],
      });
      console.log("Provided date:", { month, day });

      // Validate month and day against "Fecha De Expedicion"
      const fechaExpedicion = employee["Fecha De Expedicion"];

      // If fechaExpedicion is empty or null, skip validation for now (temporary)
      if (!fechaExpedicion || fechaExpedicion.trim() === "") {
        console.log("Warning: No expedition date found, allowing login");
        // Continue with login (temporary - remove this later)
      } else {
        // Parse the date (format is YYYY/MM/DD or YYYY-MM-DD)
        const dateMatch = fechaExpedicion.match(
          /(\d{2,4})[\/\-](\d{1,2})[\/\-](\d{1,2})/
        );

        console.log("Date match result:", dateMatch);

        if (dateMatch) {
          const [, yearFromDB, monthFromDB, dayFromDB] = dateMatch;
          const providedMonth = parseInt(month, 10);
          const providedDay = parseInt(day, 10);
          const dbMonth = parseInt(monthFromDB, 10);
          const dbDay = parseInt(dayFromDB, 10);

          console.log("Date comparison:", {
            providedMonth,
            providedDay,
            dbMonth,
            dbDay,
          });

          if (providedMonth !== dbMonth || providedDay !== dbDay) {
            return NextResponse.json(
              {
                error:
                  "La fecha de expedición (mes y día) no coincide con nuestros registros",
              },
              { status: 401 }
            );
          }
        } else {
          console.log("Invalid date format in DB:", fechaExpedicion);
          return NextResponse.json(
            {
              error:
                "Formato de fecha de expedición inválido en la base de datos",
            },
            { status: 500 }
          );
        }
      }

      // Get employee's capacitaciones (pending and completed)
      const [capacitacionesRows] = await connection.execute(
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
        [employee.IdEmpleado]
      );

      const capacitaciones = (capacitacionesRows as any[]).map((row) => ({
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

      // Separate pending and completed capacitaciones
      // Pendientes: not graduated
      const pendientes = capacitaciones.filter(
        (c) => !c.Graduado && !c.Cancelado
      );
      // Realizadas: taken and graduated
      const realizadas = capacitaciones.filter(
        (c) => c.Realizado && c.Graduado
      );

      return NextResponse.json({
        employee: {
          ...employee,
          "Primer Nombre": employee["Primer Nombre"] || "",
          "Segundo Nombre": employee["Segundo Nombre"] || "",
          "Primer Apellido": employee["Primer Apellido"] || "",
          "Segundo Apellido": employee["Segundo Apellido"] || "",
          NombreCompleto: employee.NombreCompleto || "Nombre no disponible",
          "Lugar actual": employee["Lugar actual"] || "No especificado",
        },
        capacitaciones: {
          pendientes,
          realizadas,
        },
      });
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error("Error fetching employee data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
