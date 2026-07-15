import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { compressImage } from "../utils/imageOptimizer";
import { 
    uploadProgressPhoto, 
    getProgressPhotoUrl, 
    saveProgressPhotoRecord, 
    getUserPhotos 
} from "../services/storageService";

export default function ProgressPage() {
    const { user } = useAuth();
    const { showAlert } = useAlert();
    
    // Estados para los ángulos seleccionados en cada fase
    const [beforeAngle, setBeforeAngle] = useState("front");
    const [afterAngle, setAfterAngle] = useState("front");

    // Mapa de URLs firmadas de las fotos: { "before-front": "http://...", "after-side": "..." }
    const [photoUrls, setPhotoUrls] = useState({});
    const [loadingPhotos, setLoadingPhotos] = useState(true);
    const [uploading, setUploading] = useState(null); // Contiene el identificador de la foto que se está subiendo

    // Referencias para disparar los inputs de archivos ocultos
    const beforeFileInputRef = useRef();
    const afterFileInputRef = useRef();

    // Cargar las fotos existentes del usuario
    useEffect(() => {
        if (!user) return;

        async function loadPhotos() {
            try {
                setLoadingPhotos(true);
                const photos = await getUserPhotos(user.id);
                
                const urlsMap = {};
                // Para cada foto que ya exista en base de datos, obtenemos su URL firmada
                await Promise.all(
                    photos.map(async (photo) => {
                        const key = `${photo.phase}-${photo.view}`;
                        try {
                            const signedUrl = await getProgressPhotoUrl(user.id, photo.phase, photo.view);
                            urlsMap[key] = signedUrl;
                        } catch (err) {
                            console.error(`Error firmando URL para ${key}:`, err.message);
                        }
                    })
                );

                setPhotoUrls(urlsMap);
            } catch (error) {
                console.error("Error al cargar fotos de progreso:", error.message);
            } finally {
                setLoadingPhotos(false);
            }
        }

        loadPhotos();
    }, [user]);

    async function handleFileChange(e, phase, view) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar formato (solo imágenes)
        if (!file.type.startsWith("image/")) {
            await showAlert({
                title: "Formato de imagen inválido",
                message: "Por favor, selecciona un archivo de imagen válido (JPEG, JPG o PNG).",
                type: "error"
            });
            return;
        }

        const photoId = `${phase}-${view}`;
        try {
            setUploading(photoId);

            // Comprimir la imagen en el cliente de manera asíncrona
            const optimizedFile = await compressImage(file);

            // 1. Subir la imagen al storage de Supabase
            const storagePath = await uploadProgressPhoto(user.id, optimizedFile, phase, view);

            // 2. Guardar el registro en la tabla de la base de datos progress_photos
            await saveProgressPhotoRecord(user.id, phase, view, storagePath);

            // 3. Obtener la URL firmada para la previsualización
            const signedUrl = await getProgressPhotoUrl(user.id, phase, view);

            // 4. Actualizar el estado local
            setPhotoUrls(prev => ({
                ...prev,
                [photoId]: signedUrl
            }));

            await showAlert({
                title: "Éxito",
                message: "Foto subida correctamente.",
                type: "success"
            });
        } catch (error) {
            await showAlert({
                title: "Error al subir",
                message: "Error al subir la foto: " + error.message,
                type: "error"
            });
        } finally {
            setUploading(null);
        }
    }

    function triggerFileInput(phase) {
        if (phase === "before") {
            beforeFileInputRef.current?.click();
        } else {
            afterFileInputRef.current?.click();
        }
    }

    // Renderiza la sección/caja de carga o preview
    function renderPhotoSlot(phase, activeAngle) {
        const photoId = `${phase}-${activeAngle}`;
        const imageUrl = photoUrls[photoId];

        if (uploading === photoId) {
            return (
                <div className="upload-preview-container">
                    <div className="spinner"></div>
                    <p style={{ marginTop: "12px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Subiendo imagen...</p>
                </div>
            );
        }

        if (imageUrl) {
            return (
                <div className="upload-preview-container">
                    <img src={imageUrl} alt={`Progreso ${phase} ${activeAngle}`} className="upload-preview-img" />
                    <div className="preview-actions-overlay">
                        <button className="btn-secondary" onClick={() => triggerFileInput(phase)} style={{ background: "rgba(15, 15, 15, 0.8)", border: "1px solid #444", fontSize: "0.85rem" }}>
                            Cambiar foto
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="upload-slot" onClick={() => triggerFileInput(phase)}>
                <div className="upload-icon-wrapper">
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                        <path d="M12 9v6M9 12h6" />
                    </svg>
                </div>
                <div>
                    <p className="upload-label-main">Subir foto</p>
                    <p className="upload-label-sub">Toca para cargar tu foto</p>
                </div>
            </div>
        );
    }

    return (
        <div className="progress-container">
            <div className="page-header">
                <Link to="/home" className="back-link">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                </Link>
                <h1>Fotos de progreso</h1>
            </div>

            {loadingPhotos ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px" }}>
                    <div className="spinner"></div>
                    <p style={{ marginTop: "16px", color: "var(--text-muted)" }}>Sincronizando fotos de progreso...</p>
                </div>
            ) : (
                <div className="grid-2">
                    {/* Inputs de archivos ocultos */}
                    <input 
                        type="file" 
                        ref={beforeFileInputRef} 
                        onChange={(e) => handleFileChange(e, "before", beforeAngle)}
                        style={{ display: "none" }}
                        accept="image/*"
                    />
                    <input 
                        type="file" 
                        ref={afterFileInputRef} 
                        onChange={(e) => handleFileChange(e, "after", afterAngle)}
                        style={{ display: "none" }}
                        accept="image/*"
                    />

                    {/* Tarjeta 1: Foto del Antes */}
                    <div className="card">
                        <h2 style={{ fontSize: "1.2rem", marginBottom: "4px" }}>Foto del antes</h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "16px" }}>Subí tus fotos de control al iniciar el reto.</p>
                        
                        {/* Selector de ángulos */}
                        <div className="angle-selector">
                            <button className={`angle-btn ${beforeAngle === "front" ? "active" : ""}`} onClick={() => setBeforeAngle("front")}>Frente</button>
                            <button className={`angle-btn ${beforeAngle === "side" ? "active" : ""}`} onClick={() => setBeforeAngle("side")}>Perfil</button>
                            <button className={`angle-btn ${beforeAngle === "back" ? "active" : ""}`} onClick={() => setBeforeAngle("back")}>Espalda</button>
                        </div>

                        {renderPhotoSlot("before", beforeAngle)}
                    </div>

                    {/* Tarjeta 2: Foto del Después */}
                    <div className="card">
                        <h2 style={{ fontSize: "1.2rem", marginBottom: "4px" }}>Foto del después</h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "16px" }}>Subí tus fotos finales para comparar tu evolución.</p>
                        
                        {/* Selector de ángulos */}
                        <div className="angle-selector">
                            <button className={`angle-btn ${afterAngle === "front" ? "active" : ""}`} onClick={() => setAfterAngle("front")}>Frente</button>
                            <button className={`angle-btn ${afterAngle === "side" ? "active" : ""}`} onClick={() => setAfterAngle("side")}>Perfil</button>
                            <button className={`angle-btn ${afterAngle === "back" ? "active" : ""}`} onClick={() => setAfterAngle("back")}>Espalda</button>
                        </div>

                        {renderPhotoSlot("after", afterAngle)}
                    </div>
                </div>
            )}

            {/* Banner Motivacional */}
            <div className="progress-alert-banner">
                <div>
                    <strong style={{ display: "block", marginBottom: "2px" }}>¡Tu progreso inspira!</strong>
                    No te olvides de tomarte la foto con buena luz natural, en la misma posición y vistiendo la misma ropa para ver la transformación de forma clara.
                </div>
            </div>
        </div>
    );
}