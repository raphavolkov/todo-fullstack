package com.todo.backend.controller;

import com.todo.backend.domain.Task;
import com.todo.backend.dto.TaskRequestDTO;
import com.todo.backend.dto.TaskResponseDTO;
import com.todo.backend.service.TaskService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<TaskResponseDTO> create(@RequestBody TaskRequestDTO dto) {
        Task task = new Task(dto.getTitle(), dto.getDescription());
        Task created = taskService.create(task);
        return ResponseEntity.ok(new TaskResponseDTO(created));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> findAll() {
        List<TaskResponseDTO> tasks = taskService.findAll()
                .stream()
                .map(TaskResponseDTO::new)
                .toList();

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> findById(@PathVariable Long id) {
        return taskService.findById(id)
                .map(task -> ResponseEntity.ok(new TaskResponseDTO(task)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> update(
            @PathVariable Long id,
            @RequestBody TaskRequestDTO dto
    ) {
        Task updated = taskService.update(id, dto);
        return ResponseEntity.ok(new TaskResponseDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
