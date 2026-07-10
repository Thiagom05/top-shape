import { Outlet } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import TopNavigation from "../components/TopNavigation";

export default function UserLayout() {
    return (
        <div className="app-layout">
            <TopNavigation />
            <main className="main-content">
                <div className="content-container">
                    <Outlet />
                </div>
            </main>
            <BottomNavigation />
        </div>
    );
}
