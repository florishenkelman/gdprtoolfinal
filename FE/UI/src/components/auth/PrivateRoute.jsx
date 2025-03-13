import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
export default function PrivateRoute() {
    // Check the environment variable to determine if mocking is enabled
    const useMock = import.meta.env.VITE_USE_MOCK === 'true';

    // If using mock data, bypass authentication
    if (useMock) {
        return <Outlet />;
    }

    // Real authentication logic
    const { user } = useAuth();
    return user ? <Outlet /> : <Navigate to="/login" />;
}