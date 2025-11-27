import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MembersPage from "../pages/MembersPage";
import TeamBalancePage from "../pages/TeamBalancePage";
import Layout from "../components/Layout";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/members" replace />} />
                    <Route path="/members" element={<MembersPage />} />
                    <Route path="/team-balance" element={<TeamBalancePage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}
