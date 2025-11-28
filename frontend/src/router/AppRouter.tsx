import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MembersPage from "../pages/MembersPage";
import TeamBalancePage from "../pages/TeamBalancePage";
import MatchesPage from "../pages/MatchesPage";
import MatchCreatePage from "../pages/MatchCreatePage";
import PendingMatchesPage from "../pages/PendingMatchesPage";
import RoulettePage from "../pages/RoulettePage";
import Layout from "../components/Layout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/members" replace />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/team-balance" element={<TeamBalancePage />} />
          <Route path="/matches/create" element={<MatchCreatePage />} />
          <Route path="/matches/pending" element={<PendingMatchesPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/roulette" element={<RoulettePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
