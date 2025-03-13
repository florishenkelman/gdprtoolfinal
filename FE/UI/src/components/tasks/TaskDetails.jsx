import { useQuery } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import { attachmentService } from '../../services/attachmentService';
import { authService } from '../../services/authService';
import TaskStatusUpdate from './TaskStatusUpdate';
import AttachmentUpload from './AttachmentUpload';
import TaskComments from './TaskComments';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Download, Loader2 } from 'lucide-react';
import TaskActions from './TaskActions';
import { useNavigate } from 'react-router-dom';
import './TaskDetails.css';

export default function TaskDetails({ taskId }) {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [assignedUser, setAssignedUser] = useState({
    username: 'Loading...',
    email: '',
    jobTitle: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const { data: task, isLoading: isTaskLoading, refetch: refetchTask } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskService.getTaskById(taskId)
  });

  const { data: attachments, isLoading: isAttachmentsLoading, refetch: refetchAttachments } = useQuery({
    queryKey: ['taskAttachments', taskId],
    queryFn: () => attachmentService.getTaskAttachments(taskId)
  });

  useEffect(() => {
    const fetchAssignedUser = async () => {
      if (!task?.assigneeId) {
        setAssignedUser({ username: 'Unassigned' });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userData = await authService.getUserById(task.assigneeId);
        if (userData && userData.username) {
          setAssignedUser(userData);
        } else {
          setError('Invalid user data received');
          setAssignedUser({ username: 'Unknown User' });
        }
      } catch (error) {
        console.error('Failed to fetch user by ID: ', error);
        setError('Failed to load user data');
        setAssignedUser({ username: 'Unknown User' });
      } finally {
        setLoading(false);
      }
    };

    if (task) {
      fetchAssignedUser();
    }
  }, [task]);

  const handleAttachmentSuccess = () => {
    refetchTask();
    refetchAttachments();
  };

  const handleDownload = async (attachment) => {
    try {
      setDownloadingId(attachment.id);
      const blob = await attachmentService.downloadFile(attachment.id);

      if (!(blob instanceof Blob)) {
        throw new Error('Invalid response format');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      navigate('/tasks');
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (isTaskLoading || isAttachmentsLoading) {
    return (
        <div className="loading-container">
          Loading task details...
        </div>
    );
  }

  return (
      <div className="task-details-container">
        <div className="task-header">
          <h2 className="task-title">{task.title}</h2>
          <TaskActions
              task={task}
              onDelete={handleDelete}
              onUpdate={() => setIsStatusModalOpen(true)}
              theme={theme}
          />
          <span className={`task-status-badge task-status-${task.status}`}>
          {task.status.replace('_', ' ')}
        </span>
        </div>

        <div className="task-description">
          <p>{task.description}</p>
        </div>

        <div className="task-meta-grid">
          <div>
            <p className="task-meta-label">Assigned to</p>
            <p className="task-meta-value">
              {loading ? 'Loading...' : assignedUser.username}
              {error && <span className="error-text">({error})</span>}
            </p>
            {assignedUser.jobTitle && (
                <p className="task-meta-label">Role: {assignedUser.jobTitle}</p>
            )}
          </div>
          <div>
            <p className="task-meta-label">Priority</p>
            <p className="task-meta-value">{task.priority}</p>
          </div>
        </div>

        <div className="button-group">
          <button
              onClick={() => setIsStatusModalOpen(true)}
              className="task-button task-button-primary"
          >
            Update Status
          </button>
          <button
              onClick={() => setIsUploadModalOpen(true)}
              className="task-button task-button-secondary"
          >
            Add Attachment
          </button>
        </div>

        {attachments?.length > 0 && (
            <div className="attachments-section">
              <h3 className="attachments-title">Attachments</h3>
              <div className="attachments-list">
                {attachments.map((attachment) => (
                    <div key={attachment.id} className="attachment-card">
                      <div>
                        <span className="attachment-filename">{attachment.fileName}</span>
                        <span className="attachment-filesize">
                    {(attachment.fileSize / 1024).toFixed(1)} KB
                  </span>
                      </div>
                      <button
                          onClick={() => handleDownload(attachment)}
                          disabled={downloadingId === attachment.id}
                          className="attachment-download"
                      >
                        {downloadingId === attachment.id ? (
                            <>
                              <Loader2 className="spinner" />
                              <span>Downloading...</span>
                            </>
                        ) : (
                            <>
                              <Download />
                              <span>Download</span>
                            </>
                        )}
                      </button>
                    </div>
                ))}
              </div>
            </div>
        )}

        <TaskComments taskId={taskId} />

        <TaskStatusUpdate
            isOpen={isStatusModalOpen}
            onClose={() => setIsStatusModalOpen(false)}
            task={task}
            onUpdate={refetchTask}
        />

        <AttachmentUpload
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            taskId={task.id}
            onSuccess={handleAttachmentSuccess}
        />
      </div>
  );
}