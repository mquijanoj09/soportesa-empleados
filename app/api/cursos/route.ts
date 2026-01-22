import { getConnection } from "@/lib/bd-connection";
import { Course } from "@/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const conn = await getConnection();

    // If requesting a specific course by ID, return the full course data
    if (id) {
      // First, get the course info from listaReglas
      let basicQuery = `
        SELECT 
          lr.Id,
          lr.Curso,
          lr.\`Existe Plataforma Interna\`,
          COALESCE(cp.TotalPreguntas, 0) AS \`Total Preguntas\`,
          lr.Entidad,
          lr.Horas,
          lr.Modalidad,
          lr.\`Ano Programacion\`,
          lr.\`Mes Programacion\`,
          lr.Antiguedad,
          lr.Clasificacion,
          lr.Ciudad,
          lr.Proyecto,
          lr.Estado,
          lr.Lugar,
          lr.CC,
          lr.Cargo,
          lr.IdEmpleado,
          lr.AplicaEficiencia
        FROM listaReglas lr
        LEFT JOIN cap_TotalPreguntas cp ON lr.Id = cp.IdEvaluacion
        WHERE lr.Id = ?`;

      const [basicRows] = await conn.execute(basicQuery, [id]);

      if ((basicRows as any[]).length === 0) {
        console.log("No course found for ID:", id);
        await conn.end();
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }

      const courseData = (basicRows as any[])[0];

      // Now get the detailed info from cap_evaluacion with questions and answers
      let detailQuery = `
        SELECT 
          e.Id as evaluacion_id,
          e.Nombre as evaluacion_nombre,
          e.Texto as evaluacion_texto,
          e.InduccionVideo as evaluacion_video1,
          e.InduccionVideo2 as evaluacion_video2,
          e.InduccionVideo3 as evaluacion_video3,
          e.InduccionVideo4 as evaluacion_video4,
          p.Id as pregunta_id,
          p.Pregunta as pregunta_texto,
          p.tipo as pregunta_tipo,
          r.Id as respuesta_id,
          r.txtRespuesta as respuesta_texto,
          r.Ok as respuesta_correcta
        FROM cap_evaluacion e
        LEFT JOIN cap_pregunta p ON e.Id = p.IdEvaluacion
        LEFT JOIN cap_respuesta r ON p.Id = r.IdPregunta
        WHERE e.Id = ?
        ORDER BY p.Id, r.Id`;

      const [detailRows] = await conn.execute(detailQuery, [id]);
      await conn.end();

      // Process questions and answers
      const questionsMap = new Map();
      let courseDetails = {
        Texto: "",
        InduccionVideo: "",
        InduccionVideo2: "",
        InduccionVideo3: "",
        InduccionVideo4: "",
      };

      (detailRows as any[]).forEach((row) => {
        // Get course detail info from first row
        if (row.evaluacion_texto) {
          courseDetails.Texto = row.evaluacion_texto;
          courseDetails.InduccionVideo = row.evaluacion_video1 || "";
          courseDetails.InduccionVideo2 = row.evaluacion_video2 || "";
          courseDetails.InduccionVideo3 = row.evaluacion_video3 || "";
          courseDetails.InduccionVideo4 = row.evaluacion_video4 || "";
        }

        // Process questions
        if (row.pregunta_id) {
          if (!questionsMap.has(row.pregunta_id)) {
            questionsMap.set(row.pregunta_id, {
              Id: row.pregunta_id,
              Pregunta: row.pregunta_texto,
              tipo: row.pregunta_tipo,
              respuestas: [],
            });
          }

          // Add answer if it exists
          if (row.respuesta_id) {
            const question = questionsMap.get(row.pregunta_id);
            if (
              !question.respuestas.find((a: any) => a.Id === row.respuesta_id)
            ) {
              question.respuestas.push({
                Id: row.respuesta_id,
                txtRespuesta: row.respuesta_texto,
                Ok: Boolean(row.respuesta_correcta),
              });
            }
          }
        }
      });

      const course: Course = {
        Id: courseData.Id,
        Curso: courseData.Curso,
        "Existe Plataforma Interna": courseData["Existe Plataforma Interna"],
        "Total Preguntas": courseData["Total Preguntas"],
        Entidad: courseData.Entidad,
        Horas: courseData.Horas,
        Modalidad: courseData.Modalidad,
        "Ano Programacion": courseData["Ano Programacion"],
        "Mes Programacion": courseData["Mes Programacion"],
        Antiguedad: courseData.Antiguedad,
        Clasificacion: courseData.Clasificacion,
        Ciudad: courseData.Ciudad,
        Proyecto: courseData.Proyecto,
        Estado: courseData.Estado,
        Lugar: courseData.Lugar,
        CC: courseData.CC,
        Cargo: courseData.Cargo,
        IdEmpleado: courseData.IdEmpleado,
        AplicaEficiencia: courseData.AplicaEficiencia,
        // Legacy fields for backward compatibility
        Nombre: courseData.Curso,
        Texto: courseDetails.Texto,
        InduccionVideo: courseDetails.InduccionVideo,
        InduccionVideo2: courseDetails.InduccionVideo2,
        InduccionVideo3: courseDetails.InduccionVideo3,
        InduccionVideo4: courseDetails.InduccionVideo4,
        preguntas: Array.from(questionsMap.values()),
      };

      console.log("Course details query result:", {
        id,
        questionsCount: course.preguntas?.length || 0,
      });

      return NextResponse.json(course);
    }

    // Get all courses with basic info only
    const query = `
      SELECT 
        lr.Id,
        lr.Curso,
        lr.\`Existe Plataforma Interna\`,
        COALESCE(cp.TotalPreguntas, 0) AS \`Total Preguntas\`,
        lr.Entidad,
        lr.Horas,
        lr.Modalidad,
        lr.\`Ano Programacion\`,
        lr.\`Mes Programacion\`,
        lr.Antiguedad,
        lr.Clasificacion,
        lr.Ciudad,
        lr.Proyecto,
        lr.Estado,
        lr.Lugar,
        lr.CC,
        lr.Cargo,
        lr.IdEmpleado,
        lr.AplicaEficiencia
      FROM listaReglas lr
      LEFT JOIN cap_TotalPreguntas cp ON lr.Id = cp.IdEvaluacion
      ORDER BY lr.\`Existe Plataforma Interna\` DESC, lr.Id DESC`;

    const [rows] = await conn.execute(query);

    await conn.end();

    // Transform the result into courses
    const courses: Course[] = (rows as any[]).map((row) => ({
      Id: row.Id,
      Curso: row.Curso,
      "Existe Plataforma Interna": row["Existe Plataforma Interna"],
      "Total Preguntas": row["Total Preguntas"],
      Entidad: row.Entidad,
      Horas: row.Horas,
      Modalidad: row.Modalidad,
      "Ano Programacion": row["Ano Programacion"],
      "Mes Programacion": row["Mes Programacion"],
      Antiguedad: row.Antiguedad,
      Clasificacion: row.Clasificacion,
      Ciudad: row.Ciudad,
      Proyecto: row.Proyecto,
      Estado: row.Estado,
      Lugar: row.Lugar,
      CC: row.CC,
      Cargo: row.Cargo,
      IdEmpleado: row.IdEmpleado,
      AplicaEficiencia: row.AplicaEficiencia,
      // Legacy fields for backward compatibility
      Nombre: row.Curso,
      Texto: "",
      InduccionVideo: "",
      InduccionVideo2: "",
      InduccionVideo3: "",
      InduccionVideo4: "",
      preguntas: [],
    }));

    return NextResponse.json({
      courses,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      nombre,
      entidad,
      horas,
      modalidad,
      mesProgramacion,
      anoProgramacion,
      antiguedad,
      clasificacion,
      ciudad,
      aplicaEficiencia,
    } = body;

    const conn = await getConnection();

    try {
      // Update the course in listaReglas table
      const updateQuery = `
        UPDATE listaReglas
        SET 
          Curso = ?,
          Entidad = ?,
          Horas = ?,
          Modalidad = ?,
          \`Mes Programacion\` = ?,
          \`Ano Programacion\` = ?,
          Antiguedad = ?,
          Clasificacion = ?,
          Ciudad = ?,
          AplicaEficiencia = ?
        WHERE Id = ?
      `;

      await conn.execute(updateQuery, [
        nombre,
        entidad,
        horas,
        modalidad,
        mesProgramacion,
        anoProgramacion,
        antiguedad,
        clasificacion,
        ciudad,
        parseInt(aplicaEficiencia) || 0,
        id,
      ]);

      await conn.end();

      return NextResponse.json({
        success: true,
        message: "Curso actualizado exitosamente",
      });
    } catch (error) {
      await conn.end();
      throw error;
    }
  } catch (error: any) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar el curso" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nombre,
      entidad,
      horas,
      modalidad,
      mesProgramacion,
      anoProgramacion,
      clasificacion,
      tipo,
      porcentajeAprobacion,
      tiempoMaximo,
      repeticionesMaximo,
      texto,
      induccionVideo,
      induccionVideo2,
      induccionVideo3,
      induccionVideo4,
      preguntas,
      assignment,
    } = body;

    // Validate required fields
    const missingFields = [];
    if (!nombre?.trim()) missingFields.push("nombre");
    if (!entidad?.trim()) missingFields.push("entidad");
    if (!modalidad?.trim()) missingFields.push("modalidad");
    if (!mesProgramacion?.trim()) missingFields.push("mes programación");
    if (!anoProgramacion?.trim()) missingFields.push("año programación");
    if (!clasificacion?.trim()) missingFields.push("clasificación");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Los siguientes campos son obligatorios: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const conn = await getConnection();

    try {
      await conn.beginTransaction();

      // Determine antiguedad and ciudad based on assignment
      let antiguedad = "";
      let ciudad = "";
      let lugar = "";
      let cc = "";

      if (assignment) {
        if (assignment.type === "lugar") {
          lugar = assignment.value;
        } else if (assignment.type === "ciudad") {
          ciudad = assignment.value;
        } else if (assignment.type === "cc") {
          cc = assignment.value;
        }
      }

      // Insert the new course into listaReglas table
      const insertQuery = `
        INSERT INTO listaReglas (
          Curso,
          Entidad,
          Horas,
          Modalidad,
          \`Mes Programacion\`,
          \`Ano Programacion\`,
          Antiguedad,
          Clasificacion,
          Ciudad,
          Lugar,
          CC,
          AplicaEficiencia,
          \`Existe Plataforma Interna\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `;

      const [result] = await conn.execute(insertQuery, [
        nombre,
        entidad,
        horas ? parseInt(horas) : 0,
        modalidad,
        mesProgramacion,
        anoProgramacion,
        antiguedad,
        clasificacion,
        ciudad,
        lugar,
        cc,
        parseInt(body.aplicaEficiencia) || 0,
      ]);

      const courseId = (result as any).insertId;

      // Insert into cap_evaluacion table
      const capEvaluacionQuery = `
        INSERT INTO cap_evaluacion (
          Id,
          Nombre,
          Tipo,
          Publicado,
          PorcentajeAprobacion,
          TiempoMaximo,
          RepeticionesMaximo,
          Texto,
          InduccionImagen,
          InduccionVideo,
          InduccionVideo2,
          InduccionVideo3,
          InduccionVideo4
        ) VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await conn.execute(capEvaluacionQuery, [
        courseId,
        nombre,
        tipo || "RecursoHumano",
        parseInt(porcentajeAprobacion),
        parseInt(tiempoMaximo) || 0,
        parseInt(repeticionesMaximo) || 0,
        texto || "",
        "",
        induccionVideo || "",
        induccionVideo2 || "",
        induccionVideo3 || "",
        induccionVideo4 || "",
      ]);

      // Insert questions and answers if provided
      if (preguntas && Array.isArray(preguntas) && preguntas.length > 0) {
        for (const pregunta of preguntas) {
          // Insert question
          const preguntaQuery = `
            INSERT INTO cap_pregunta (
              IdEvaluacion,
              Pregunta,
              tipo,
              desordenarPreguntas,
              valor
            ) VALUES (?, ?, ?, ?, ?)
          `;

          const [preguntaResult] = await conn.execute(preguntaQuery, [
            courseId,
            pregunta.Pregunta || pregunta.texto,
            pregunta.tipo || 1,
            pregunta.desordenarPreguntas ? 1 : 0,
            pregunta.valor || 1,
          ]);

          const preguntaId = (preguntaResult as any).insertId;

          if (
            pregunta.respuestas &&
            Array.isArray(pregunta.respuestas) &&
            pregunta.respuestas.length > 0
          ) {
            for (let i = 0; i < pregunta.respuestas.length; i++) {
              const respuesta = pregunta.respuestas[i];
              const respuestaQuery = `
                INSERT INTO cap_respuesta (
                  Id,
                  IdPregunta,
                  IdEvaluacion,
                  txtRespuesta,
                  txtFeedBack,
                  Ok
                ) VALUES (?, ?, ?, ?, ?, ?)
              `;

              await conn.execute(respuestaQuery, [
                i + 1,
                preguntaId,
                courseId,
                respuesta.txtRespuesta || respuesta.texto,
                respuesta.txtFeedBack || "",
                respuesta.Ok ? 1 : 0,
              ]);
            }
          }
        }
      }

      // Assign course to employees based on assignment criteria
      if (assignment && assignment.type && assignment.value) {
        let employeeQuery = "";
        let queryParams: any[] = [];

        if (assignment.type === "ids") {
          // Split comma-separated IDs and clean them
          const ids = assignment.value
            .split(",")
            .map((id: string) => id.trim())
            .filter((id: string) => id);

          if (ids.length > 0) {
            employeeQuery = `
              SELECT IdEmpleado 
              FROM \`09_ContratoActual\` 
              WHERE IdEmpleado IN (${ids.map(() => "?").join(",")})
            `;
            queryParams = ids;
          }
        } else if (assignment.type === "lugar") {
          employeeQuery = `
            SELECT IdEmpleado 
            FROM \`09_ContratoActual\` 
            WHERE \`Lugar actual\` = ?
          `;
          queryParams = [assignment.value];
        } else if (assignment.type === "ciudad") {
          employeeQuery = `
            SELECT IdEmpleado 
            FROM \`09_ContratoActual\` 
            WHERE \`Ciudad actual\` = ?
          `;
          queryParams = [assignment.value];
        } else if (assignment.type === "cc") {
          employeeQuery = `
            SELECT IdEmpleado 
            FROM \`09_ContratoActual\` 
            WHERE \`Centro de costos actual\` = ?
          `;
          queryParams = [assignment.value];
        }

        if (employeeQuery) {
          const [employees] = await conn.execute(employeeQuery, queryParams);

          // Insert into 23_Capacitacion for each employee
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

              await conn.execute(capacitacionQuery, [
                employee.IdEmpleado,
                courseId,
                nombre,
                entidad,
                horas ? parseInt(horas) : 0,
                modalidad,
                anoProgramacion,
                mesProgramacion,
                clasificacion,
              ]);
            }
          }
        }
      }

      await conn.commit();
      await conn.end();

      return NextResponse.json({
        success: true,
        message: "Curso creado exitosamente",
        courseId: courseId,
      });
    } catch (error) {
      await conn.rollback();
      await conn.end();
      throw error;
    }
  } catch (error: any) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear el curso" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const conn = await getConnection();

    try {
      await conn.beginTransaction();

      // First, delete all capacitacion records for this course
      const deleteCapacitacionQuery = `
        DELETE FROM 23_Capacitacion WHERE IdCurso = ?
      `;
      await conn.execute(deleteCapacitacionQuery, [id]);

      // Get all question IDs for this course to delete answers
      const getQuestionsQuery = `
        SELECT Id FROM cap_pregunta WHERE IdEvaluacion = ?
      `;
      const [questions] = await conn.execute(getQuestionsQuery, [id]);

      // Delete answers for each question
      if ((questions as any[]).length > 0) {
        const questionIds = (questions as any[]).map((q) => q.Id);
        const deleteAnswersQuery = `
          DELETE FROM cap_respuesta WHERE IdPregunta IN (${questionIds.join(",")})
        `;
        await conn.execute(deleteAnswersQuery);
      }

      // Delete questions
      const deleteQuestionsQuery = `
        DELETE FROM cap_pregunta WHERE IdEvaluacion = ?
      `;
      await conn.execute(deleteQuestionsQuery, [id]);

      // Delete from cap_evaluacion
      const deleteEvaluacionQuery = `
        DELETE FROM cap_evaluacion WHERE Id = ?
      `;
      await conn.execute(deleteEvaluacionQuery, [id]);

      // Finally, delete the course from listaReglas table
      const deleteQuery = `DELETE FROM listaReglas WHERE Id = ?`;
      const [result] = await conn.execute(deleteQuery, [id]);

      const affectedRows = (result as any).affectedRows;

      await conn.commit();
      await conn.end();

      if (affectedRows === 0) {
        return NextResponse.json(
          { error: "Curso no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Curso eliminado exitosamente",
      });
    } catch (error) {
      await conn.rollback();
      await conn.end();
      throw error;
    }
  } catch (error: any) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: error.message || "Error al eliminar el curso" },
      { status: 500 }
    );
  }
}
