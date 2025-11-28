import { NavLink } from "react-router-dom";
import * as React from "react";
import "./Layout.css";
import kingLogo from "../assets/KING.JPG";

const NAV_ITEMS = [
  { to: "/members", label: "멤버", base: "members", end: true },
  { to: "/team-balance", label: "팀 밸런스", base: "team", end: true },
  {
    to: "/matches/create",
    label: "매치 등록",
    base: "match-create",
    end: true,
  },
  {
    to: "/matches/pending",
    label: "진행 중 매치",
    base: "matches-pending",
    end: true,
  },
  { to: "/matches", label: "매치 기록", base: "matches", end: true },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const getClassName =
    (base: string) =>
    ({ isActive }: { isActive: boolean }) =>
      `layout__link layout__link--${base}${
        isActive ? ` layout__link--${base}--active` : ""
      }`;

  return (
    <div className="layout">
      <nav className="layout__nav">
        <div className="layout__nav-inner">
          <div className="layout__brand">
            <img
              src={kingLogo}
              alt="SungbokTime 로고"
              className="layout__brand-logo"
            />
            <span>SungbokTime</span>
          </div>
          <div className="layout__links">
            {NAV_ITEMS.map(({ to, label, base, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={getClassName(base)}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* 페이지 내용 */}
      <main className="layout__main">{children}</main>
    </div>
  );
}
