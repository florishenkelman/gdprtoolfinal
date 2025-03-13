import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { taskService } from '../../services/taskService';
import './TaskComments.css'; // Import custom CSS

const TaskComments = ({ taskId }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ['taskComments', taskId],
    queryFn: () => taskService.getTaskComments(taskId),
  });

  const addCommentMutation = useMutation({
    mutationFn: (content) => taskService.addComment(taskId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['taskComments', taskId]);
      setNewComment('');
      setIsSubmitting(false);
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    addCommentMutation.mutate(newComment);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseContent = (content) => {
    try {
      const parsed = JSON.parse(content);
      return parsed.content || 'Invalid content';
    } catch {
      return 'Invalid content';
    }
  };

  return (
      <div className="task-comments-container">
        <h3 className="task-comments-heading">Comments</h3>

        <form onSubmit={handleSubmitComment} className="comment-form">
        <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="comment-textarea"
            rows="3"
        />
          <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="comment-button"
          >
            {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="comment-loader" />
                  <span>Posting...</span>
                </div>
            ) : (
                'Post Comment'
            )}
          </button>
        </form>

        <div className="comments-list">
          {isLoadingComments ? (
              <div className="comment-loader">Loading...</div>
          ) : comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
              comments.map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-header">
                <span className="comment-username">
                  {comment.user.username || 'Unknown User'}
                </span>
                      <span className="comment-timestamp">
                  {formatDate(comment.createdAt)}
                </span>
                    </div>
                    <p className="comment-content">{parseContent(comment.content)}</p>
                  </div>
              ))
          )}
        </div>
      </div>
  );
};

export default TaskComments;