import { Link } from "react-router-dom";
import { getDocumentUrl } from "../services/storageService";

export default function GuidesPage() {
    async function handleDownload(fileName) {
        try {
            const url = await getDocumentUrl(fileName);
            // Abrimos el enlace firmado en una pestaña nueva para descargar/ver el PDF
            window.open(url, "_blank");
        } catch (error) {
            alert("Error al intentar descargar la guía: " + error.message);
        }
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
                        <button className="btn-primary" onClick={() => handleDownload("training.pdf")}>
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
            </div>
        </div>
    );
}