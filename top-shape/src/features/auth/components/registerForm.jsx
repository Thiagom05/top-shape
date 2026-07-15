import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { useAlert } from "../../../context/AlertContext";

export default function RegisterForm({ onToggle }) {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (!name.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
            showAlert({
                title: "Campos incompletos",
                message: "Por favor, completa todos los campos.",
                type: "warning"
            });
            return;
        }

        if (password !== confirmPassword) {
            showAlert({
                title: "Contraseñas no coinciden",
                message: "Las contraseñas ingresadas no coinciden.",
                type: "warning"
            });
            return;
        }

        try {
            setLoading(true);
            await register(email.trim(), password, name.trim(), lastName.trim());
            showAlert({
                title: "¡Registro exitoso!",
                message: "Tu cuenta ha sido creada correctamente.",
                type: "success"
            });
            navigate("/home");
        } catch (error) {
            showAlert({
                title: "Error al registrarse",
                message: error.message,
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
                <input
                    type="text"
                    className="input-field"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <input
                    type="text"
                    className="input-field"
                    placeholder="Apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <input
                    type="email"
                    className="input-field"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="form-group password-group">
                <input
                    type={showPassword ? "text" : "password"}
                    className="input-field"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ zIndex: 10 }}
                >
                    {showPassword ? (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    )}
                </button>
            </div>

            <div className="form-group">
                <input
                    type={showPassword ? "text" : "password"}
                    className="input-field"
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "12px" }}>
                {loading ? "Creando cuenta..." : "Registrarse"}
            </button>

            <div className="auth-links">
                <span className="auth-link-toggle" onClick={onToggle}>
                    ¿Ya tenés cuenta? <strong>Iniciá sesión</strong>
                </span>
            </div>
        </form>
    );
}