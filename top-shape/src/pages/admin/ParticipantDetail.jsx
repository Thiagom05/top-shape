import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getParticipantProfile, getParticipantPhotos } from "../../services/adminService";
import { getProgressPhotoUrl } from "../../services/storageService";

export default function ParticipantDetail() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [photoUrls, setPhotoUrls] = useState({});
    const [loading, setLoading] = useState(true);
    const [angle, setAngle] = useState("front");

    useEffect(() => {
        async function loadParticipantData() {
            try {
                // 1. Cargar perfil
                const profileData = await getParticipantProfile(id);
                setProfile(profileData);

                // 2. Cargar fotos de progreso
                const photos = await getParticipantPhotos(id);
                
                const urlsMap = {};
                // Obtenemos las URLs firmadas de forma asíncrona para cada foto del participante
                await Promise.all(
                    photos.map(async (photo) => {
                        const key = `${photo.phase}-${photo.view}`;
                        try {
                            const signedUrl = await getProgressPhotoUrl(id, photo.phase, photo.view);
                            urlsMap[key] = signedUrl;
                        } catch (err) {
                            console.error(`Error firmando URL para ${key}:`, err.message);
                        }
                    })
                );
                setPhotoUrls(urlsMap);
            } catch (error) {
                alert("Error al cargar datos del participante: " + error.message);
            } finally {
                setLoading(false);
            }
        }
        loadParticipantData();
    }, [id]);

    const beforePhoto = photoUrls[`before-${angle}`];
    const afterPhoto = photoUrls[`after-${angle}`];

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px" }}>
                <div className="spinner"></div>
                <p style={{ marginTop: "16px", color: "var(--text-muted)" }}>Cargando comparación de progreso...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <Link to="/admin" className="back-link">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                </Link>
                <div>
                    <h1>Progreso de {profile?.name} {profile?.last_name}</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "2px" }}>{profile?.email}</p>
                </div>
            </div>

            {/* Selector de ángulos */}
            <div className="angle-selector" style={{ maxWidth: "400px", margin: "20px 0" }}>
                <button className={`angle-btn ${angle === "front" ? "active" : ""}`} onClick={() => setAngle("front")}>
                    Frente
                </button>
                <button className={`angle-btn ${angle === "side" ? "active" : ""}`} onClick={() => setAngle("side")}>
                    Perfil
                </button>
                <button className={`angle-btn ${angle === "back" ? "active" : ""}`} onClick={() => setAngle("back")}>
                    Espalda
                </button>
            </div>

            {/* Contenedor de Comparación de Fotos */}
            <div className="comparison-container">
                {/* Caja de Foto del Antes */}
                <div className="comparison-box">
                    <div className="comparison-title">Antes</div>
                    <div className="comparison-img-wrapper">
                        {beforePhoto ? (
                            <img src={beforePhoto} alt="Progreso Antes" className="comparison-img" />
                        ) : (
                            <div className="comparison-empty">El participante no cargó esta foto aún.</div>
                        )}
                    </div>
                </div>

                {/* Caja de Foto del Después */}
                <div className="comparison-box">
                    <div className="comparison-title">Después</div>
                    <div className="comparison-img-wrapper">
                        {afterPhoto ? (
                            <img src={afterPhoto} alt="Progreso Después" className="comparison-img" />
                        ) : (
                            <div className="comparison-empty">El participante no cargó esta foto aún.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
