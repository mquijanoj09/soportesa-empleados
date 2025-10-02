import { getConnection } from "@/lib/bd-connection";
import { Course } from "@/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");

    const conn = await getConnection();

    // If requesting a specific course by ID, return the full course data
    if (id) {
      let query = `
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
        ORDER BY e.Id DESC, p.Id, r.Id`;

      const [rows] = await conn.execute(query, [id]);
      console.log("Course details query result:", {
        id,
        rowCount: (rows as any[]).length,
      });
      await conn.end();

      // Transform the flat result into the nested structure
      const coursesMap = new Map<number, Course>();

      (rows as any[]).forEach((row) => {
        const evaluacionId = row.evaluacion_id;

        // Create or get the course
        if (!coursesMap.has(evaluacionId)) {
          coursesMap.set(evaluacionId, {
            Id: evaluacionId,
            Nombre: row.evaluacion_nombre,
            Texto: row.evaluacion_texto,
            InduccionVideo: row.evaluacion_video1 || "",
            InduccionVideo2: row.evaluacion_video2 || "",
            InduccionVideo3: row.evaluacion_video3 || "",
            InduccionVideo4: row.evaluacion_video4 || "",
            preguntas: [],
          });
        }

        const course = coursesMap.get(evaluacionId)!;

        // Add question if it exists and hasn't been added yet
        if (row.pregunta_id) {
          let question = course.preguntas.find((q) => q.Id === row.pregunta_id);

          if (!question) {
            question = {
              Id: row.pregunta_id,
              Pregunta: row.pregunta_texto,
              tipo: row.pregunta_tipo,
              respuestas: [],
            };
            course.preguntas.push(question);
          }

          // Add answer if it exists and hasn't been added yet
          if (
            row.respuesta_id &&
            !question.respuestas.find((a) => a.Id === row.respuesta_id)
          ) {
            question.respuestas.push({
              Id: row.respuesta_id,
              txtRespuesta: row.respuesta_texto,
              Ok: Boolean(row.respuesta_correcta),
            });
          }
        }
      });

      const courses = Array.from(coursesMap.values());
      console.log("Processed courses:", courses.length);

      if (courses.length === 0) {
        console.log("No course found for ID:", id);
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(courses[0]);
    }

    // For paginated course list, we only need basic course info
    const offset = (page - 1) * limit;

    // Get total count first
    const countQuery = `SELECT COUNT(DISTINCT e.Id) as total FROM cap_evaluacion e`;
    const [countResult] = await conn.execute(countQuery);
    const totalCourses = (countResult as any[])[0].total;

    // Get paginated courses with basic info only
    const query = `
      SELECT DISTINCT
        e.Id as evaluacion_id,
        e.Nombre as evaluacion_nombre,
        e.Texto as evaluacion_texto
      FROM cap_evaluacion e
      ORDER BY e.Id DESC
      LIMIT ? OFFSET ?`;

    const [rows] = await conn.execute(query, [limit, offset]);

    await conn.end();

    // Transform the flat result into courses with basic info (no questions/answers for list view)
    const courses: Course[] = (rows as any[]).map((row) => ({
      Id: row.evaluacion_id,
      Nombre: row.evaluacion_nombre,
      Texto: row.evaluacion_texto,
      InduccionVideo: "",
      InduccionVideo2: "",
      InduccionVideo3: "",
      InduccionVideo4: "",
      preguntas: [], // Empty for list view - will be loaded when course is selected
    }));

    const totalPages = Math.ceil(totalCourses / limit);

    return NextResponse.json({
      courses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCourses,
        coursesPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
