import { useState } from "react";
import { Link } from "react-router-dom";

const tipsData = [
    { id: 1, title: "Frecuencia e Intensidad", desc: "Para ver resultados reales, entrena entre 3 y 5 veces por semana, priorizando la intensidad y técnica en cada serie." },
    { id: 2, title: "Consumo de Proteínas", desc: "Asegúrate de incluir una fuente de proteína en todas tus comidas principales para ayudar a la recuperación y mantenimiento muscular." },
    { id: 3, title: "Hidratación Constante", desc: "Toma al menos 2.5 a 3 litros de agua diarios. El músculo está compuesto principalmente por agua; hidratarse es rendir." }
];

export default function ResourcesPage() {
    const [selectedResource, setSelectedResource] = useState(null); // 'recetario' | 'calendario' | 'premios' | 'lista' | null
    const [recipeIndex, setRecipeIndex] = useState(0); // 0 a 8 para las 9 fotos del recetario
    const [listPage, setListPage] = useState(1); // 1 o 2 para la lista inteligente
    const [fullscreenImage, setFullscreenImage] = useState(null); // Imagen activa en pantalla completa

    const recetarioImages = Array.from({ length: 9 }, (_, i) => `/assets/Recetario/foto${i + 1}.webp`);

    function handleOpenResource(type) {
        setSelectedResource(type);
        if (type === "recetario") setRecipeIndex(0);
        if (type === "lista") setListPage(1);
    }

    function handleCloseModal() {
        setSelectedResource(null);
    }

    // Funciones de navegación del recetario
    function nextRecipe() {
        setRecipeIndex((prev) => (prev + 1) % recetarioImages.length);
    }

    function prevRecipe() {
        setRecipeIndex((prev) => (prev - 1 + recetarioImages.length) % recetarioImages.length);
    }

    return (
        <div style={{ paddingBottom: "40px" }}>
            <div className="page-header">
                <Link to="/home" className="back-link">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                </Link>
                <h1>Recursos</h1>
            </div>

            <p style={{ color: "var(--text-muted)", marginBottom: "32px", fontSize: "1rem" }}>
                Accedé al material de apoyo exclusivo para optimizar tu proceso y organizar tu semana.
            </p>

            {/* Grilla principal de Recursos */}
            <div className="grid-2" style={{ marginBottom: "48px" }}>
                {/* Tarjeta: Recetario */}
                <div
                    className="video-item-card"
                    onClick={() => handleOpenResource("recetario")}
                    style={{ padding: "20px", display: "flex", alignItems: "center", minHeight: "100px" }}
                >
                    <div
                        className="video-item-left"
                        style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, rgba(0, 124, 137, 0.2) 0%, rgba(0, 124, 137, 0.05) 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--primary)"
                        }}
                    >
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <div className="video-item-info" style={{ marginLeft: "8px" }}>
                        <h3 className="video-item-title" style={{ fontSize: "1.1rem" }}>Recetario Saludable</h3>
                        <span className="video-item-category">7 ideas de platos prácticos y nutritivos</span>
                    </div>
                    <svg className="video-item-arrow" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </div>

                {/* Tarjeta: Calendario */}
                <div
                    className="video-item-card"
                    onClick={() => handleOpenResource("calendario")}
                    style={{ padding: "20px", display: "flex", alignItems: "center", minHeight: "100px" }}
                >
                    <div
                        className="video-item-left"
                        style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, rgba(0, 124, 137, 0.2) 0%, rgba(0, 124, 137, 0.05) 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--primary)"
                        }}
                    >
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </div>
                    <div className="video-item-info" style={{ marginLeft: "8px" }}>
                        <h3 className="video-item-title" style={{ fontSize: "1.1rem" }}>Calendario Semanal</h3>
                        <span className="video-item-category">Tu guía visual para organizar tus entrenamientos</span>
                    </div>
                    <svg className="video-item-arrow" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </div>

                {/* Tarjeta: Premios */}
                <div
                    className="video-item-card"
                    onClick={() => handleOpenResource("premios")}
                    style={{ padding: "20px", display: "flex", alignItems: "center", minHeight: "100px" }}
                >
                    <div
                        className="video-item-left"
                        style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, rgba(0, 124, 137, 0.2) 0%, rgba(0, 124, 137, 0.05) 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--primary)"
                        }}
                    >
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="8" r="7" />
                            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                        </svg>
                    </div>
                    <div className="video-item-info" style={{ marginLeft: "8px" }}>
                        <h3 className="video-item-title" style={{ fontSize: "1.1rem" }}>Premios</h3>
                        <span className="video-item-category">Conoce los premios del programa</span>
                    </div>
                    <svg className="video-item-arrow" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </div>

                {/* Tarjeta: Lista Inteligente */}
                <div
                    className="video-item-card"
                    onClick={() => handleOpenResource("lista")}
                    style={{ padding: "20px", display: "flex", alignItems: "center", minHeight: "100px" }}
                >
                    <div
                        className="video-item-left"
                        style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, rgba(0, 124, 137, 0.2) 0%, rgba(0, 124, 137, 0.05) 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--primary)"
                        }}
                    >
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                    </div>
                    <div className="video-item-info" style={{ marginLeft: "8px" }}>
                        <h3 className="video-item-title" style={{ fontSize: "1.1rem" }}>Lista Inteligente Súper</h3>
                        <span className="video-item-category">Organizá tus compras eficientemente</span>
                    </div>
                    <svg className="video-item-arrow" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </div>
            </div>

            {/* Sección inferior de Tips Rápidos */}
            <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "16px" }}>Tips Claves para tu Progreso</h2>
            <div className="grid-3">
                {tipsData.map((tip) => (
                    <div key={tip.id} className="text-resource-card" style={{ padding: "20px" }}>
                        <h3 className="text-resource-title" style={{ fontSize: "1.05rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ display: "inline-block", width: "6px", height: "6px", backgroundColor: "var(--primary)", borderRadius: "50%" }}></span>
                            {tip.title}
                        </h3>
                        <p className="text-resource-desc" style={{ marginTop: "8px", fontSize: "0.88rem" }}>{tip.desc}</p>
                    </div>
                ))}
            </div>

            {/* Modales de los Recursos */}
            {selectedResource && (
                <div className="video-modal-backdrop" onClick={handleCloseModal}>
                    <div className="video-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "650px" }}>
                        <div className="video-modal-header" style={{ padding: "16px 20px" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", textTransform: "capitalize" }}>
                                {selectedResource === "lista" ? "Lista Inteligente Súper" : selectedResource}
                            </h3>
                            <button className="video-modal-close" onClick={handleCloseModal} style={{ fontSize: "1.8rem" }}>&times;</button>
                        </div>

                        <div style={{ backgroundColor: "#000", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

                            {/* Modal Content: Recetario */}
                            {selectedResource === "recetario" && (
                                <div style={{ width: "100%", position: "relative" }}>
                                    <div style={{ minHeight: "350px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img
                                            src={recetarioImages[recipeIndex]}
                                            alt={`Receta ${recipeIndex + 1}`}
                                            className="clickable-image"
                                            onClick={() => setFullscreenImage(recetarioImages[recipeIndex])}
                                            style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "8px", display: "block" }}
                                        />
                                    </div>

                                    {/* Controles del carrusel */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", padding: "0 8px" }}>
                                        <button
                                            onClick={prevRecipe}
                                            className="btn-secondary"
                                            style={{ width: "auto", padding: "8px 16px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}
                                        >
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <polyline points="15 18 9 12 15 6" />
                                            </svg>
                                            Anterior
                                        </button>
                                        <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "600" }}>
                                            Receta {recipeIndex + 1} de {recetarioImages.length}
                                        </span>
                                        <button
                                            onClick={nextRecipe}
                                            className="btn-secondary"
                                            style={{ width: "auto", padding: "8px 16px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}
                                        >
                                            Siguiente
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <polyline points="9 18 15 12 9 6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Modal Content: Calendario */}
                            {selectedResource === "calendario" && (
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    <img
                                        src="/assets/calendario.webp"
                                        alt="Calendario Semanal"
                                        className="clickable-image"
                                        onClick={() => setFullscreenImage("/assets/calendario.webp")}
                                        style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "8px", display: "block" }}
                                    />
                                    <div style={{ marginTop: "16px" }}>
                                        <a
                                            href="/assets/calendario.webp"
                                            download="Calendario_TopShape.webp"
                                            className="btn-primary"
                                            style={{ display: "inline-flex", textDecoration: "none", width: "auto", padding: "8px 20px", fontSize: "0.85rem", gap: "8px" }}
                                        >
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                            </svg>
                                            Descargar Calendario
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Modal Content: Premios */}
                            {selectedResource === "premios" && (
                                <div style={{ width: "100%", textAlign: "center" }}>
                                    <img
                                        src="/assets/premios.webp"
                                        alt="Premios y Retos"
                                        className="clickable-image"
                                        onClick={() => setFullscreenImage("/assets/premios.webp")}
                                        style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "8px", display: "block" }}
                                    />
                                    <div style={{ marginTop: "16px" }}>
                                        <a
                                            href="/assets/premios.webp"
                                            download="Premios_TopShape.webp"
                                            className="btn-primary"
                                            style={{ display: "inline-flex", textDecoration: "none", width: "auto", padding: "8px 20px", fontSize: "0.85rem", gap: "8px" }}
                                        >
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                            </svg>
                                            Descargar Premios
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Modal Content: Lista Inteligente */}
                            {selectedResource === "lista" && (
                                <div style={{ width: "100%" }}>
                                    <div style={{ minHeight: "350px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <img
                                            src={listPage === 1 ? "/assets/Lista inteligente super/IMG_7261.webp" : "/assets/Lista inteligente super/IMG_7262.webp"}
                                            alt={`Lista Inteligente Página ${listPage}`}
                                            className="clickable-image"
                                            onClick={() => setFullscreenImage(listPage === 1 ? "/assets/Lista inteligente super/IMG_7261.webp" : "/assets/Lista inteligente super/IMG_7262.webp")}
                                            style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "8px", display: "block" }}
                                        />
                                    </div>

                                    {/* Selector de páginas */}
                                    <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "16px" }}>
                                        <button
                                            onClick={() => setListPage(1)}
                                            className={listPage === 1 ? "btn-primary" : "btn-secondary"}
                                            style={{ width: "auto", padding: "6px 16px", fontSize: "0.85rem" }}
                                        >
                                            Página 1
                                        </button>
                                        <button
                                            onClick={() => setListPage(2)}
                                            className={listPage === 2 ? "btn-primary" : "btn-secondary"}
                                            style={{ width: "auto", padding: "6px 16px", fontSize: "0.85rem" }}
                                        >
                                            Página 2
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox para Pantalla Completa (Estilo Guías) */}
            {fullscreenImage && (
                <div className="fullscreen-lightbox" onClick={() => setFullscreenImage(null)}>
                    <button className="fullscreen-lightbox-close" onClick={() => setFullscreenImage(null)}>&times;</button>
                    <img
                        src={fullscreenImage}
                        alt="Imagen en pantalla completa"
                        className="fullscreen-lightbox-img"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
