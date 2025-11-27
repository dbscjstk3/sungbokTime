import { Link } from "react-router-dom";
import * as React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {/* 상단 네비게이션 */}
            <nav
                style={{
                    background: "#1f2937",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    gap: "1rem",
                }}
            >
                <Link to="/members" style={{ color: "white", textDecoration: "none" }}>
                    멤버
                </Link>
                <Link
                    to="/team-balance"
                    style={{ color: "white", textDecoration: "none" }}
                >
                    팀 밸런스
                </Link>
                <Link
                    to="/matches"
                    style={{ color: "white", textDecoration: "none" }}
                >
                    매치 기록
                </Link>
            </nav>

            {/* 페이지 내용 */}
            <main style={{ padding: "2rem", background: "#f9fafb", minHeight: "100vh" }}>
                {children}
            </main>
        </div>
    );
}
