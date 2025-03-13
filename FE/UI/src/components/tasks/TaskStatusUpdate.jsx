import { useState } from 'react';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import './TaskStatusUpdate.css';

export default function TaskStatusUpdate({ isOpen, onClose, task, onUpdate }) {
  const { theme } = useTheme();
  const [status, setStatus] = useState(task.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === task.status) {
      toast.error('Please select a different status');
      return;
    }

    setIsUpdating(true);
    try {
      await taskService.updateTaskStatus(task.id, status);
      toast.success('Status updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
      <div className="modal-overlay">
        <div className={`modal-content ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="mt-3">
          <h3 className="modal-title">Update Task Status</h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="form-label">Status</label>
              <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-select"
              >
                <option value="OPEN">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CLOSED">Completed</option>
              </select>
            </div>

            <div className="button-group">
              <button
                  type="button"
                  onClick={onClose}
                  className="button button-secondary"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  disabled={isUpdating || status === task.status}
                  className={`button button-primary ${
                      isUpdating ? 'button-disabled' : ''
                  }`}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
