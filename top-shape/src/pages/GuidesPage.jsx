import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDocumentUrl } from "../services/storageService";
import { useAlert } from "../context/AlertContext";
import { createPortal } from "react-dom";

export default function GuidesPage() {
    const { showAlert } = useAlert();
    const [showModal, setShowModal] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const [imageFade, setImageFade] = useState(true);

    useEffect(() => {
        if (showModal || fullscreenImage) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
        return () => {
            document.body.classList.remove("modal-open");
        };
    }, [showModal, fullscreenImage]);

    const carruselImages = [
        "/assets/carrusel/foto1.webp",
        "/assets/carrusel/foto2.webp",
        "/assets/carrusel/foto3.webp",
        "/assets/carrusel/foto4.webp",
        "/assets/carrusel/foto5.webp",
        "/assets/carrusel/foto6.webp"
    ];

    async function handleDownload(fileName) {
        try {
            const url = await getDocumentUrl(fileName);
            window.open(url, "_blank");
        } catch (error) {
            await showAlert({
                title: "Error de descarga",
                message: "Error al intentar descargar la guía: " + error.message,
                type: "error"
            });
        }
    }

    const handleNextSlide = () => {
        setImageFade(false);
        setCurrentSlide((prev) => (prev === carruselImages.length - 1 ? 0 : prev + 1));
    };

    const handlePrevSlide = () => {
        setImageFade(false);
        setCurrentSlide((prev) => (prev === 0 ? carruselImages.length - 1 : prev - 1));
    };

    return (
        <div>
            <div className="page-header">
                <Link to="/home" className="back-link">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                </Link>
                <h1>Guías</h1>
            </div>

            <div className="guide-list">
                {/* Guía de Entrenamiento */}
                <div className="guide-card">
                    <div className="guide-card-image-mock">
                        <img
                            src="/assets/PortadaGuiaEntrenamiento.webp"
                            alt="Portada Guía de Entrenamiento"
                            style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
                        />
                    </div>
                    <div className="guide-card-content">
                        <span className="guide-category">Entrenamiento</span>
                        <h2 className="guide-title">GUÍA DE ENTRENAMIENTO</h2>
                        <p className="guide-description">
                            Tu guía completa con rutinas detalladas para cada semana del reto. Maximizá tu ganancia muscular y quema de grasa.
                        </p>
                        <button className="btn-primary" onClick={() => handleDownload("GuiaDeEntrenamiento.pdf")}>
                            Descargar PDF
                        </button>
                    </div>
                </div>

                {/* Guía de Nutrición */}
                <div className="guide-card">
                    <div className="guide-card-image-mock">
                        <img
                            src="/assets/PortadaGuiaNutricion.webp"
                            alt="Portada Guía de Nutrición"
                            style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
                        />
                    </div>
                    <div className="guide-card-content">
                        <span className="guide-category">Nutrición</span>
                        <h2 className="guide-title">GUÍA DE NUTRICIÓN</h2>
                        <p className="guide-description">
                            Plan nutricional base, recetas exclusivas, equivalencias y recomendaciones de alimentación inteligente.
                        </p>
                        <button className="btn-primary" onClick={() => handleDownload("GuiaDeNutricion.pdf")}>
                            Descargar PDF
                        </button>
                    </div>
                </div>

                {/* Guía de Suplementación (Nueva Tarjeta) */}
                <div className="guide-card">
                    <div className="guide-card-image-mock clickable-image" onClick={() => setShowModal(true)}>
                        <img
                            src="/assets/6F7E8406-A80C-4402-82EE-23A92E7D983C.webp"
                            alt="Portada Suplementación Top Shape"
                            style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
                        />
                    </div>
                    <div className="guide-card-content">
                        <span className="guide-category">Suplemento</span>
                        <h2 className="guide-title">SUPLEMENTACIÓN OFICIAL</h2>
                        <p className="guide-description">
                            Optimizá tus resultados. Conocé los beneficios y cómo tomar las cápsulas oficiales para acelerar tu proceso.
                        </p>
                        <button className="btn-secondary" onClick={() => setShowModal(true)} style={{ borderColor: "var(--primary)", color: "var(--text-main)" }}>
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Detalles del Suplemento */}
            {showModal && createPortal(
                <div className="video-modal-backdrop" onClick={() => { setShowModal(false); setCurrentSlide(0); }}>
                    <div className="video-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px", padding: "16px" }}>
                        <div className="video-modal-header" style={{ marginBottom: "16px", paddingBottom: "8px" }}>
                            <h3 style={{ fontSize: "1.05rem" }}>Suplementación Oficial Top Shape</h3>
                            <button className="video-modal-close" onClick={() => { setShowModal(false); setCurrentSlide(0); }}>&times;</button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", overflowY: "auto", flex: 1, width: "100%", paddingRight: "4px", WebkitOverflowScrolling: "touch" }}>
                            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", backgroundColor: "#000", aspectRatio: "2 / 3", maxHeight: "70vh", flexShrink: 0 }}>
                                {/* Botón de Izquierda */}
                                <button
                                    onClick={handlePrevSlide}
                                    style={{
                                        position: "absolute",
                                        left: "12px",
                                        background: "rgba(15, 15, 15, 0.75)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        borderRadius: "50%",
                                        width: "36px",
                                        height: "36px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        cursor: "pointer",
                                        transition: "var(--transition)",
                                        zIndex: 10
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>

                                <img
                                    src={carruselImages[currentSlide]}
                                    alt={`Suplementación info slide ${currentSlide + 1}`}
                                    className={`clickable-image ${imageFade ? "carousel-image-animation" : ""}`}
                                    onLoad={() => setImageFade(true)}
                                    onClick={() => setFullscreenImage(carruselImages[currentSlide])}
                                    style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                                />

                                {/* Botón de Derecha */}
                                <button
                                    onClick={handleNextSlide}
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        background: "rgba(15, 15, 15, 0.75)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        borderRadius: "50%",
                                        width: "36px",
                                        height: "36px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        cursor: "pointer",
                                        transition: "var(--transition)",
                                        zIndex: 10
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>

                            {/* Puntos Indicadores */}
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "16px", flexShrink: 0 }}>
                                {carruselImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setImageFade(false);
                                            setCurrentSlide(index);
                                        }}
                                        style={{
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            border: "none",
                                            backgroundColor: currentSlide === index ? "var(--primary)" : "var(--border)",
                                            cursor: "pointer",
                                            transition: "var(--transition)"
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Beneficios de Top Shape */}
                            <div style={{ marginTop: "20px", borderTop: "1px solid var(--border)", paddingTop: "16px", flexShrink: 0 }}>
                                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "10px", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "6px" }}>
                                    ¿Cómo te ayuda Top Shape?
                                </h4>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.8rem" }}>
                                        <span style={{ color: "var(--primary)", flexShrink: 0 }}>-</span>
                                        <span style={{ color: "var(--text-muted)" }}>Disminuye los antojos</span>
                                    </div>
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.8rem" }}>
                                        <span style={{ color: "var(--primary)", flexShrink: 0 }}>-</span>
                                        <span style={{ color: "var(--text-muted)" }}>Aumenta la sensación de saciedad</span>
                                    </div>
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.8rem" }}>
                                        <span style={{ color: "var(--primary)", flexShrink: 0 }}>-</span>
                                        <span style={{ color: "var(--text-muted)" }}>Sentirte satisfecho(a) por más tiempo</span>
                                    </div>
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.8rem" }}>
                                        <span style={{ color: "var(--primary)", flexShrink: 0 }}>-</span>
                                        <span style={{ color: "var(--text-muted)" }}>Facilita el seguimiento del plan sin tanta ansiedad</span>
                                    </div>
                                </div>

                                <div style={{ marginTop: "12px", padding: "8px 12px", backgroundColor: "rgba(0, 124, 137, 0.05)", borderRadius: "8px", border: "1px dashed rgba(0, 124, 137, 0.2)", fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", lineHeight: "1.3" }}>
                                    <strong>Regla del Reto:</strong> Consumir Top Shape diariamente durante los 30 días es requisito para competir por los premios.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            , document.body)}

            {/* Lightbox para Pantalla Completa */}
            {fullscreenImage && createPortal(
                <div className="fullscreen-lightbox" onClick={() => setFullscreenImage(null)}>
                    <button className="fullscreen-lightbox-close" onClick={() => setFullscreenImage(null)}>
                        &times;
                    </button>
                    <img
                        src={fullscreenImage}
                        alt="Imagen en pantalla completa"
                        className="fullscreen-lightbox-img"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            , document.body)}
        </div>
    );
}