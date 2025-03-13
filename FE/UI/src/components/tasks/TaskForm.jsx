import { useState, useEffect } from 'react';
import { taskService, validateTaskData } from '../../services/taskService';
import { authService } from '../../services/authService';
import './TaskForm.css'; // Import custom CSS

export default function TaskForm({ isOpen, onClose, onSuccess }) {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        assigneeId: '',
        dueDate: new Date().toISOString().split('T')[0],
    });

    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await authService.getAllUsers();
                setUsers(response || []);
            } catch (err) {
                setError('Failed to fetch users');
                console.error('Error fetching users:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validation = validateTaskData(taskData);
        if (!validation.isValid) {
            setError(validation.errors.join(', '));
            return;
        }

        setIsSubmitting(true);
        try {
            await taskService.createTask(taskData);
            onSuccess();
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create task';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">Create New Task</h3>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label">Title *</label>
                        <input
                            type="text"
                            required
                            className="form-input"
                            value={taskData.title}
                            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="form-label">Description *</label>
                        <textarea
                            required
                            rows="3"
                            className="form-input"
                            value={taskData.description}
                            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="form-label">Assigned User</label>
                        <select
                            className="form-input"
                            value={taskData.assigneeId}
                            onChange={(e) => setTaskData({ ...taskData, assigneeId: e.target.value })}
                        >
                            <option value="">Select a user</option>
                            {isLoading ? (
                                <option disabled>Loading users...</option>
                            ) : (
                                users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.username} ({user.email})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="form-label">Priority</label>
                        <select
                            className="form-input"
                            value={taskData.priority}
                            onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="form-label">Due Date *</label>
                        <input
                            type="date"
                            required
                            className="form-input"
                            value={taskData.dueDate}
                            onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="button button-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="button button-primary"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}