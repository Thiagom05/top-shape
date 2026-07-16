import { useState } from "react";
import { Link } from "react-router-dom";
import { uploadResourceFile } from "../../services/adminService";
import { useAlert } from "../../context/AlertContext";

export default function ContentManager() {
    const { showAlert } = useAlert();
    const [uploading, setUploading] = useState(null); // 'training', 'nutrition', or 'welcome'

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

            <div className="grid-3" style={{ marginTop: "24px", marginBottom: "40px" }}>
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
        </div>
    );
}

