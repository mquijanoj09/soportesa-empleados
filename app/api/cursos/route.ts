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
        AplicaEficiencia: Boolean(courseData.AplicaEficiencia),
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
      AplicaEficiencia: Boolean(row.AplicaEficiencia),
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
