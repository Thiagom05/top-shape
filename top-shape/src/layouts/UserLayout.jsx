import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import TopNavigation from "../components/TopNavigation";

export default function UserLayout() {
    const location = useLocation();

    return (
        <div className="app-layout">
            <TopNavigation />
            <main className="main-content">
                <div className="content-container">
                    <div key={location.pathname} className="page-transition">
                        <Outlet />
                    </div>
                </div>
            </main>
            <BottomNavigation />
        </div>
    );
}
