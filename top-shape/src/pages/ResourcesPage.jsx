import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVideoUrl } from "../services/storageService";
import { fetchAdminResourceVideos } from "../services/adminService";

// No default videos to show if the library is empty

const tipsData = [
    { id: 1, title: "Frecuencia e Intensidad", desc: "Para ver resultados reales, entrena entre 3 y 5 veces por semana, priorizando la intensidad y técnica en cada serie." },
    { id: 2, title: "Consumo de Proteínas", desc: "Asegúrate de incluir una fuente de proteína en todas tus comidas principales para ayudar a la recuperación y mantenimiento muscular." },
    { id: 3, title: "Hidratación Constante", desc: "Toma al menos 2.5 a 3 litros de agua diarios. El músculo está compuesto principalmente por agua; hidratarse es rendir." }
];

const extrasData = [];

export default function ResourcesPage() {
    const [activeTab, setActiveTab] = useState("videos");
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [signedUrl, setSignedUrl] = useState("");
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [videos, setVideos] = useState([]);
    const [loadingVideos, setLoadingVideos] = useState(true);

    useEffect(() => {
        async function loadVideos() {
            try {
                const data = await fetchAdminResourceVideos();
                if (data && data.length > 0) {
                    const mappedVideos = data.map((item) => {
                        const parts = (item.title || "").split(" | ");
                        return {
                            id: item.id,
                            title: parts[0] || "Video",
                            subtitle: parts[1] || "",
                            file: item.storage_path
                        };
                    });
                    setVideos(mappedVideos);
                } else {
                    setVideos([]);
                }
            } catch (error) {
                console.error("Error al cargar videos:", error);
                setVideos([]);
            } finally {
                setLoadingVideos(false);
            }
        }
        loadVideos();
    }, []);

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
                loadingVideos ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px" }}>
                        <div className="spinner"></div>
                        <p style={{ marginTop: "16px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Cargando videos...</p>
                    </div>
                ) : videos.length === 0 ? (
                    <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed var(--border)", borderRadius: "12px" }}>
                        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>No hay videos de recursos disponibles por el momento.</p>
                    </div>
                ) : (
                    <div className="video-list">
                        {videos.map((video) => (
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
                )
            )}

            {activeTab === "tips" && (
                tipsData.length === 0 ? (
                    <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed var(--border)", borderRadius: "12px", width: "100%" }}>
                        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>No hay tips disponibles por el momento.</p>
                    </div>
                ) : (
                    <div className="grid-2">
                        {tipsData.map((tip) => (
                            <div key={tip.id} className="text-resource-card">
                                <h3 className="text-resource-title">{tip.title}</h3>
                                <p className="text-resource-desc">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                )
            )}

            {activeTab === "extras" && (
                extrasData.length === 0 ? (
                    <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed var(--border)", borderRadius: "12px", width: "100%" }}>
                        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>No hay extras disponibles por el momento.</p>
                    </div>
                ) : (
                    <div className="grid-2">
                        {extrasData.map((extra) => (
                            <div key={extra.id} className="text-resource-card">
                                <h3 className="text-resource-title">{extra.title}</h3>
                                <p className="text-resource-desc">{extra.desc}</p>
                            </div>
                        ))}
                    </div>
                )
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