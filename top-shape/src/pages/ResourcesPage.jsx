import { useState } from "react";
import { Link } from "react-router-dom";
import { getVideoUrl } from "../services/storageService";

const videosData = [
    { id: 1, title: "Rutina 1", subtitle: "Piernas y glúteos", file: "rutina1.mp4" },
    { id: 2, title: "Rutina 2", subtitle: "Espalda y brazos", file: "rutina2.mp4" },
    { id: 3, title: "Rutina 3", subtitle: "Cardio + Core", file: "rutina3.mp4" },
    { id: 4, title: "Tips de alimentación", subtitle: "Nutrición y hábitos", file: "tips.mp4" },
    { id: 5, title: "Motivación semanal", subtitle: "Mentalidad y foco", file: "motivacion.mp4" },
];

const tipsData = [
    { id: 1, title: "Frecuencia e Intensidad", desc: "Para ver resultados reales, entrena entre 3 y 5 veces por semana, priorizando la intensidad y técnica en cada serie." },
    { id: 2, title: "Consumo de Proteínas", desc: "Asegúrate de incluir una fuente de proteína en todas tus comidas principales para ayudar a la recuperación y mantenimiento muscular." },
    { id: 3, title: "Hidratación Constante", desc: "Toma al menos 2.5 a 3 litros de agua diarios. El músculo está compuesto principalmente por agua; hidratarse es rendir." }
];

const extrasData = [
    { id: 1, title: "Calculadora de Calorías", desc: "Enlace rápido a nuestra herramienta recomendada de cálculo de déficit calórico y macros diarios." },
    { id: 2, title: "Bitácora de Medidas Corporales", desc: "Planilla de control Excel/PDF descargable para llevar tu registro antropométrico semanal." }
];

export default function ResourcesPage() {
    const [activeTab, setActiveTab] = useState("videos");
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [signedUrl, setSignedUrl] = useState("");
    const [loadingVideo, setLoadingVideo] = useState(false);

    async function handlePlayVideo(video) {
        try {
            setLoadingVideo(true);
            setSelectedVideo(video);
            
            // Obtenemos la URL firmada del video desde Supabase Storage
            const url = await getVideoUrl(video.file);
            setSignedUrl(url);
        } catch (error) {
            alert("No se pudo reproducir el video: " + error.message);
            setSelectedVideo(null);
        } finally {
            setLoadingVideo(false);
        }
    }

    function handleCloseModal() {
        setSelectedVideo(null);
        setSignedUrl("");
    }

    return (
        <div>
            <div className="page-header">
                <Link to="/home" className="back-link">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                </Link>
                <h1>Recursos</h1>
            </div>

            {/* Selector de pestañas */}
            <div className="resources-tabs">
                <button 
                    className={`resources-tab-btn ${activeTab === "videos" ? "active" : ""}`}
                    onClick={() => setActiveTab("videos")}
                >
                    Videos
                </button>
                <button 
                    className={`resources-tab-btn ${activeTab === "tips" ? "active" : ""}`}
                    onClick={() => setActiveTab("tips")}
                >
                    Tips
                </button>
                <button 
                    className={`resources-tab-btn ${activeTab === "extras" ? "active" : ""}`}
                    onClick={() => setActiveTab("extras")}
                >
                    Extras
                </button>
            </div>

            {/* Contenido según solapa activa */}
            {activeTab === "videos" && (
                <div className="video-list">
                    {videosData.map((video) => (
                        <div 
                            key={video.id} 
                            className="video-item-card"
                            onClick={() => handlePlayVideo(video)}
                        >
                            <div className="video-item-left">
                                <div className="video-item-play-overlay">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                </div>
                            </div>
                            <div className="video-item-info">
                                <h3 className="video-item-title">{video.title}</h3>
                                <span className="video-item-category">{video.subtitle}</span>
                            </div>
                            <svg className="video-item-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "tips" && (
                <div className="grid-2">
                    {tipsData.map((tip) => (
                        <div key={tip.id} className="text-resource-card">
                            <h3 className="text-resource-title">{tip.title}</h3>
                            <p className="text-resource-desc">{tip.desc}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "extras" && (
                <div className="grid-2">
                    {extrasData.map((extra) => (
                        <div key={extra.id} className="text-resource-card">
                            <h3 className="text-resource-title">{extra.title}</h3>
                            <p className="text-resource-desc">{extra.desc}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal del reproductor de video */}
            {selectedVideo && (
                <div className="video-modal-backdrop" onClick={handleCloseModal}>
                    <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="video-modal-header">
                            <h3 style={{ fontSize: "1.1rem" }}>{selectedVideo.title} - {selectedVideo.subtitle}</h3>
                            <button className="video-modal-close" onClick={handleCloseModal}>&times;</button>
                        </div>
                        
                        {loadingVideo ? (
                            <div style={{ height: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <div className="spinner"></div>
                                <p style={{ marginTop: "12px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Conectando con almacenamiento...</p>
                            </div>
                        ) : signedUrl ? (
                            <video 
                                src={signedUrl} 
                                controls 
                                autoPlay 
                                style={{ width: "100%", display: "block", backgroundColor: "#000" }}
                            />
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}