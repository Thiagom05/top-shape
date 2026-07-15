import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { uploadResourceFile, fetchAdminResourceVideos, addResourceVideo, deleteResourceVideo } from "../../services/adminService";
import { useAlert } from "../../context/AlertContext";

export default function ContentManager() {
    const { showAlert, showConfirm } = useAlert();
    const [uploading, setUploading] = useState(null); // 'training', 'nutrition', or 'welcome'
    const [dynamicVideos, setDynamicVideos] = useState([]);
    const [loadingDynamic, setLoadingDynamic] = useState(true);

    // Estados del formulario
    const [newTitle, setNewTitle] = useState("");
    const [newSubtitle, setNewSubtitle] = useState("");
    const [newFile, setNewFile] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const loadDynamicVideos = useCallback(async () => {
        try {
            const data = await fetchAdminResourceVideos();
            setDynamicVideos(data || []);
        } catch (error) {
            console.error("Error al cargar videos:", error.message);
        } finally {
            setLoadingDynamic(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadDynamicVideos();
    }, [loadDynamicVideos]);

    async function handleAddVideo(e) {
        e.preventDefault();
        if (!newTitle.trim() || !newSubtitle.trim() || !newFile) {
            await showAlert({
                title: "Campos incompletos",
                message: "Por favor completa el título, subtítulo y selecciona un video.",
                type: "error"
            });
            return;
        }

        try {
            setIsCreating(true);
            await addResourceVideo(newTitle.trim(), newSubtitle.trim(), newFile);
            await showAlert({
                title: "Éxito",
                message: "Video agregado exitosamente.",
                type: "success"
            });
            setNewTitle("");
            setNewSubtitle("");
            setNewFile(null);
            const fileInput = document.getElementById("new-video-file-input");
            if (fileInput) fileInput.value = "";

            setLoadingDynamic(true);
            await loadDynamicVideos();
        } catch (error) {
            await showAlert({
                title: "Error",
                message: "Error al agregar el video: " + error.message,
                type: "error"
            });
        } finally {
            setIsCreating(false);
        }
    }

    async function handleDeleteVideo(id, storagePath) {
        const confirmed = await showConfirm({
            title: "Eliminar video",
            message: "¿Estás seguro de que querés eliminar este video?",
            confirmText: "Eliminar",
            cancelText: "Cancelar"
        });
        if (!confirmed) return;

        try {
            await deleteResourceVideo(id, storagePath);
            await showAlert({
                title: "Eliminado",
                message: "Video eliminado correctamente.",
                type: "success"
            });
            setLoadingDynamic(true);
            await loadDynamicVideos();
        } catch (error) {
            await showAlert({
                title: "Error",
                message: "Error al eliminar el video: " + error.message,
                type: "error"
            });
        }
    }

    async function handleUpload(e, fileName, type, key) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validaciones sencillas de formato
        if (type === "pdf" && file.type !== "application/pdf") {
            await showAlert({
                title: "Formato inválido",
                message: "Por favor, selecciona un archivo en formato PDF.",
                type: "error"
            });
            return;
        }
        if (type === "video" && file.type !== "video/mp4") {
            await showAlert({
                title: "Formato inválido",
                message: "Por favor, selecciona un video en formato MP4.",
                type: "error"
            });
            return;
        }

        try {
            setUploading(key);
            await uploadResourceFile(file, fileName, type);
            await showAlert({
                title: "Éxito",
                message: "Recurso subido y actualizado correctamente.",
                type: "success"
            });
        } catch (error) {
            await showAlert({
                title: "Error",
                message: "Error al subir el archivo: " + error.message,
                type: "error"
            });
        } finally {
            setUploading(null);
            e.target.value = ""; // Limpiamos el input
        }
    }

    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1>Panel de Control</h1>
                    <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>Carga y actualización de recursos de la plataforma</p>
                </div>
                <div className="admin-nav-tabs">
                    <Link to="/admin" className="btn-secondary" style={{ fontSize: "0.9rem", padding: "10px 16px", textDecoration: "none" }}>
                        Participantes
                    </Link>
                    <Link to="/admin/content" className="btn-primary" style={{ fontSize: "0.9rem", padding: "10px 16px", textDecoration: "none" }}>
                        Gestionar Contenido
                    </Link>
                </div>
            </div>

            <div className="grid-3" style={{ marginTop: "24px" }}>
                {/* 1. Guía de Entrenamiento */}
                <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px", justifyContent: "space-between" }}>
                    <div>
                        <span className="guide-category">PDF Documento</span>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginTop: "8px", marginBottom: "4px" }}>Guía de Entrenamiento</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            Reemplaza el PDF de rutinas de ejercicio de la plataforma. Debe llamarse "GuiaDeEntrenamiento.pdf".
                        </p>
                    </div>

                    <div>
                        <label className="btn-primary" style={{ display: "block", textAlign: "center", cursor: "pointer", fontSize: "0.9rem" }}>
                            {uploading === "training" ? "Subiendo..." : "Actualizar PDF"}
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => handleUpload(e, "GuiaDeEntrenamiento.pdf", "pdf", "training")}
                                style={{ display: "none" }}
                                disabled={uploading !== null}
                            />
                        </label>
                    </div>
                </div>

                {/* 2. Guía de Nutrición */}
                <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px", justifyContent: "space-between" }}>
                    <div>
                        <span className="guide-category">PDF Documento</span>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginTop: "8px", marginBottom: "4px" }}>Guía de Nutrición</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            Reemplaza el PDF de alimentación y recetas base. Debe llamarse "GuiaDeNutricion.pdf".
                        </p>
                    </div>

                    <div>
                        <label className="btn-primary" style={{ display: "block", textAlign: "center", cursor: "pointer", fontSize: "0.9rem" }}>
                            {uploading === "nutrition" ? "Subiendo..." : "Actualizar PDF"}
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => handleUpload(e, "GuiaDeNutricion.pdf", "pdf", "nutrition")}
                                style={{ display: "none" }}
                                disabled={uploading !== null}
                            />
                        </label>
                    </div>
                </div>

                {/* 3. Video de Bienvenida */}
                <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px", justifyContent: "space-between" }}>
                    <div>
                        <span className="guide-category">MP4 Video</span>
                        <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginTop: "8px", marginBottom: "4px" }}>Video de Bienvenida</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            Reemplaza el video de saludo inicial de la home del participante. Debe llamarse "welcome.mp4".
                        </p>
                    </div>

                    <div>
                        <label className="btn-primary" style={{ display: "block", textAlign: "center", cursor: "pointer", fontSize: "0.9rem" }}>
                            {uploading === "welcome" ? "Subiendo..." : "Actualizar Video"}
                            <input
                                type="file"
                                accept="video/mp4"
                                onChange={(e) => handleUpload(e, "welcome.mp4", "video", "welcome")}
                                style={{ display: "none" }}
                                disabled={uploading !== null}
                            />
                        </label>
                    </div>
                </div>
            </div>

            <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginTop: "40px", marginBottom: "16px" }}>
                Gestión de Videos de Recursos Adicionales
            </h2>

            <div className="grid-2" style={{ marginBottom: "40px", alignItems: "start" }}>
                {/* Formulario para Agregar */}
                <div className="card">
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Agregar Nuevo Video</h3>
                    <form onSubmit={handleAddVideo} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div className="form-group">
                            <label htmlFor="video-title">Título del Video</label>
                            <input
                                id="video-title"
                                type="text"
                                className="input-field"
                                placeholder="Ej: Rutina 4"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="video-subtitle">Subtítulo / Categoría</label>
                            <input
                                id="video-subtitle"
                                type="text"
                                className="input-field"
                                placeholder="Ej: Piernas y glúteos"
                                value={newSubtitle}
                                onChange={(e) => setNewSubtitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Archivo de Video (MP4)</label>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <label 
                                    htmlFor="new-video-file-input" 
                                    className="btn-secondary" 
                                    style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        justifyContent: "center", 
                                        gap: "8px", 
                                        cursor: "pointer", 
                                        fontSize: "0.9rem",
                                        padding: "10px 16px",
                                        width: "100%"
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                                    </svg>
                                    {newFile ? "Cambiar video" : "Seleccionar video"}
                                </label>
                                <input
                                    id="new-video-file-input"
                                    type="file"
                                    accept="video/mp4"
                                    onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                                    style={{ display: "none" }}
                                    required
                                />
                                {newFile && (
                                    <div style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: "8px", 
                                        fontSize: "0.85rem", 
                                        color: "var(--primary)", 
                                        backgroundColor: "rgba(0, 124, 137, 0.05)",
                                        border: "1px solid rgba(0, 124, 137, 0.15)",
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        marginTop: "4px"
                                    }}>
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                                            <polygon points="23 7 16 12 23 17 23 7" />
                                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                        </svg>
                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {newFile.name} ({(newFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" disabled={isCreating || uploading !== null}>
                            {isCreating ? "Subiendo..." : "Agregar Video"}
                        </button>
                    </form>
                </div>

                {/* Listado para Eliminar */}
                <div className="card">
                    <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>Videos Actuales (Dinámicos)</h3>
                    {loadingDynamic ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
                            <div className="spinner"></div>
                            <p style={{ marginTop: "12px", color: "var(--text-muted)", fontSize: "0.85rem" }}>Cargando videos de la base de datos...</p>
                        </div>
                    ) : dynamicVideos.length === 0 ? (
                        <div style={{ padding: "20px", textAlign: "center", border: "1px dashed var(--border)", borderRadius: "12px" }}>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No hay videos cargados.</p>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "4px" }}>
                                Agrega un video usando el formulario de la izquierda para que los participantes lo vean.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto", paddingRight: "4px" }}>
                            {dynamicVideos.map((video) => {
                                const parts = (video.title || "").split(" | ");
                                const displayTitle = parts[0] || "Video";
                                const displaySubtitle = parts[1] || "";
                                return (
                                    <div key={video.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: "12px" }}>
                                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "12px" }}>
                                            <strong style={{ fontSize: "0.9rem", display: "block" }}>{displayTitle}</strong>
                                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{displaySubtitle}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteVideo(video.id, video.storage_path)}
                                            className="btn-secondary"
                                            style={{ fontSize: "0.8rem", padding: "6px 12px", color: "var(--accent)", borderColor: "rgba(209,18,42,0.3)", width: "auto" }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
