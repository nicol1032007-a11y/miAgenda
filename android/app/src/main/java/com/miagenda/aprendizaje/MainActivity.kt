package com.miagenda.aprendizaje

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CheckBox
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Home
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.miagenda.aprendizaje.model.AppSection
import com.miagenda.aprendizaje.ui.TasksScreen
import com.miagenda.aprendizaje.viewmodel.AgendaViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val viewModel = AgendaViewModel()
        setContent {
            MaterialTheme {
                MiAgendaMobileApp(viewModel = viewModel)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MiAgendaMobileApp(viewModel: AgendaViewModel) {
    var currentSection by remember { mutableStateOf(AppSection.INICIO) }
    val tasks by viewModel.tasks.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Mi Agenda · ${currentSection.label}") }
            )
        },
        bottomBar = {
            NavigationBar {
                AppSection.entries.forEach { section ->
                    val icon = when (section) {
                        AppSection.INICIO -> Icons.Filled.Home
                        AppSection.CALENDARIO -> Icons.Filled.CalendarMonth
                        AppSection.TAREAS -> Icons.Filled.CheckBox
                        AppSection.NOTAS -> Icons.Filled.Description
                        AppSection.PROGRESO -> Icons.Filled.BarChart
                    }
                    NavigationBarItem(
                        selected = currentSection == section,
                        onClick = { currentSection = section },
                        icon = { Icon(icon, contentDescription = section.label) },
                        label = { Text(section.label) }
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (currentSection) {
                AppSection.TAREAS -> TasksScreen(
                    tasks = tasks,
                    onSaveTask = viewModel::saveTask,
                    onToggleTask = viewModel::toggleTaskStatus,
                    onDeleteTask = viewModel::deleteTask
                )
                else -> TasksScreen(
                    tasks = tasks,
                    onSaveTask = viewModel::saveTask,
                    onToggleTask = viewModel::toggleTaskStatus,
                    onDeleteTask = viewModel::deleteTask
                )
            }
        }
    }
}
