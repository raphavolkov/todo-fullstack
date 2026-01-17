package com.todo.backend.controller;

import com.todo.backend.domain.Task;
import com.todo.backend.dto.TaskRequestDTO;
import com.todo.backend.dto.TaskResponseDTO;
import com.todo.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponseDTO create(
            @Valid @RequestBody TaskRequestDTO dto) {
        Task task = new Task(dto.getTitle(), dto.getDescription());
        return new TaskResponseDTO(taskService.create(task));
    }

    @GetMapping
    public List<TaskResponseDTO> findAll() {
        return taskService.findAll()
                .stream()
                .map(TaskResponseDTO::new)
                .toList();
    }

    @GetMapping("/{id}")
    public TaskResponseDTO findById(@PathVariable Long id) {
        return new TaskResponseDTO(taskService.findById(id));
    }

    @PutMapping("/{id}")
    public TaskResponseDTO update(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestDTO dto) {
        return new TaskResponseDTO(taskService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        taskService.delete(id);
    }

    @PatchMapping("/{id}/toggle")
    public TaskResponseDTO toggleCompleted(@PathVariable Long id) {
        return new TaskResponseDTO(taskService.toggleCompleted(id));
    }
}
