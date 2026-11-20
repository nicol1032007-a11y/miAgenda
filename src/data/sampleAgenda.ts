import { ClassSession, StudyNote, StudyTask } from '../types/agenda';
import { toIsoDate } from '../utils/dateUtils';

export function getTodayIso(): string {
  return toIsoDate(new Date());
}

export const TODAY_ISO = getTodayIso();

export const SAMPLE_CLASSES: ClassSession[] = [
  {
    id: 'class-1',
    title: 'Introducción a Google AI Studio y modelos Gemini',
    module: 'Módulo 1 · Fundamentos',
    date: '2026-11-16',
    startTime: '18:00',
    endTime: '19:30',
    instructorOrRoom: 'Sesión en vivo · Sala A',
  },
  {
    id: 'class-2',
    title: 'System Instructions y diseño de prompts claros',
    module: 'Módulo 2 · Ingeniería de Prompts',
    date: '2026-11-17',
    startTime: '18:00',
    endTime: '19:30',
    instructorOrRoom: 'Sesión en vivo · Sala A',
  },
  {
    id: 'class-3',
    title: 'Parámetros del modelo: Temperatura, Top-P y tokens',
    module: 'Módulo 3 · Configuración',
    date: '2026-11-19',
    startTime: '18:00',
    endTime: '19:30',
    instructorOrRoom: 'Sesión en vivo · Sala B',
  },
  {
    id: 'class-4',
    title: 'Salidas estructuradas JSON y pruebas de evaluación',
    module: 'Módulo 4 · Taller práctico',
    date: '2026-11-21',
    startTime: '10:00',
    endTime: '12:00',
    instructorOrRoom: 'Taller guiado · En línea',
  },
];

export const SAMPLE_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    title: 'Crear primer proyecto en Google AI Studio',
    description:
      'Abrir un nuevo Freeform Prompt, seleccionar el modelo Gemini adecuado y guardar la primera prueba.',
    dueDate: '2026-11-16',
    status: 'completada',
    priority: 'Media',
  },
  {
    id: 'task-2',
    title: 'Repasar guía de filtros y ajustes de seguridad',
    description:
      'Leer los niveles de bloqueo disponibles en Google AI Studio y anotar cuándo conviene ajustarlos.',
    dueDate: '2026-11-17',
    status: 'completada',
    priority: 'Baja',
  },
  {
    id: 'task-3',
    title: 'Redactar System Instructions para tutor de estudio',
    description:
      'Definir el rol, tono amable, idioma español y reglas claras de respuesta en el panel de instrucciones.',
    dueDate: '2026-11-18',
    status: 'pendiente',
    priority: 'Alta',
  },
  {
    id: 'task-4',
    title: 'Comparar temperatura 0.2 frente a 0.9',
    description:
      'Ejecutar el mismo prompt de resumen tres veces con cada valor y registrar diferencias de precisión.',
    dueDate: '2026-11-19',
    status: 'pendiente',
    priority: 'Media',
  },
  {
    id: 'task-5',
    title: 'Definir esquema JSON para tarjetas de repaso',
    description:
      'Configurar Structured Output con campos de pregunta, respuesta corta y nivel de dificultad.',
    dueDate: '2026-11-21',
    status: 'pendiente',
    priority: 'Alta',
  },
];

export const SAMPLE_NOTES: StudyNote[] = [
  {
    id: 'note-1',
    title: 'Estructura básica de un prompt efectivo',
    topic: 'Diseño de Prompts',
    content:
      'Un buen prompt combina cuatro piezas: rol o contexto, tarea específica, restricciones de formato y uno o dos ejemplos (few-shot). En Google AI Studio conviene probar versiones cortas antes de añadir demasiadas reglas.',
    updatedAt: '2026-11-16',
  },
  {
    id: 'note-2',
    title: 'Cómo usar System Instructions',
    topic: 'System Instructions',
    content:
      'Las instrucciones del sistema permanecen fijas durante toda la conversación. Sirven para definir el idioma, la personalidad y qué debe evitar el modelo sin repetirlo en cada mensaje del usuario.',
    updatedAt: '2026-11-17',
  },
  {
    id: 'note-3',
    title: 'Temperatura y control de creatividad',
    topic: 'Parámetros del modelo',
    content:
      'Valores bajos de temperatura (0.0 a 0.3) producen respuestas más predecibles y útiles para resumir o extraer datos. Valores entre 0.7 y 1.0 ayudan en lluvias de ideas o redacción creativa.',
    updatedAt: '2026-11-17',
  },
  {
    id: 'note-4',
    title: 'Ventajas de la salida estructurada (JSON)',
    topic: 'Salidas estructuradas',
    content:
      'Al activar Structured Output definimos exactamente qué propiedades y tipos de datos debe devolver el modelo, evitando texto adicional que dificulte procesar los resultados.',
    updatedAt: '2026-11-17',
  },
];
