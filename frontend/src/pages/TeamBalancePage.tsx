// src/features/teamBalance/pages/TeamBalancePage.tsx
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { fetchMembers, type Member } from "../api/members";
import {
  requestTeamBalance,
  type TeamBalanceResponse,
} from "../api/teamBalance";
import "./TeamBalancePage.css";

function TeamBalancePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [result, setResult] = useState<TeamBalanceResponse | null>(null);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoadingMembers(true);
        setError(null);
        const data = await fetchMembers();
        setMembers(data);
      } catch (e) {
        console.error(e);
        setError("멤버 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoadingMembers(false);
      }
    };

    loadMembers();
  }, []);

  const toggleSelect = (memberId: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId);
      }
      if (prev.length >= 10) return prev;
      return [...prev, memberId];
    });
  };

  const handleTeamBalance = async () => {
    if (selectedIds.length !== 10) {
      setError("팀 밸런스를 위해 정확히 10명을 선택해야 합니다.");
      return;
    }

    try {
      setError(null);
      setLoadingBalance(true);
      const data = await requestTeamBalance({ memberIds: selectedIds });
      setResult(data);
    } catch (err: unknown) {
      console.error(err);
      if (isAxiosError(err)) {
        const message =
          typeof err.response?.data === "object" &&
          err.response?.data !== null &&
          "message" in err.response.data &&
          typeof (err.response.data as { message?: unknown }).message ===
            "string"
            ? (err.response.data as { message: string }).message
            : null;
        setError(message ?? "팀 밸런스를 계산하는 중 오류가 발생했습니다.");
        return;
      }
      setError("팀 밸런스를 계산하는 중 오류가 발생했습니다.");
    } finally {
      setLoadingBalance(false);
    }
  };

  const contentClassName =
    "team-balance-page__content team-balance-page__content--with-result";
  const hasResult = Boolean(result);
  const blueTeam = result?.blueTeam ?? [];
  const redTeam = result?.redTeam ?? [];
  const blueScoreLabel = hasResult ? result?.blueTeamScore : "—";
  const redScoreLabel = hasResult ? result?.redTeamScore : "—";

  return (
    <div className="team-balance-page">
      <header className="team-balance-page__header">
        <div>
          <h1>팀 밸런스</h1>
          <p>솔랭 티어 기반 팀밸런스 매칭</p>
        </div>
      </header>

      {error && <div className="team-balance-page__error">{error}</div>}

      <div className={contentClassName}>
        <section className="team-balance-page__card team-balance-page__card--form">
          <div className="team-balance-page__card-head">
            <div className="team-balance-page__card-head-row">
              <h2>멤버 선택</h2>
              <div className="team-balance-page__selected team-balance-page__selected--inline">
                <span>선택된 멤버</span>
                <strong>
                  {selectedIds.length} <span>/ 10</span>
                </strong>
              </div>
            </div>
          </div>

          {loadingMembers && (
            <p className="team-balance-page__status">멤버 불러오는 중...</p>
          )}
          {!loadingMembers && members.length === 0 && (
            <p className="team-balance-page__status">
              등록된 멤버가 없습니다. 먼저 멤버를 추가해주세요.
            </p>
          )}

          {!loadingMembers && members.length > 0 && (
            <div className="team-balance-page__table-wrapper">
              <table className="team-balance-page__table">
                <thead>
                  <tr>
                    <th scope="col">선택</th>
                    <th scope="col">이름</th>
                    <th scope="col">라이엇 ID</th>
                    <th scope="col">티어</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => {
                    const checked = selectedIds.includes(m.id);
                    return (
                      <tr key={m.id}>
                        <td data-label="선택">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSelect(m.id)}
                          />
                        </td>
                        <td data-label="이름">{m.name}</td>
                        <td data-label="라이엇 ID">{m.riotId}</td>
                        <td data-label="티어">{m.tier ?? "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="team-balance-page__cta">
            <button
              type="button"
              onClick={handleTeamBalance}
              disabled={loadingBalance || selectedIds.length !== 10}
            >
              {loadingBalance ? "계산 중..." : "균형 맞추기"}
            </button>
          </div>
        </section>

        <section className="team-balance-page__card team-balance-page__card--result">
          <div className="team-balance-page__card-head">
            <h2>팀 배정 결과</h2>
          </div>

          <div className="team-balance-page__result-grid">
            <div className="team-balance-page__result team-balance-page__result--blue">
              <div className="team-balance-page__result-header">
                <span>BLUE</span>
                <strong>{blueScoreLabel}</strong>
              </div>
              {hasResult ? (
                <ul>
                  {blueTeam.map((p) => (
                    <li key={p.memberId}>
                      <div className="team-balance-page__player-info">
                        <span className="team-balance-page__player-name">
                          {p.name}
                        </span>
                      </div>
                      <div className="team-balance-page__player-meta">
                        <span>{p.tier ?? "UNRANKED"}</span>
                        <span className="team-balance-page__player-score">
                          점수 {p.score}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="team-balance-page__result-empty">
                  <p>BLUE</p>
                </div>
              )}
            </div>

            <div className="team-balance-page__result team-balance-page__result--red">
              <div className="team-balance-page__result-header">
                <span>RED</span>
                <strong>{redScoreLabel}</strong>
              </div>
              {hasResult ? (
                <ul>
                  {redTeam.map((p) => (
                    <li key={p.memberId}>
                      <div className="team-balance-page__player-info">
                        <span className="team-balance-page__player-name">
                          {p.name}
                        </span>
                      </div>
                      <div className="team-balance-page__player-meta">
                        <span>{p.tier ?? "UNRANKED"}</span>
                        <span className="team-balance-page__player-score">
                          점수 {p.score}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="team-balance-page__result-empty">
                  <p>RED</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TeamBalancePage;
