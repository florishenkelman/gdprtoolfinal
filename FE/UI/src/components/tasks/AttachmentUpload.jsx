import { useState } from 'react';
import { attachmentService } from '../../services/attachmentService';
import toast from 'react-hot-toast';
import './AttachmentUpload.css'; // Import custom CSS

export default function AttachmentUpload({ isOpen, onClose, taskId, onSuccess }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    try {
      await attachmentService.uploadFile(taskId, file);
      toast.success('Attachment uploaded successfully');
      setFile(null);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload attachment');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
      <div className="attachment-upload-overlay" onClick={onClose}>
        <div className="attachment-upload-modal" onClick={(e) => e.stopPropagation()}>
          <h3 className="attachment-upload-header">Upload Attachment</h3>
          <form onSubmit={handleSubmit} className="attachment-upload-form">
            <div>
              <label className="attachment-upload-label">File</label>
              <input
                  type="file"
                  onChange={handleFileChange}
                  className="attachment-upload-input"
              />
            </div>

            <div className="attachment-upload-buttons">
              <button
                  type="button"
                  onClick={onClose}
                  className="attachment-upload-button cancel"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  disabled={isUploading || !file}
                  className="attachment-upload-button submit"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}