package com.miagenda.aprendizaje.viewmodel

import com.miagenda.aprendizaje.model.PriorityLevel
import com.miagenda.aprendizaje.model.SampleAgendaData
import com.miagenda.aprendizaje.model.StudyTask
import com.miagenda.aprendizaje.model.TaskStatus
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import java.time.LocalDate

sealed interface SaveTaskResult {
    data object Success : SaveTaskResult
    data class ValidationError(val message: String) : SaveTaskResult
}

class AgendaViewModel {
    private val _tasks = MutableStateFlow(SampleAgendaData.initialTasks())
    val tasks: StateFlow<List<StudyTask>> = _tasks.asStateFlow()

    fun saveTask(
        titleInput: String,
        descriptionInput: String,
        selectedDate: LocalDate?,
        priority: PriorityLevel,
        status: TaskStatus = TaskStatus.PENDIENTE,
        editingTaskId: String? = null
    ): SaveTaskResult {
        val cleanTitle = titleInput.trim()
        if (cleanTitle.isEmpty()) {
            return SaveTaskResult.ValidationError(
                "Debes escribir el nombre de la actividad."
            )
        }

        val effectiveDate = selectedDate ?: LocalDate.now()
        val cleanDescription = descriptionInput.trim().ifEmpty {
            "Actividad práctica del curso de Google AI Studio."
        }

        if (editingTaskId != null) {
            _tasks.update { list ->
                list.map { existing ->
                    if (existing.id == editingTaskId) {
                        existing.copy(
                            title = cleanTitle,
                            description = cleanDescription,
                            dueDate = effectiveDate,
                            priority = priority,
                            status = status
                        )
                    } else {
                        existing
                    }
                }
            }
        } else {
            val newTask = StudyTask(
                id = "task-${System.currentTimeMillis()}",
                title = cleanTitle,
                description = cleanDescription,
                dueDate = effectiveDate,
                status = status,
                priority = priority
            )
            _tasks.update { list -> listOf(newTask) + list }
        }

        return SaveTaskResult.Success
    }

    fun toggleTaskStatus(taskId: String) {
        _tasks.update { list ->
            list.map { task ->
                if (task.id == taskId) {
                    val nextStatus = if (task.status == TaskStatus.COMPLETADA) {
                        TaskStatus.PENDIENTE
                    } else {
                        TaskStatus.COMPLETADA
                    }
                    task.copy(status = nextStatus)
                } else {
                    task
                }
            }
        }
    }

    fun deleteTask(taskId: String) {
        _tasks.update { list -> list.filterNot { it.id == taskId } }
    }
}
