import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../features/auth/components/loginForm";
import RegisterForm from "../features/auth/components/registerForm";

export default function LoginPage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        if (!loading && user) {
            navigate("/home", { replace: true });
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Cargando aplicación...</p>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="logo-title">TOP <span className="pink-text">SHAPE</span></h1>
                    <p className="auth-subheading">
                        {isLogin ? "Bienvenida al reto" : "Registrate en el reto"}
                    </p>
                </div>

                {isLogin ? (
                    <LoginForm onToggle={() => setIsLogin(false)} />
                ) : (
                    <RegisterForm onToggle={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    );
}