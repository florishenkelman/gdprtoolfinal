import api from '../utils/axios';
import { API_ENDPOINTS } from './apiConfig';

const useMock = import.meta.env.VITE_USE_MOCK === 'true'; // Toggle based on environment

// Mock data for attachments
const mockAttachments = [
  { id: 1, taskId: 1, fileName: "mock-file-1.txt", url: "/mock/mock-file-1.txt" },
  { id: 2, taskId: 1, fileName: "mock-file-2.pdf", url: "/mock/mock-file-2.pdf" },
];

export const attachmentService = {
  uploadFile: async (taskId, file) => {
    if (useMock) {
      // Simulate a successful upload
      console.log(`Mock upload: Task ID ${taskId}, File: ${file.name}`);
      return { success: true, message: 'File uploaded successfully (mock)' };
    }

    // Real API call
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post(API_ENDPOINTS.attachments.upload(taskId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  downloadFile: async (attachmentId) => {
    if (useMock) {
      // Simulate a file download
      console.log(`Mock download: Attachment ID ${attachmentId}`);
      const mockBlob = new Blob(['Mock file content'], { type: 'text/plain' });
      return mockBlob;
    }

    // Real API call
    try {
      const response = await api.get(API_ENDPOINTS.attachments.download(attachmentId), {
        responseType: 'blob',
        headers: { Accept: '*/*' },
      });

      if (!response) {
        throw new Error('No data received from server');
      }

      const blob = new Blob([response], {
        type: response.headers['content-type'] || 'application/octet-stream',
      });

      return blob;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  },

  getTaskAttachments: async (taskId) => {
    if (useMock) {
      // Return mock attachments filtered by taskId
      return mockAttachments.filter((attachment) => attachment.taskId === taskId);
    }

    // Real API call
    try {
      const response = await api.get(API_ENDPOINTS.attachments.getForTask(taskId));
      return response;
    } catch (error) {
      console.error('Error getting task attachments:', error);
      throw error;
    }
  },

  deleteAttachment: async (attachmentId) => {
    if (useMock) {
      // Simulate a successful deletion
      console.log(`Mock delete: Attachment ID ${attachmentId}`);
      return { success: true, message: 'Attachment deleted successfully (mock)' };
    }

    // Real API call
    try {
      const response = await api.delete(API_ENDPOINTS.attachments.delete(attachmentId));
      return response.data;
    } catch (error) {
      console.error('Error deleting attachment:', error);
      throw error;
    }
  },
};