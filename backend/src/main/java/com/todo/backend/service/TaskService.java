package com.todo.backend.service;

import com.todo.backend.domain.Task;
import com.todo.backend.dto.TaskRequestDTO;
import com.todo.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task create(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    public Task update(Long id, TaskRequestDTO dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setCompleted(dto.isCompleted());

        return taskRepository.save(task);
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }

    public Task toggleCompleted(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task não encontrada"));

        task.setCompleted(!task.isCompleted());
        return taskRepository.save(task);
    }
}
