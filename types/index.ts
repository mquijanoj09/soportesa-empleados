export interface Answer {
  Id: number;
  txtRespuesta: string;
  Ok: boolean;
}

export interface Question {
  Id: number;
  Pregunta: string;
  tipo: number;
  respuestas: Answer[];
}

export interface Course {
  Id: number;
  Nombre: string;
  Texto: string;
  InduccionVideo: string;
  InduccionVideo2: string;
  InduccionVideo3: string;
  InduccionVideo4: string;
  preguntas: Question[];
}

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
}
