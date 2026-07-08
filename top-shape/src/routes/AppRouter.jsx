import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import GuidesPage from "../pages/GuidesPage";
import ProgressPage from "../pages/ProgressPage";
import ResourcesPage from "../pages/ResourcesPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/guides" element={<GuidesPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
            </Routes>
        </BrowserRouter>
    );
}