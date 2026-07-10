import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Cargando panel de administración...</p>
            </div>
        );
    }

    // Redirige al home del participante si no está logueado o no es administrador
    if (!user || profile?.role !== "admin") {
        return <Navigate to="/home" replace />;
    }

    return children;
}
