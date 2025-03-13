package com.project.gdpr.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.project.gdpr.entity.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor  // This adds a constructor with all fields
@NoArgsConstructor   // This adds a default constructor (needed for deserialization)
public class TaskCreateDto {
    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    private UUID assigneeId;

    @NotNull(message = "Due date is required")
    private LocalDateTime dueDate;
}