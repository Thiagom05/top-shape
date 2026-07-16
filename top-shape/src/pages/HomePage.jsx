import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getVideoUrl } from "../services/storageService";

export default function HomePage() {
    const { profile } = useAuth();
    const [videoUrl, setVideoUrl] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        async function fetchWelcomeVideo() {
            try {
                // Obtenemos la URL firmada para 'welcome.mp4' en el bucket 'videos'
                const url = await getVideoUrl("welcome.mp4");
                setVideoUrl(url);
            } catch (err) {
                console.warn("No se pudo obtener el video de bienvenida:", err.message);
            }
        }
        fetchWelcomeVideo();
    }, []);

    return (
        <div className="home-layout">
            {/* Columna Izquierda: Bienvenida y Video */}
            <div>
                <div className="welcome-header">
                    <h2>¡Hola, {profile?.name || "Participante"}!</h2>
                    <p>Bienvenido/a al reto Top Shape</p>
                </div>

                <div className="video-card">
                    {isPlaying && videoUrl ? (
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            className="video-player"
                            style={{ width: "100%", aspectRatio: "9/16", backgroundColor: "#000", display: "block" }}
                        />
                    ) : (
                        <div className="video-thumbnail-container" onClick={() => setIsPlaying(true)}>
                            <img
                                src="/assets/DSC02018.webp"
                                className="video-thumbnail-img"
                                alt="Portada Video de Bienvenida"
                            />
                            <div className="play-button-overlay" style={{ zIndex: 2 }}>
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                            </div>
                        </div>
                    )}
                    <button className="video-action-btn" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? "Detener reproducción" : "Ver video de bienvenida"}
                    </button>
                </div>
            </div>

            {/* Columna Derecha: Accesos Rápidos */}
            <div style={{ marginTop: "24px" }}>
                <h3 className="quick-access-section-title">Accesos rápidos</h3>
                <div className="quick-access-card">
                    <Link to="/guides" className="quick-access-item">
                        <div className="quick-access-left">
                            <div className="quick-access-icon-wrapper">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                            </div>
                            <span className="quick-access-title">Guías</span>
                        </div>
                        <svg className="quick-access-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </Link>

                    <Link to="/progress" className="quick-access-item">
                        <div className="quick-access-left">
                            <div className="quick-access-icon-wrapper">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                            </div>
                            <span className="quick-access-title">Fotos de progreso</span>
                        </div>
                        <svg className="quick-access-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </Link>

                    <Link to="/resources" className="quick-access-item">
                        <div className="quick-access-left">
                            <div className="quick-access-icon-wrapper">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                </svg>
                            </div>
                            <span className="quick-access-title">Recursos</span>
                        </div>
                        <svg className="quick-access-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}