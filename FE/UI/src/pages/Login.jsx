import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import './Login.css';

export default function Login() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(credentials);
            toast.success('Successfully logged in!');
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`login-container ${theme === 'dark' ? 'dark-mode' : ''}`}>
            <div className="login-content">
                <h2 className="login-title">Sign in to your account</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-input-group">
                        <input
                            type="email"
                            required
                            className="login-input"
                            placeholder="Email address"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        />
                    </div>
                    <div className="login-input-group">
                        <input
                            type="password"
                            required
                            className="login-input"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
                <div className="login-link">
                    <p>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}