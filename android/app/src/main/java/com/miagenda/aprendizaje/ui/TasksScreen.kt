package com.miagenda.aprendizaje.ui

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.miagenda.aprendizaje.model.PriorityLevel
import com.miagenda.aprendizaje.model.StudyTask
import com.miagenda.aprendizaje.model.TaskStatus
import com.miagenda.aprendizaje.viewmodel.SaveTaskResult
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.Locale
import kotlin.math.roundToInt

private val SPANISH_DATE_FORMAT =
    DateTimeFormatter.ofPattern("d MMM yyyy", Locale("es", "ES"))

fun formatActivityDate(date: LocalDate, today: LocalDate = LocalDate.now()): String {
    return when (date) {
        today -> "Hoy"
        today.plusDays(1) -> "Mañana"
        else -> date.format(SPANISH_DATE_FORMAT)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TasksScreen(
    tasks: List<StudyTask>,
    onSaveTask: (
        title: String,
        description: String,
        dueDate: LocalDate?,
        priority: PriorityLevel,
        status: TaskStatus,
        editingId: String?
    ) -> SaveTaskResult,
    onToggleTask: (String) -> Unit,
    onDeleteTask: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var showFormSheet by remember { mutableStateOf(false) }
    var editingTask by remember { mutableStateOf<StudyTask?>(null) }
    var searchQuery by remember { mutableStateOf("") }

    val filteredTasks = remember(tasks, searchQuery) {
        val query = searchQuery.trim()
        if (query.isEmpty()) {
            tasks
        } else {
            tasks.filter { it.title.contains(query, ignoreCase = true) }
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        // Tarjeta pequeña de resumen encima de la lista de tareas
        TaskProgressSummaryCard(
            tasks = tasks,
            onAddClick = {
                editingTask = null
                showFormSheet = true
            }
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Barra de búsqueda en la parte superior de la lista de tareas
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Buscar actividad por nombre...") },
            leadingIcon = {
                Icon(Icons.Filled.Search, contentDescription = "Buscar")
            },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { searchQuery = "" }) {
                        Icon(Icons.Filled.Close, contentDescription = "Limpiar búsqueda")
                    }
                }
            },
            singleLine = true,
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        if (filteredTasks.isEmpty()) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp)
                ) {
                    Text(
                        text = if (searchQuery.isNotBlank()) {
                            "No se encontraron actividades con ese nombre"
                        } else {
                            "No hay actividades registradas"
                        },
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.SemiBold
                    )
                    if (searchQuery.isNotBlank()) {
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedButton(onClick = { searchQuery = "" }) {
                            Text("Limpiar búsqueda")
                        }
                    }
                }
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filteredTasks, key = { it.id }) { task ->
                    TaskCardItem(
                        task = task,
                        onToggle = { onToggleTask(task.id) },
                        onEdit = {
                            editingTask = task
                            showFormSheet = true
                        },
                        onDelete = { onDeleteTask(task.id) }
                    )
                }
            }
        }
    }

    if (showFormSheet) {
        TaskFormBottomSheet(
            initialTask = editingTask,
            onDismiss = {
                editingTask = null
                showFormSheet = false
            },
            onSubmit = { title, desc, date, priority, status ->
                val result = onSaveTask(
                    title,
                    desc,
                    date,
                    priority,
                    status,
                    editingTask?.id
                )
                if (result is SaveTaskResult.Success) {
                    editingTask = null
                    showFormSheet = false
                }
                result
            }
        )
    }
}

@Composable
private fun TaskProgressSummaryCard(
    tasks: List<StudyTask>,
    onAddClick: () -> Unit
) {
    val totalCount = tasks.size
    val completedCount = tasks.count { it.status == TaskStatus.COMPLETADA }
    val pendingCount = totalCount - completedCount
    val progress = if (totalCount == 0) 0f else completedCount.toFloat() / totalCount.toFloat()
    val percentage = (progress * 100f).roundToInt()
    val accentColor = if (totalCount > 0 && completedCount == totalCount) {
        Color(0xFF16A34A)
    } else {
        Color(0xFF2563EB)
    }

    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    // Círculo de porcentaje
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier.size(52.dp)
                    ) {
                        Canvas(modifier = Modifier.fillMaxSize()) {
                            val stroke = Stroke(width = 5.dp.toPx(), cap = StrokeCap.Round)
                            drawArc(
                                color = Color(0xFFE2E8F0),
                                startAngle = -90f,
                                sweepAngle = 360f,
                                useCenter = false,
                                style = stroke
                            )
                            drawArc(
                                color = accentColor,
                                startAngle = -90f,
                                sweepAngle = 360f * progress,
                                useCenter = false,
                                style = stroke
                            )
                        }
                        Text(
                            text = "$percentage%",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column {
                        Text(
                            text = "Tareas y actividades",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "$completedCount completadas · $pendingCount pendientes",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color(0xFF475569)
                        )
                    }
                }

                Button(
                    onClick = onAddClick,
                    modifier = Modifier.height(48.dp)
                ) {
                    Text("Agregar")
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Barra de progreso visual
            LinearProgressIndicator(
                progress = { progress },
                color = accentColor,
                trackColor = Color(0xFFF1F5F9),
                strokeCap = StrokeCap.Round,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(10.dp)
            )
        }
    }
}

@Composable
private fun TaskCardItem(
    task: StudyTask,
    onToggle: () -> Unit,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    val isDone = task.status == TaskStatus.COMPLETADA

    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                PriorityIndicator(priority = task.priority)
                Text(
                    text = task.status.label,
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = if (isDone) Color(0xFF15803D) else Color(0xFFB45309)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Nombre de la actividad junto a su fecha
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Text(
                    text = task.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    textDecoration = if (isDone) TextDecoration.LineThrough else null,
                    color = if (isDone) Color(0xFF94A3B8) else Color(0xFF0F172A),
                    modifier = Modifier.weight(1f)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = formatActivityDate(task.dueDate),
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF1D4ED8)
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = task.description,
                style = MaterialTheme.typography.bodyMedium,
                color = Color(0xFF475569)
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                OutlinedButton(
                    onClick = onToggle,
                    modifier = Modifier
                        .weight(1f)
                        .height(44.dp)
                ) {
                    Text(if (isDone) "Reabrir" else "Completar")
                }
                OutlinedButton(
                    onClick = onEdit,
                    modifier = Modifier.height(44.dp)
                ) {
                    Text("Editar")
                }
                OutlinedButton(
                    onClick = onDelete,
                    modifier = Modifier.height(44.dp)
                ) {
                    Text("Eliminar", color = Color(0xFFBE123C))
                }
            }
        }
    }
}

@Composable
fun PriorityIndicator(priority: PriorityLevel) {
    val (bgColor, borderColor, textColor, dotColor) = when (priority) {
        PriorityLevel.ALTA -> listOf(
            Color(0xFFFFF1F2),
            Color(0xFFFECDD3),
            Color(0xFFBE123C),
            Color(0xFFE11D48)
        )
        PriorityLevel.MEDIA -> listOf(
            Color(0xFFFFFBEB),
            Color(0xFFFDE68A),
            Color(0xFF92400E),
            Color(0xFFF59E0B)
        )
        PriorityLevel.BAJA -> listOf(
            Color(0xFFECFDF5),
            Color(0xFFA7F3D0),
            Color(0xFF065F46),
            Color(0xFF059669)
        )
    }

    Surface(
        shape = RoundedCornerShape(6.dp),
        color = bgColor,
        border = BorderStroke(1.dp, borderColor)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(dotColor)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "Prioridad ${priority.label}",
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.SemiBold,
                color = textColor
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun TaskFormBottomSheet(
    initialTask: StudyTask?,
    onDismiss: () -> Unit,
    onSubmit: (
        title: String,
        description: String,
        dueDate: LocalDate?,
        priority: PriorityLevel,
        status: TaskStatus
    ) -> SaveTaskResult
) {
    var title by remember { mutableStateOf(initialTask?.title ?: "") }
    var description by remember { mutableStateOf(initialTask?.description ?: "") }
    var selectedDate by remember { mutableStateOf(initialTask?.dueDate ?: LocalDate.now()) }
    var selectedPriority by remember { mutableStateOf(initialTask?.priority ?: PriorityLevel.MEDIA) }
    var validationMessage by remember { mutableStateOf<String?>(null) }
    var showDatePicker by remember { mutableStateOf(false) }

    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(
            verticalArrangement = Arrangement.spacedBy(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 8.dp)
        ) {
            Text(
                text = if (initialTask == null) "Nueva actividad" else "Editar actividad",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )

            OutlinedTextField(
                value = title,
                onValueChange = {
                    title = it
                    if (it.trim().isNotEmpty()) {
                        validationMessage = null
                    }
                },
                label = { Text("Nombre de la actividad") },
                isError = validationMessage != null,
                supportingText = validationMessage?.let { msg ->
                    { Text(text = msg, color = MaterialTheme.colorScheme.error) }
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = description,
                onValueChange = { description = it },
                label = { Text("Descripción") },
                minLines = 2,
                modifier = Modifier.fillMaxWidth()
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Fecha de entrega",
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = formatActivityDate(selectedDate),
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color(0xFF1D4ED8)
                    )
                }
                OutlinedButton(
                    onClick = { showDatePicker = true },
                    modifier = Modifier.height(44.dp)
                ) {
                    Text("Elegir fecha")
                }
            }

            Column {
                Text(
                    text = "Nivel de prioridad",
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    PriorityLevel.entries.forEach { level ->
                        FilterChip(
                            selected = selectedPriority == level,
                            onClick = { selectedPriority = level },
                            label = { Text(level.label) },
                            modifier = Modifier
                                .weight(1f)
                                .height(44.dp)
                        )
                    }
                }
            }

            Button(
                onClick = {
                    val result = onSubmit(
                        title,
                        description,
                        selectedDate,
                        selectedPriority,
                        initialTask?.status ?: TaskStatus.PENDIENTE
                    )
                    if (result is SaveTaskResult.ValidationError) {
                        validationMessage = result.message
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Text(if (initialTask == null) "Agregar actividad" else "Guardar cambios")
            }

            TextButton(
                onClick = onDismiss,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(44.dp)
            ) {
                Text("Cancelar")
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }

    if (showDatePicker) {
        val initialMillis = selectedDate.atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli()
        val datePickerState = rememberDatePickerState(initialSelectedDateMillis = initialMillis)
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        val pickedMillis = datePickerState.selectedDateMillis
                        selectedDate = if (pickedMillis != null) {
                            Instant.ofEpochMilli(pickedMillis).atZone(ZoneOffset.UTC).toLocalDate()
                        } else {
                            LocalDate.now()
                        }
                        showDatePicker = false
                    }
                ) {
                    Text("Aceptar")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDatePicker = false }) {
                    Text("Cancelar")
                }
            }
        ) {
            DatePicker(state = datePickerState)
        }
    }
}
