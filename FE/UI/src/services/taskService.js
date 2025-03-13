import api from '../utils/axios';
import { API_ENDPOINTS } from './apiConfig';

// Validation constants
export const TASK_CONSTRAINTS = {
  VALID_PRIORITIES: ['LOW', 'MEDIUM', 'HIGH'],
  VALID_STATUSES: ['OPEN', 'IN_PROGRESS', 'CLOSED'],
};

// Mock data toggle
const useMock = import.meta.env.VITE_USE_MOCK === 'true';

// Mock tasks for development
const mockTasks = [
  { id: 1, title: 'Mock Task 1', description: 'Description for Task 1', priority: 'HIGH', status: 'OPEN', dueDate: '2025-01-31' },
  { id: 2, title: 'Mock Task 2', description: 'Description for Task 2', priority: 'MEDIUM', status: 'IN_PROGRESS', dueDate: '2025-02-01' },
  { id: 3, title: 'Mock Task 3', description: 'Description for Task 3', priority: 'LOW', status: 'CLOSED', dueDate: '2025-02-02' },
];

// Helper function to format dates consistently
const formatDate = (date) => {
  if (!date) return null;
  try {
    const dateObj = new Date(date);
    return `${dateObj.toISOString().split('T')[0]}T00:00:00`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return null;
  }
};

// Main task service
export const taskService = {
  // Create a new task
  createTask: async (taskData) => {
    if (useMock) {
      console.log('Mock createTask:', taskData);
      return { success: true, id: mockTasks.length + 1, ...taskData };
    }
    try {
      const formattedData = {
        title: taskData.title?.trim(),
        description: taskData.description?.trim(),
        priority: taskData.priority?.toUpperCase(),
        assigneeId: taskData.assigneeId || null,
        dueDate: formatDate(taskData.dueDate),
      };

      const validation = validateTaskData(formattedData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const response = await api.post(API_ENDPOINTS.tasks.create, formattedData);
      return response;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Get a single task by ID
  getTaskById: async (taskId) => {
    if (useMock) {
      console.log(`Mock getTaskById: ${taskId}`);
      return mockTasks.find((task) => task.id === taskId);
    }
    try {
      const response = await api.get(API_ENDPOINTS.tasks.getById(taskId));
      return response;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  // Get all tasks
  getAllTasks: async () => {
    if (useMock) {
      console.log('Mock getAllTasks');
      return mockTasks;
    }
    try {
      const response = await api.get(API_ENDPOINTS.tasks.base);
      return response;
    } catch (error) {
      console.error('Error fetching all tasks:', error);
      throw error;
    }
  },

  // Other methods remain unchanged, with similar mock implementations
  // ...

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    if (useMock) {
      console.log(`Mock updateTaskStatus: Task ID ${taskId}, Status ${status}`);
      const task = mockTasks.find((t) => t.id === taskId);
      if (task) {
        task.status = status;
        return { success: true, task };
      }
      throw new Error('Task not found');
    }
    try {
      const response = await api.put(API_ENDPOINTS.tasks.updateStatus(taskId), status.toUpperCase());
      return response;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  },
};

// Data validation helper
export const validateTaskData = (taskData) => {
  const errors = [];

  // Required fields
  if (!taskData.title?.trim()) {
    errors.push('Title is required');
  }

  if (!taskData.description?.trim()) {
    errors.push('Description is required');
  }

  // Priority validation
  if (!taskData.priority) {
    errors.push('Priority is required');
  } else if (!TASK_CONSTRAINTS.VALID_PRIORITIES.includes(taskData.priority)) {
    errors.push(`Priority must be one of: ${TASK_CONSTRAINTS.VALID_PRIORITIES.join(', ')}`);
  }

  // Date validation
  if (!taskData.dueDate) {
    errors.push('Due date is required');
  } else {
    const date = new Date(taskData.dueDate);
    if (isNaN(date.getTime())) {
      errors.push('Invalid due date format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};