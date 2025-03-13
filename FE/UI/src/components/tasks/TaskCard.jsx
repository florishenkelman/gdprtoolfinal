import { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { authService } from '../../services/authService';
import TaskStatusUpdate from './TaskStatusUpdate';
import AttachmentUpload from './AttachmentUpload';
import TaskDetailModal from './TaskDetailModal';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import TaskActions from './TaskActions';
import './TaskCard.css'; // Import custom CSS

export default function TaskCard({ task, onUpdate }) {
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [assignedUser, setAssignedUser] = useState({
        username: 'Loading...',
        email: '',
        jobTitle: '',
        role: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useAuth();
    const { theme } = useTheme();

    useEffect(() => {
        const fetchAssignedUser = async () => {
            if (!task.assigneeId) {
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

        fetchAssignedUser();
    }, [task.assigneeId]);

    const handleCardClick = (e) => {
        if (e.target.tagName.toLowerCase() === 'button') {
            return;
        }
        setIsDetailModalOpen(true);
    };

    const handleDelete = async (taskId) => {
        try {
            await taskService.deleteTask(taskId);
            onUpdate();
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    return (
        <>
            <div className="task-card" onClick={handleCardClick}>
                <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <span className={`task-status task-status-${task.status}`}>
            {task.status.replace('_', ' ')}
          </span>
                </div>

                <p className="task-description">{task.description}</p>

                <div className="task-meta">
                    <p className="task-meta-label">
                        Assigned to: {loading ? 'Loading...' : assignedUser.username}
                        {error && <span className="error-text">({error})</span>}
                    </p>
                    {assignedUser.jobTitle && (
                        <p className="task-meta-label">Role: {assignedUser.jobTitle}</p>
                    )}
                    <p className="task-meta-label">Priority: {task.priority}</p>
                </div>

                <div className="button-group">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsStatusModalOpen(true);
                        }}
                        className="task-button"
                    >
                        Update Status
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsUploadModalOpen(true);
                        }}
                        className="task-button"
                    >
                        Add Attachment
                    </button>
                    <TaskActions task={task} onDelete={handleDelete} onUpdate={onUpdate} />
                </div>
            </div>

            <TaskStatusUpdate
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                task={task}
                onUpdate={onUpdate}
            />

            <AttachmentUpload
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                taskId={task.id}
                onSuccess={onUpdate}
            />

            <TaskDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                taskId={task.id}
            />
        </>
    );
}