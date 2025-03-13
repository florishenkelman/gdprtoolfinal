import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import './Register.css';

export default function RegisterForm() {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        username: '',
        jobTitle: '',
        role: '',
    });
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.register(userData);
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container" data-theme={theme}>
            <div className="register-card">
                <h2 className="register-title">Create your account</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        required
                        className="register-input"
                        placeholder="Email address"
                        value={userData.email}
                        onChange={(e) =>
                            setUserData({ ...userData, email: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        required
                        className="register-input"
                        placeholder="Username"
                        value={userData.username}
                        onChange={(e) =>
                            setUserData({ ...userData, username: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        required
                        className="register-input"
                        placeholder="Job Title"
                        value={userData.jobTitle}
                        onChange={(e) =>
                            setUserData({ ...userData, jobTitle: e.target.value })
                        }
                    />
                    <select
                        required
                        className="register-input"
                        value={userData.role}
                        onChange={(e) =>
                            setUserData({ ...userData, role: e.target.value })
                        }
                    >
                        <option value="VIEWER">Viewer</option>
                        <option value="EDITOR">Editor</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <input
                        type="password"
                        required
                        className="register-input"
                        placeholder="Password"
                        value={userData.password}
                        onChange={(e) =>
                            setUserData({ ...userData, password: e.target.value })
                        }
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="register-button"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
                <p className="text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="register-link">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}