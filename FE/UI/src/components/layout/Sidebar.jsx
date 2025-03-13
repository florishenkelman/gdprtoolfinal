import { Link, useLocation } from 'react-router-dom';
import { Layout as LayoutIcon, FileText, Users, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AvatarSection from './AvatarSection';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const { logout } = useAuth();

    const navigationItems = [
        { name: 'Dashboard', path: '/', icon: LayoutIcon },
        { name: 'Tasks', path: '/tasks', icon: FileText },
        { name: 'GDPR Articles', path: '/gdpr-articles', icon: BookOpen },
        { name: 'Users', path: '/users', icon: Users },
    ];

    return (
        <>
            {/* Overlay for small screens */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

            {/* Sidebar container */}
            <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="sidebar-header">
                    <span className="sidebar-title">Menu</span>
                    <button onClick={onClose} className="close-btn" aria-label="Close Menu">
                        <LogOut size={20} />
                    </button>
                </div>

                {/* Avatar Section */}
                <div className="avatar-section">
                    <AvatarSection />
                </div>

                {/* Navigation links */}
                <nav className="sidebar-nav">
                    {navigationItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <Icon className="nav-icon" />
                                <span className="nav-text">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="sidebar-footer">
                    <button onClick={logout} className="logout-btn">
                        <LogOut className="logout-icon" />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}