import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse text-slate-500 font-medium">Authenticating...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
