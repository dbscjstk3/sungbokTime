import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchMatches,
  fetchMatchDetail,
  setMatchResult,
  type MatchSummary,
  type MatchDetail,
} from "../api/matches";
import "./PendingMatchesPage.css";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return new Intl.DateTimeFormat("ko", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default function PendingMatchesPage() {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [matchDetails, setMatchDetails] = useState<Record<number, MatchDetail>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvingId, setResolvingId] = useState<number | null>(null);

  const pendingMatches = useMemo(
    () =>
      matches.filter(
        (match) => match.winSide === "PENDING" || match.winSide == null
      ),
    [matches]
  );

  const loadPendingDetails = useCallback(async (matchIds: number[]) => {
    if (matchIds.length === 0) {
      return;
    }
    try {
      const detailList = await Promise.all(
        matchIds.map((id) => fetchMatchDetail(id))
      );
      setMatchDetails((prev) => {
        const next = { ...prev };
        detailList.forEach((detail) => {
          next[detail.matchId] = detail;
        });
        return next;
      });
    } catch (err) {
      console.error(err);
      setError("매치 참가자 정보를 불러오는 중 문제가 발생했습니다.");
    }
  }, []);

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMatches();
      setMatches(data);
      const pendingIds = data
        .filter((match) => match.winSide === "PENDING" || match.winSide == null)
        .map((match) => match.matchId);
      await loadPendingDetails(pendingIds);
    } catch (err) {
      console.error(err);
      setError("진행 중 매치 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [loadPendingDetails]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const handleResolve = useCallback(
    async (matchId: number, winSide: "BLUE" | "RED") => {
      try {
        setResolvingId(matchId);
        await setMatchResult(matchId, { winSide });
        await loadMatches();
      } catch (err) {
        console.error(err);
        setError("승리 팀을 저장하는 중 오류가 발생했습니다.");
      } finally {
        setResolvingId(null);
      }
    },
    [loadMatches]
  );

  return (
    <div className="pending-matches-page">
      <header className="pending-matches-page__header">
        <div>
          <h1>진행 중 매치</h1>
          <p>아직 승패가 확정되지 않은 매치에 대해 승리 팀을 지정하세요.</p>
        </div>
        <button
          type="button"
          className="pending-matches-page__ghost-button"
          onClick={loadMatches}
          disabled={loading}
        >
          새로고침
        </button>
      </header>

      <section className="pending-matches-page__card">
        {error && <p className="pending-matches-page__error-text">{error}</p>}
        {loading && (
          <p className="pending-matches-page__status">불러오는 중...</p>
        )}
        {!loading && pendingMatches.length === 0 && !error && (
          <p className="pending-matches-page__status">
            진행 중인 매치가 없습니다.
          </p>
        )}

        {!loading && pendingMatches.length > 0 && (
          <ul className="pending-matches-page__list">
            {pendingMatches.map((match) => (
              <li key={match.matchId} className="pending-matches-page__item">
                <div className="pending-matches-page__item-top">
                  <div className="pending-matches-page__meta">
                    <strong>{formatDate(match.playedAt)}</strong>
                    <span>{match.info ?? "추가 정보 없음"}</span>
                  </div>
                  <div className="pending-matches-page__actions">
                    {(["BLUE", "RED"] as const).map((team) => (
                      <button
                        key={team}
                        type="button"
                        className={`pending-matches-page__win-button pending-matches-page__win-button--${team.toLowerCase()}`}
                        onClick={() => handleResolve(match.matchId, team)}
                        disabled={resolvingId === match.matchId}
                      >
                        {team === "BLUE" ? "BLUE 팀 승리" : "RED 팀 승리"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pending-matches-page__teams">
                  {(() => {
                    const detail = matchDetails[match.matchId];
                    if (!detail) {
                      return (
                        <p className="pending-matches-page__team-loading">
                          참가자 정보를 불러오는 중...
                        </p>
                      );
                    }

                    const bluePlayers = detail.players.filter(
                      (player) => player.teamSide === "BLUE"
                    );
                    const redPlayers = detail.players.filter(
                      (player) => player.teamSide === "RED"
                    );

                    return (
                      <>
                        <div className="pending-matches-page__team pending-matches-page__team--blue">
                          <span className="pending-matches-page__team-label">
                            BLUE 팀
                          </span>
                          <ul className="pending-matches-page__team-list">
                            {bluePlayers.map((player) => (
                              <li key={player.memberId}>{player.name}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="pending-matches-page__team pending-matches-page__team--red">
                          <span className="pending-matches-page__team-label">
                            RED 팀
                          </span>
                          <ul className="pending-matches-page__team-list">
                            {redPlayers.map((player) => (
                              <li key={player.memberId}>{player.name}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
