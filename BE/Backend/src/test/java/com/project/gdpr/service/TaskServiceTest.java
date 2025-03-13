package com.project.gdpr.service;

import com.project.gdpr.dto.TaskDto;
import com.project.gdpr.dto.TaskCreateDto;
import com.project.gdpr.entity.Priority;
import com.project.gdpr.entity.Task;
import com.project.gdpr.entity.TaskStatus;
import com.project.gdpr.entity.User;
import com.project.gdpr.exception.ResourceNotFoundException;
import com.project.gdpr.repository.TaskRepository;
import com.project.gdpr.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private UUID taskId;
    private UUID userId;
    private UUID assigneeId;
    private Task task;
    private User creator;
    private User assignee;

    @BeforeEach
    void setUp() {
        taskId = UUID.randomUUID();
        userId = UUID.randomUUID();
        assigneeId = UUID.randomUUID();

        creator = new User();
        creator.setId(userId);

        assignee = new User();
        assignee.setId(assigneeId);

        task = new Task();
        task.setId(taskId);
        task.setTitle("Test Task");
        task.setDescription("Task Description");
        task.setStatus(TaskStatus.OPEN);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        task.setCreator(creator);
        task.setAssignee(assignee);
    }

    @Test
    void getAllTasks_ShouldReturnTaskList() {
        when(taskRepository.findAll()).thenReturn(List.of(task));

        List<TaskDto> result = taskService.getAllTasks();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Task", result.get(0).getTitle());
    }

    @Test
    void createTask_ShouldSaveTaskSuccessfully() {
        TaskCreateDto createDto = new TaskCreateDto(
                "New Task",
                "Description",
                Priority.HIGH,
                assigneeId,
                LocalDateTime.now().plusDays(7)
        );

        when(userRepository.findById(userId)).thenReturn(Optional.of(creator));
        when(userRepository.findById(assigneeId)).thenReturn(Optional.of(assignee)); // ✅ Fix for "Assignee not found"
        when(taskRepository.save(any())).thenReturn(task);

        TaskDto result = taskService.createTask(createDto, userId);

        assertNotNull(result);
        assertEquals("Test Task", result.getTitle());
    }

    @Test
    void createTask_ShouldThrowException_WhenUserNotFound() {
        TaskCreateDto createDto = new TaskCreateDto(
                "New Task",
                "Description",
                Priority.HIGH,
                assigneeId,
                LocalDateTime.now().plusDays(7)
        );

        when(userRepository.findById(userId)).thenReturn(Optional.empty()); // ✅ Fix for "User not found"

        assertThrows(ResourceNotFoundException.class, () -> taskService.createTask(createDto, userId));
    }

    @Test
    void getTaskById_ShouldReturnTask_WhenTaskExists() {
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));

        TaskDto result = taskService.getTaskById(taskId);

        assertNotNull(result);
        assertEquals("Test Task", result.getTitle());
    }

    @Test
    void getTaskById_ShouldThrowException_WhenTaskNotFound() {
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.getTaskById(taskId));
    }

    @Test
    void updateTaskStatus_ShouldUpdateStatusSuccessfully() {
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(userRepository.findById(userId)).thenReturn(Optional.of(creator)); // ✅ Fix for "User not found"
        when(taskRepository.save(any())).thenReturn(task);

        TaskDto result = taskService.updateTaskStatus(taskId, TaskStatus.IN_PROGRESS, userId);

        assertNotNull(result);
        assertEquals(TaskStatus.IN_PROGRESS, result.getStatus());
    }

    @Test
    void updateTaskStatus_ShouldThrowException_WhenTaskNotFound() {
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.updateTaskStatus(taskId, TaskStatus.IN_PROGRESS, userId));
    }

    @Test
    void deleteTask_ShouldRemoveTaskSuccessfully() {
        when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
        when(userRepository.findById(userId)).thenReturn(Optional.of(creator)); //
        doNothing().when(taskRepository).delete(task);

        taskService.deleteTask(taskId, userId);

        verify(taskRepository, times(1)).delete(task);
    }

    @Test
    void deleteTask_ShouldThrowException_WhenTaskNotFound() {
        when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.deleteTask(taskId, userId));
    }
}