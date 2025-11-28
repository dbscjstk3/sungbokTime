import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchMatchDetail,
  fetchMatches,
  type MatchDetail,
  type MatchSummary,
} from "../api/matches";
import { Link } from "react-router-dom";
import "./MatchesPage.css";

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

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [detail, setDetail] = useState<MatchDetail | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    try {
      setLoadingList(true);
      setListError(null);
      const data = await fetchMatches();
      setMatches(data);
      setSelectedMatchId((prev) => {
        const completed = data.filter((m) => m.winSide != null);
        if (prev != null && completed.some((m) => m.matchId === prev)) {
          return prev;
        }
        return completed.length > 0 ? completed[0].matchId : null;
      });
    } catch (err) {
      console.error(err);
      setListError("매치 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  useEffect(() => {
    if (selectedMatchId == null) {
      setDetail(null);
      return;
    }

    const loadDetail = async () => {
      try {
        setLoadingDetail(true);
        setDetailError(null);
        const data = await fetchMatchDetail(selectedMatchId);
        setDetail(data);
      } catch (err) {
        console.error(err);
        setDetailError("매치 상세를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoadingDetail(false);
      }
    };

    loadDetail();
  }, [selectedMatchId]);

  const selectedSummary = useMemo(
    () => matches.find((m) => m.matchId === selectedMatchId) ?? null,
    [matches, selectedMatchId]
  );

  const completedMatches = useMemo(
    () =>
      matches.filter((match) => match.winSide && match.winSide !== "PENDING"),
    [matches]
  );

  const bluePlayers =
    detail?.players.filter((p) => p.teamSide === "BLUE") ?? [];
  const redPlayers = detail?.players.filter((p) => p.teamSide === "RED") ?? [];

  return (
    <div className="matches-page">
      <header className="matches-page__header">
        <div className="matches-page__header-row">
          <div>
            <h1>매치 기록</h1>
          </div>
          <Link to="/matches/create" className="matches-page__primary-button">
            매치 등록
          </Link>
        </div>
      </header>

      <div className="matches-page__layout">
        <section className="matches-page__card matches-page__list-card">
          <div className="matches-page__card-head">
            <h2>매치 목록</h2>
          </div>

          {loadingList && (
            <p className="matches-page__status">불러오는 중...</p>
          )}
          {listError && <p className="matches-page__error-text">{listError}</p>}
          {!loadingList && completedMatches.length === 0 && !listError && (
            <p className="matches-page__status">등록된 매치가 없습니다.</p>
          )}

          {!loadingList && completedMatches.length > 0 && (
            <ul className="matches-page__list">
              {completedMatches.map((match) => {
                const isActive = match.matchId === selectedMatchId;
                return (
                  <li key={match.matchId}>
                    <button
                      type="button"
                      className={`matches-page__list-item${
                        isActive ? " matches-page__list-item--active" : ""
                      }`}
                      onClick={() => setSelectedMatchId(match.matchId)}
                    >
                      <div className="matches-page__list-meta">
                        <span
                          className={`matches-page__tag matches-page__tag--${
                            match.winSide?.toLowerCase() ?? "pending"
                          }`}
                        >
                          {match.winSide ?? "진행중"}
                        </span>
                        <span className="matches-page__date">
                          {formatDate(match.playedAt)}
                        </span>
                      </div>
                      <p className="matches-page__info">
                        {match.info ?? "추가 정보 없음"}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="matches-page__card matches-page__detail-card">
          <div className="matches-page__card-head matches-page__card-head--detail">
            <div>
              <h2>상세 정보</h2>
              {selectedSummary && (
                <div className="matches-page__detail-meta">
                  <span>{formatDate(selectedSummary.playedAt)}</span>
                  <span>{selectedSummary.info ?? "추가 정보 없음"}</span>
                </div>
              )}
            </div>
            {selectedSummary && (
              <span
                className={`matches-page__tag matches-page__tag--${
                  selectedSummary.winSide?.toLowerCase() ?? "pending"
                }`}
              >
                {selectedSummary.winSide ?? "진행중"}
              </span>
            )}
          </div>

          {loadingDetail && (
            <p className="matches-page__status">상세 정보를 불러오는 중...</p>
          )}
          {detailError && (
            <p className="matches-page__error-text">{detailError}</p>
          )}

          {!loadingDetail && (!detail || !selectedSummary) && !detailError && (
            <div className="matches-page__placeholder">
              <p>좌측에서 매치를 선택하면 상세 정보가 표시됩니다.</p>
            </div>
          )}

          {detail && selectedSummary && (
            <div className="matches-page__detail">
              <div className="matches-page__teams">
                <div className="matches-page__team matches-page__team--blue">
                  <div className="matches-page__team-head">
                    <h3>BLUE 팀</h3>
                    <span className="matches-page__team-score">
                      {detail.winSide === "BLUE" ? "WIN" : "LOSE"}
                    </span>
                  </div>
                  <ul>
                    {bluePlayers.map((player) => (
                      <li key={player.memberId}>
                        <div className="matches-page__player-main">
                          <span className="matches-page__player-name">
                            {player.name}
                          </span>
                          <span className="matches-page__player-id">
                            {player.riotId}
                          </span>
                        </div>
                        <div className="matches-page__player-sub">
                          <span>{player.position ?? "포지션 미정"}</span>
                          <span>{player.championName ?? "챔피언 미정"}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="matches-page__team matches-page__team--red">
                  <div className="matches-page__team-head">
                    <h3>RED 팀</h3>
                    <span className="matches-page__team-score">
                      {detail.winSide === "RED" ? "WIN" : "LOSE"}
                    </span>
                  </div>
                  <ul>
                    {redPlayers.map((player) => (
                      <li key={player.memberId}>
                        <div className="matches-page__player-main">
                          <span className="matches-page__player-name">
                            {player.name}
                          </span>
                          <span className="matches-page__player-id">
                            {player.riotId}
                          </span>
                        </div>
                        <div className="matches-page__player-sub">
                          <span>{player.position ?? "포지션 미정"}</span>
                          <span>{player.championName ?? "챔피언 미정"}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
