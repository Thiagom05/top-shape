import { createContext, useContext, useState, useCallback } from "react";
import "../styles/alert.css";

const AlertContext = createContext();

export function AlertProvider({ children }) {
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "info", // 'success' | 'error' | 'info' | 'confirm'
        confirmText: "Aceptar",
        cancelText: "Cancelar",
        onConfirm: null,
        onCancel: null
    });

    const showAlert = useCallback(({ title, message, type = "info", confirmText = "Aceptar" }) => {
        return new Promise((resolve) => {
            setAlertConfig({
                isOpen: true,
                title,
                message,
                type,
                confirmText,
                cancelText: "",
                onConfirm: () => {
                    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: null
            });
        });
    }, []);

    const showConfirm = useCallback(({ title, message, confirmText = "Aceptar", cancelText = "Cancelar" }) => {
        return new Promise((resolve) => {
            setAlertConfig({
                isOpen: true,
                title,
                message,
                type: "confirm",
                confirmText,
                cancelText,
                onConfirm: () => {
                    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
                    resolve(false);
                }
            });
        });
    }, []);

    const renderIcon = (type) => {
        switch (type) {
            case "success":
                return (
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                );
            case "error":
                return (
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                );
            case "confirm":
                return (
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                );
            default: // info
                return (
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                );
        }
    };

    const isDeleteAction = alertConfig.type === "confirm" && 
        (alertConfig.title.toLowerCase().includes("eliminar") || 
         alertConfig.message.toLowerCase().includes("eliminar") || 
         alertConfig.message.toLowerCase().includes("borrar"));

    return (
        <AlertContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            {alertConfig.isOpen && (
                <div 
                    className="alert-overlay" 
                    onClick={alertConfig.type === "confirm" ? null : alertConfig.onConfirm}
                >
                    <div className="alert-card" onClick={(e) => e.stopPropagation()}>
                        <div className={`alert-icon ${alertConfig.type}`}>
                            {renderIcon(alertConfig.type)}
                        </div>
                        {alertConfig.title && <h3 className="alert-title">{alertConfig.title}</h3>}
                        {alertConfig.message && <p className="alert-message">{alertConfig.message}</p>}
                        <div className="alert-buttons">
                            {alertConfig.type === "confirm" && (
                                <button className="btn-secondary alert-btn" onClick={alertConfig.onCancel}>
                                    {alertConfig.cancelText}
                                </button>
                            )}
                            <button 
                                className={`btn-primary alert-btn ${isDeleteAction ? "alert-btn-confirm-delete" : ""}`} 
                                onClick={alertConfig.onConfirm}
                            >
                                {alertConfig.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAlert() {
    return useContext(AlertContext);
}
