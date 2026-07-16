import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TopNavigation() {
    const { profile } = useAuth();

    return (
        <header className="top-nav">
            <div className="top-nav-container">
                <Link to="/home" className="logo" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img 
                        src="/assets/TOPSHAPE.webp" 
                        alt="Top Shape Logo" 
                        style={{ height: "32px", width: "auto", objectFit: "contain" }} 
                    />
                    <span>TOP <span className="pink-text">SHAPE</span></span>
                </Link>

                <nav className="desktop-links">
                    <NavLink to="/home" className={({ isActive }) => `desktop-link ${isActive ? "active" : ""}`}>Inicio</NavLink>
                    <NavLink to="/progress" className={({ isActive }) => `desktop-link ${isActive ? "active" : ""}`}>Progreso</NavLink>
                    <NavLink to="/resources" className={({ isActive }) => `desktop-link ${isActive ? "active" : ""}`}>Recursos</NavLink>
                    <NavLink to="/profile" className={({ isActive }) => `desktop-link ${isActive ? "active" : ""}`}>Cuenta</NavLink>
                    {profile?.role === "admin" && (
                        <NavLink to="/admin" className={({ isActive }) => `desktop-link ${isActive ? "active" : ""}`}>Administración</NavLink>
                    )}
                </nav>

                <div className="user-badge-nav">
                    <span className="user-name-badge">{profile?.name || "Usuario"}</span>
                </div>
            </div>
        </header>
    );
}
