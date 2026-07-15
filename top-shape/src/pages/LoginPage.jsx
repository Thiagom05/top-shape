import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../features/auth/components/loginForm";
import RegisterForm from "../features/auth/components/registerForm";

export default function LoginPage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    const carruselImages = [
        "/assets/DSC02018.webp",
        "/assets/049C1D7E-1EAC-4069-8665-FBD0A8CE0AE4.webp",
        "/assets/6F7E8406-A80C-4402-82EE-23A92E7D983C.webp",
        "/assets/IMG_6984.webp"
    ];

    useEffect(() => {
        if (!loading && user) {
            navigate("/home", { replace: true });
        }
    }, [user, loading, navigate]);

    // Timer para el autoplay del carrusel cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === carruselImages.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [carruselImages.length]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Cargando aplicación...</p>
            </div>
        );
    }

    return (
        <div className="auth-page-split">
            {/* Lado Izquierdo: Formulario */}
            <div className="auth-left-panel">
                <div className="auth-container">
                    <div className="auth-header">
                        <h1 className="logo-title">TOP <span className="pink-text">SHAPE</span></h1>
                        <p className="auth-subheading">
                            {isLogin ? "Bienvenido/a al reto" : "Registrate en el reto"}
                        </p>
                    </div>

                    {isLogin ? (
                        <LoginForm onToggle={() => setIsLogin(false)} />
                    ) : (
                        <RegisterForm onToggle={() => setIsLogin(true)} />
                    )}
                </div>
            </div>

            {/* Lado Derecho: Carrusel Dinámico */}
            <div className="auth-right-panel">
                <div className="auth-carousel">
                    {carruselImages.map((image, index) => (
                        <div
                            key={index}
                            className="auth-carousel-slide"
                            style={{
                                backgroundImage: `url(${image})`,
                                opacity: index === currentSlide ? 1 : 0,
                                zIndex: index === currentSlide ? 2 : 1
                            }}
                        />
                    ))}
                    <div className="auth-carousel-overlay" />
                </div>
            </div>
        </div>
    );
}