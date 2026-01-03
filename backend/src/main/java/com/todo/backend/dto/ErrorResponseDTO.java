package com.todo.backend.dto;

import java.util.Map;

public class ErrorResponseDTO {

    private int status;
    private Map<String, String> errors;

    public ErrorResponseDTO(int status, Map<String, String> errors) {
        this.status = status;
        this.errors = errors;
    }

    public int getStatus() {
        return status;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}
