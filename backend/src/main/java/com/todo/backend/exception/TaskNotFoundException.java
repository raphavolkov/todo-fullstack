package com.todo.backend.exception;

public class TaskNotFoundException extends RuntimeException {

    public TaskNotFoundException(Long id) {
        super("Task não encontrada com id: " + id);
    }
}

