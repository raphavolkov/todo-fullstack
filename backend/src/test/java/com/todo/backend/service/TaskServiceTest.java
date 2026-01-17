package com.todo.backend.service;

import com.todo.backend.domain.Task;
import com.todo.backend.dto.TaskRequestDTO;
import com.todo.backend.exception.TaskNotFoundException;
import com.todo.backend.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@Import(TaskService.class)
@ActiveProfiles("test")
class TaskServiceTest {

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void setup() {
        taskRepository.deleteAll();
    }

    @Test
    void deveCriarUmaTask() {
        Task task = new Task("Estudar Spring", "Testes de service");

        Task saved = taskService.create(task);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTitle()).isEqualTo("Estudar Spring");
        assertThat(saved.getDescription()).isEqualTo("Testes de service");
        assertThat(saved.isCompleted()).isFalse();
        assertThat(saved.getCreatedAt()).isNotNull();
    }

    @Test
    void deveListarTasksOrdenadasPorDataDesc() {
        taskService.create(new Task("Task 1", null));
        taskService.create(new Task("Task 2", null));

        List<Task> tasks = taskService.findAll();

        assertThat(tasks).hasSize(2);
        assertThat(tasks.get(0).getCreatedAt())
                .isAfterOrEqualTo(tasks.get(1).getCreatedAt());
    }

    @Test
    void deveBuscarTaskPorId() {
        Task task = taskService.create(new Task("Buscar", null));

        Task found = taskService.findById(task.getId());

        assertThat(found.getId()).isEqualTo(task.getId());
        assertThat(found.getTitle()).isEqualTo("Buscar");
    }

    @Test
    void deveLancarExcecaoQuandoTaskNaoExiste() {
        assertThatThrownBy(() -> taskService.findById(999L)).isInstanceOf(TaskNotFoundException.class);
    }

    @Test
    void deveAtualizarTask() {
        Task task = taskService.create(new Task("Antigo", "Desc"));

        TaskRequestDTO dto = new TaskRequestDTO("Novo título", "Nova descrição");

        Task updated = taskService.update(task.getId(), dto);

        assertThat(updated.getTitle()).isEqualTo("Novo título");
        assertThat(updated.getDescription()).isEqualTo("Nova descrição");
    }

    @Test
    void updateNaoDeveAlterarCreatedAt() {
        Task task = taskService.create(new Task("Original", null));
        var createdAt = task.getCreatedAt();

        TaskRequestDTO dto = new TaskRequestDTO("Novo", null);
        Task updated = taskService.update(task.getId(), dto);

        assertThat(updated.getCreatedAt()).isEqualTo(createdAt);
    }

    @Test
    void deveLancarExcecaoAoAtualizarTaskInexistente() {
        TaskRequestDTO dto = new TaskRequestDTO("Teste", null);

        assertThatThrownBy(() -> taskService.update(1L, dto)).isInstanceOf(TaskNotFoundException.class);
    }

    @Test
    void deveDeletarTask() {
        Task task = taskService.create(new Task("Deletar", null));

        taskService.delete(task.getId());

        assertThat(taskRepository.findById(task.getId())).isEmpty();
    }

    @Test
    void deveLancarExcecaoAoDeletarTaskInexistente() {
        assertThatThrownBy(() -> taskService.delete(999L)).isInstanceOf(TaskNotFoundException.class);
    }

    @Test
    void updateNaoDeveApagarDescriptionQuandoNula() {
        Task task = taskService.create(new Task("Titulo", "Descricao"));

        TaskRequestDTO dto = new TaskRequestDTO("Novo", null);
        Task updated = taskService.update(task.getId(), dto);

        assertThat(updated.getDescription()).isEqualTo("Descricao");
    }
}
