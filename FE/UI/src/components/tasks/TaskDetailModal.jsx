import React from 'react';
import { X } from 'lucide-react';
import TaskDetails from './TaskDetails';
import { useTheme } from '../../context/ThemeContext';
import './TaskDetailModal.css'; // Import custom CSS

export default function TaskDetailModal({ isOpen, onClose, taskId }) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
      <div
          className={`modal-overlay ${theme === 'dark' ? 'dark' : ''}`}
          onClick={onClose}
      >
        <div
            className="modal-container"
            onClick={handleModalClick}
        >
          <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="modal-close-button"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="modal-content">
            <TaskDetails taskId={taskId} />
          </div>
        </div>
      </div>
  );
}