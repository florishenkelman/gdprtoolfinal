import React, { useState } from 'react';
import './TaskActions.css'; // Import custom CSS

const TaskActions = ({ task, onDelete }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete(task.id);
    setIsDeleteDialogOpen(false);
  };

  return (
      <>
        <div className="task-actions-container">
          <div className="task-tooltip">
            <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
                className="task-delete-button"
                aria-label="Delete Task"
            >
              🗑️ {/* Replace Material-UI Icon */}
            </button>
            <span className="task-tooltip-text">Delete Task</span>
          </div>
        </div>

        {isDeleteDialogOpen && (
            <div className="modal-overlay" onClick={() => setIsDeleteDialogOpen(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">Delete Task</div>
                <div className="modal-body">
                  Are you sure you want to delete this task? This action cannot be undone.
                </div>
                <div className="modal-footer">
                  <button
                      className="modal-button cancel"
                      onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                      className="modal-button delete"
                      onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
        )}
      </>
  );
};

export default TaskActions;