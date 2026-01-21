import { NextResponse } from "next/server";
import { getConnection } from "@/lib/bd-connection";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const [month, day] = password.split("-");

    const conn = await getConnection();

    try {
      // Query to find admin user by username (cedula) and check CC
      const [rows] = await conn.execute(
        `SELECT 
          p.Id as IdEmpleado,
          CONCAT_WS(' ', p.\`Primer Nombre\`, p.\`Segundo Nombre\`, p.\`Primer Apellido\`, p.\`Segundo Apellido\`) AS NombreCompleto,
          p.\`Numero Identificacion\` as Cedula,
          p.\`Fecha De Expedicion\`,
          ca.\`Centro de costos actual\` as CC
        FROM 03_InformacionPersonal p
        LEFT JOIN 09_ContratoActual ca ON p.Id = ca.IdEmpleado
        WHERE p.\`Numero Identificacion\` = ?
        LIMIT 1`,
        [username]
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json(
          { error: "Credenciales inválidas" },
          { status: 401 }
        );
      }

      const user = rows[0] as any;

      // Check if user is from CC 69 (Gestión Humana) or CC 30
      const userCC = parseInt(user.CC, 10);
      if (!user.CC || (userCC !== 69 && userCC !== 30)) {
        await conn.end();
        return NextResponse.json(
          { error: "No tiene permisos para acceder a esta área" },
          { status: 403 }
        );
      }

      // Validate month and day against "Fecha De Expedicion"
      const fechaExpedicion = user["Fecha De Expedicion"];

      if (!fechaExpedicion || fechaExpedicion.trim() === "") {
        // Allow login if no date is set
        await conn.end();
        return NextResponse.json({
          success: true,
          username: user.NombreCompleto,
          userId: user.IdEmpleado,
        });
      }

      // Parse the date (format is YYYY/MM/DD or YYYY-MM-DD)
      const dateMatch = fechaExpedicion.match(
        /(\d{2,4})[\/\-](\d{1,2})[\/\-](\d{1,2})/
      );

      if (dateMatch) {
        const [, , monthFromDB, dayFromDB] = dateMatch;
        const providedMonth = parseInt(month, 10);
        const providedDay = parseInt(day, 10);
        const dbMonth = parseInt(monthFromDB, 10);
        const dbDay = parseInt(dayFromDB, 10);

        if (providedMonth !== dbMonth || providedDay !== dbDay) {
          await conn.end();
          return NextResponse.json(
            { error: "Credenciales inválidas" },
            { status: 401 }
          );
        }
      } else {
        await conn.end();
        return NextResponse.json(
          { error: "Error al validar credenciales" },
          { status: 500 }
        );
      }

      await conn.end();

      return NextResponse.json({
        success: true,
        username: user.NombreCompleto,
        userId: user.IdEmpleado,
      });
    } catch (error) {
      await conn.end();
      throw error;
    }
  } catch (error: any) {
    console.error("Error in login:", error);
    return NextResponse.json(
      { error: error.message || "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
