import { useState } from 'react';
import { Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import './AvatarSection.css'; // Import custom CSS

const AvatarSection = () => {
    const { user, setUser } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleAvatarUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const response = await authService.updateAvatar(user.id, file);
            setUser(response.data);
        } catch (error) {
            console.error('Error uploading avatar:', error);
            setError(error.message || 'Failed to upload avatar');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="avatar-section">
            <div className="avatar-header">
                <div className="relative">
                    <img
                        src={`http://localhost:8080${user?.avatarUrl}`}
                        alt="User Avatar"
                        className="avatar-image"
                    />
                    <label
                        className={`avatar-upload-label ${isUploading ? 'disabled' : ''}`}
                    >
                        <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/gif"
                            onChange={handleAvatarUpload}
                            disabled={isUploading}
                        />
                        <Camera className="avatar-camera-icon" />
                    </label>
                </div>
                <div className="user-details">
                    <p className="user-name">{user?.username || 'Username'}</p>
                    <p className="user-email">{user?.email || 'user@example.com'}</p>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default AvatarSection;