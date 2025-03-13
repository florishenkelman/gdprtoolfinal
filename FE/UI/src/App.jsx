import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import GdprArticles from './pages/GdprArticles';
import UserManagement from './pages/UserManagement';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <AuthProvider>
                    <Router>
                        <CustomToaster />
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route element={<Layout />}>
                                <Route element={<PrivateRoute />}>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/tasks" element={<Tasks />} />
                                    <Route path="/gdpr-articles" element={<GdprArticles />} />
                                    <Route path="/users" element={<UserManagement />} />
                                </Route>
                            </Route>
                        </Routes>
                    </Router>
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

function CustomToaster() {
    const { theme } = useTheme();

    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    backgroundColor: theme === 'dark' ? '#2d2d2d' : '#ffffff',
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                    borderRadius: '5px',
                    boxShadow: theme === 'dark'
                        ? '0 2px 5px rgba(0, 0, 0, 0.5)'
                        : '0 2px 5px rgba(0, 0, 0, 0.1)',
                },
            }}
        />
    );
}

export default App;