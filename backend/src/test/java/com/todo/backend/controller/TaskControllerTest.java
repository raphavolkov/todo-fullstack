package com.todo.backend.controller;

import tools.jackson.databind.ObjectMapper;
import com.todo.backend.domain.Task;
import com.todo.backend.dto.TaskRequestDTO;
import com.todo.backend.exception.TaskNotFoundException;
import com.todo.backend.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockitoBean
        private TaskService taskService;

        @Test
        void deveCriarTask() throws Exception {
                // Arrange
                TaskRequestDTO request = new TaskRequestDTO("Estudar", "Controller test");
                Task taskResponse = new Task("Estudar", "Controller test");

                when(taskService.create(any(Task.class))).thenReturn(taskResponse);

                // Act & Assert
                mockMvc.perform(post("/api/tasks")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.title").value("Estudar"))
                                .andExpect(jsonPath("$.description").value("Controller test"))
                                .andExpect(jsonPath("$.completed").value(false));
        }

        @Test
        void naoDeveCriarTaskComTituloInvalido() throws Exception {
                TaskRequestDTO request = new TaskRequestDTO("", "Desc");

                mockMvc.perform(post("/api/tasks")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void deveListarTasks() throws Exception {
                Task t1 = new Task("Task 1", null);
                Task t2 = new Task("Task 2", null);

                when(taskService.findAll()).thenReturn(List.of(t1, t2));

                mockMvc.perform(get("/api/tasks"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.length()").value(2));
        }

        @Test
        void deveBuscarTaskPorId() throws Exception {
                Task task = new Task("Buscar", null);

                when(taskService.findById(1L)).thenReturn(Optional.of(task));

                mockMvc.perform(get("/api/tasks/1"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.title").value("Buscar"));
        }

        @Test
        void deveRetornar404QuandoTaskNaoExiste() throws Exception {
                when(taskService.findById(1L)).thenReturn(Optional.empty());

                mockMvc.perform(get("/api/tasks/1"))
                                .andExpect(status().isNotFound());
        }

        @Test
        void deveAtualizarTask() throws Exception {
                TaskRequestDTO request = new TaskRequestDTO("Novo", "Desc");
                Task updatedTask = new Task("Novo", "Desc");

                when(taskService.update(eq(1L), any(TaskRequestDTO.class)))
                                .thenReturn(updatedTask);

                mockMvc.perform(put("/api/tasks/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.title").value("Novo"))
                                .andExpect(jsonPath("$.description").value("Desc"));
        }

        @Test
        void deveRetornar404AoAtualizarTaskInexistente() throws Exception {
                TaskRequestDTO request = new TaskRequestDTO("Novo", "Desc");

                when(taskService.update(eq(1L), any(TaskRequestDTO.class)))
                                .thenThrow(new TaskNotFoundException(1L));

                mockMvc.perform(put("/api/tasks/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isNotFound());
        }

        @Test
        void deveDeletarTask() throws Exception {
                mockMvc.perform(delete("/api/tasks/1"))
                                .andExpect(status().isNoContent());
        }

        @Test
        void deveRetornar404AoDeletarTaskInexistente() throws Exception {
                doThrow(new TaskNotFoundException(1L))
                                .when(taskService).delete(1L);

                mockMvc.perform(delete("/api/tasks/1"))
                                .andExpect(status().isNotFound());
        }
}
