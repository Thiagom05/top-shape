import { useAuth } from "../context/AuthContext";
import { logout } from "../features/auth/services/authService";

export default function ProfilePage() {
    const { user, profile } = useAuth();

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            alert("Error al cerrar sesión: " + error.message);
        }
    }

    const formattedDate = profile?.created_at 
        ? new Date(profile.created_at).toLocaleDateString("es-ES", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : "N/A";

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h1 style={{ marginBottom: "24px" }}>Mi Cuenta</h1>
            
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                <div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "4px" }}>Datos Personales</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Información básica de tu perfil en la plataforma.</p>
                </div>
                
                <hr style={{ border: "0", borderTop: "1px solid var(--border)" }} />
                
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Nombre Completo</span>
                    <span style={{ fontWeight: "600" }}>{profile?.name} {profile?.last_name}</span>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Correo electrónico</span>
                    <span style={{ fontWeight: "600" }}>{user?.email}</span>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Rol de acceso</span>
                    <span style={{ fontWeight: "600", textTransform: "capitalize" }}>{profile?.role === "admin" ? "Administrador" : "Participante"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Miembro desde</span>
                    <span style={{ fontWeight: "600" }}>{formattedDate}</span>
                </div>
            </div>
            
            <button className="btn-secondary" onClick={handleLogout} style={{ borderColor: "rgba(255, 42, 95, 0.4)", color: "var(--primary)" }}>
                Cerrar sesión
            </button>
        </div>
    );
}
