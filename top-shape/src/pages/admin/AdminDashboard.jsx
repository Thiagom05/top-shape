import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getParticipants } from "../../services/adminService";

export default function AdminDashboard() {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchParticipants() {
            try {
                const data = await getParticipants();
                setParticipants(data);
            } catch (error) {
                alert("Error al cargar participantes: " + error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchParticipants();
    }, []);

    const filteredParticipants = participants.filter((p) => {
        const fullName = `${p.name || ""} ${p.last_name || ""}`.toLowerCase();
        const email = (p.email || "").toLowerCase();
        const query = searchQuery.toLowerCase();
        return fullName.includes(query) || email.includes(query);
    });

    return (
        <div>
            <div className="admin-header">
                <div>
                    <h1>Panel de Control</h1>
                    <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>Seguimiento y administración de participantes</p>
                </div>
                <div className="admin-nav-tabs">
                    <Link to="/admin" className="btn-primary" style={{ fontSize: "0.9rem", padding: "10px 16px", textDecoration: "none" }}>
                        Participantes
                    </Link>
                    <Link to="/admin/content" className="btn-secondary" style={{ fontSize: "0.9rem", padding: "10px 16px", textDecoration: "none" }}>
                        Gestionar Contenido
                    </Link>
                </div>
            </div>

            <div className="form-group" style={{ marginBottom: "24px" }}>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Buscar participante por nombre o correo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ maxWidth: "400px" }}
                />
            </div>

            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px" }}>
                    <div className="spinner"></div>
                    <p style={{ marginTop: "16px", color: "var(--text-muted)" }}>Cargando participantes...</p>
                </div>
            ) : filteredParticipants.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "40px" }}>
                    <p style={{ color: "var(--text-muted)" }}>No se encontraron participantes.</p>
                </div>
            ) : (
                <>
                    {/* Vista Desktop (Tabla) */}
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Nombre completo</th>
                                    <th>Correo electrónico</th>
                                    <th>Fecha de registro</th>
                                    <th style={{ textAlign: "right" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParticipants.map((p) => {
                                    const dateString = p.created_at
                                        ? new Date(p.created_at).toLocaleDateString("es-ES", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })
                                        : "N/A";
                                    return (
                                        <tr key={p.id}>
                                            <td style={{ fontWeight: "600" }}>{p.name} {p.last_name}</td>
                                            <td style={{ color: "var(--text-muted)" }}>{p.email || "Sin correo"}</td>
                                            <td style={{ color: "var(--text-muted)" }}>{dateString}</td>
                                            <td style={{ textAlign: "right" }}>
                                                <Link to={`/admin/user/${p.id}`} className="btn-secondary" style={{ fontSize: "0.85rem", padding: "6px 12px", display: "inline-block", textDecoration: "none" }}>
                                                    Ver progreso
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Vista Mobile (Tarjetas) */}
                    <div className="admin-mobile-cards">
                        {filteredParticipants.map((p) => {
                            const dateString = p.created_at
                                ? new Date(p.created_at).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })
                                : "N/A";
                            return (
                                <div key={p.id} className="admin-user-card">
                                    <div className="admin-user-card-header">
                                        <div>
                                            <div className="admin-user-card-name">{p.name} {p.last_name}</div>
                                            <div className="admin-user-card-email">{p.email || "Sin correo"}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center" }}>
                                        <span className="admin-user-card-date">Registro: {dateString}</span>
                                        <Link to={`/admin/user/${p.id}`} className="btn-secondary" style={{ fontSize: "0.85rem", padding: "6px 12px", textDecoration: "none" }}>
                                            Ver progreso
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
