package com.todo.backend.service;

import com.todo.backend.domain.Task;
import com.todo.backend.dto.TaskRequestDTO;
import com.todo.backend.exception.TaskNotFoundException;
import com.todo.backend.repository.TaskRepository;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional
    public Task create(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> findAll() {
        return taskRepository.findAll(
                Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    @Transactional
    public Task update(Long id, TaskRequestDTO dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        task.setTitle(dto.getTitle());

        if (dto.getDescription() != null) {
            task.setDescription(dto.getDescription());
        }

        return task;
    }

    @Transactional
    public void delete(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        taskRepository.delete(task);
    }

    @Transactional
    public Task toggleCompleted(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        task.toggleCompleted();
        return task;
    }
}