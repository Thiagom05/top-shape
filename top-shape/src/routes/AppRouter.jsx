import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import GuidesPage from "../pages/GuidesPage";
import ProgressPage from "../pages/ProgressPage";
import ResourcesPage from "../pages/ResourcesPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "../components/ProtectedRoute";
import UserLayout from "../layouts/UserLayout";

// Vistas del Administrador
import AdminRoute from "../components/AdminRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ParticipantDetail from "../pages/admin/ParticipantDetail";
import ContentManager from "../pages/admin/ContentManager";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta Pública */}
                <Route path="/" element={<LoginPage />} />

                {/* Rutas Privadas del Participante */}
                <Route
                    element={
                        <ProtectedRoute>
                            <UserLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/guides" element={<GuidesPage />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="/resources" element={<ResourcesPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>

                {/* Rutas Privadas del Administrador */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AdminRoute>
                                <UserLayout />
                            </AdminRoute>
                        </ProtectedRoute>
                    }
                >
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/user/:id" element={<ParticipantDetail />} />
                    <Route path="/admin/content" element={<ContentManager />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}