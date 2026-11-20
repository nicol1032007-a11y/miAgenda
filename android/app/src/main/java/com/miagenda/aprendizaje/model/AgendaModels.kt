package com.miagenda.aprendizaje.model

import java.time.LocalDate

enum class PriorityLevel(val label: String) {
    BAJA("Baja"),
    MEDIA("Media"),
    ALTA("Alta")
}

enum class TaskStatus(val label: String) {
    PENDIENTE("Pendiente"),
    COMPLETADA("Completada")
}

enum class AppSection(val label: String) {
    INICIO("Inicio"),
    CALENDARIO("Calendario"),
    TAREAS("Tareas"),
    NOTAS("Notas"),
    PROGRESO("Progreso")
}

data class StudyTask(
    val id: String,
    val title: String,
    val description: String,
    val dueDate: LocalDate = LocalDate.now(),
    val status: TaskStatus = TaskStatus.PENDIENTE,
    val priority: PriorityLevel = PriorityLevel.MEDIA
)

data class ClassSession(
    val id: String,
    val title: String,
    val module: String,
    val date: LocalDate = LocalDate.now(),
    val startTime: String,
    val endTime: String,
    val room: String
)

data class StudyNote(
    val id: String,
    val title: String,
    val topic: String,
    val content: String,
    val updatedAt: LocalDate = LocalDate.now()
)

object SampleAgendaData {
    fun initialTasks(today: LocalDate = LocalDate.now()): List<StudyTask> = listOf(
        StudyTask(
            id = "task-1",
            title = "Crear primer proyecto en Google AI Studio",
            description = "Abrir un nuevo Freeform Prompt, elegir Gemini y guardar la primera prueba.",
            dueDate = today.minusDays(1),
            status = TaskStatus.COMPLETADA,
            priority = PriorityLevel.MEDIA
        ),
        StudyTask(
            id = "task-2",
            title = "Repasar guía de filtros y ajustes de seguridad",
            description = "Revisar los niveles de bloqueo disponibles en Google AI Studio.",
            dueDate = today,
            status = TaskStatus.COMPLETADA,
            priority = PriorityLevel.BAJA
        ),
        StudyTask(
            id = "task-3",
            title = "Redactar System Instructions para tutor de estudio",
            description = "Definir el rol, idioma español y reglas claras de respuesta.",
            dueDate = today.plusDays(1),
            status = TaskStatus.PENDIENTE,
            priority = PriorityLevel.ALTA
        ),
        StudyTask(
            id = "task-4",
            title = "Comparar temperatura 0.2 frente a 0.9",
            description = "Ejecutar el mismo prompt tres veces y anotar diferencias de precisión.",
            dueDate = today.plusDays(2),
            status = TaskStatus.PENDIENTE,
            priority = PriorityLevel.MEDIA
        )
    )
}
