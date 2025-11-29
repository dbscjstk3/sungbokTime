import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type DragEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { createMatch } from "../api/matches";
import { fetchMembers, type Member } from "../api/members";
import "./MatchCreatePage.css";

type CreateRow = {
  memberId: number | "";
  teamSide: "BLUE" | "RED";
  position: string;
  championName: string;
};

const TEAM_LABEL: Record<"BLUE" | "RED", string> = {
  BLUE: "BLUE 팀",
  RED: "RED 팀",
};

export default function MatchCreatePage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);

  const templateRows = useMemo<CreateRow[]>(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        memberId: "",
        teamSide: index < 5 ? "BLUE" : "RED",
        position: "",
        championName: "",
      })),
    []
  );

  const [rows, setRows] = useState<CreateRow[]>(() =>
    templateRows.map((row) => ({ ...row }))
  );
  const [playedAt, setPlayedAt] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoadingMembers(true);
        setMemberError(null);
        const data = await fetchMembers();
        setMembers(data);
      } catch (err) {
        console.error(err);
        setMemberError("멤버 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoadingMembers(false);
      }
    };

    loadMembers();
  }, []);

  const resetRows = useCallback(() => {
    setRows(templateRows.map((row) => ({ ...row })));
  }, [templateRows]);

  // 사용되지 않은 멤버 목록 (이미 배치된 멤버 제외)
  const availableMembers = useMemo(() => {
    const usedMemberIds = new Set(
      rows.filter((row) => row.memberId !== "").map((row) => row.memberId)
    );
    return members.filter((member) => !usedMemberIds.has(member.id));
  }, [members, rows]);

  // 드래그 시작 핸들러
  const handleDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>, memberId: number) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("memberId", String(memberId));
      event.dataTransfer.setData("source", "member-list");
    },
    []
  );

  // 슬롯에서 드래그 시작 (다른 슬롯으로 이동하거나 제거하기 위해)
  const handleSlotDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>, rowIndex: number) => {
      const row = rows[rowIndex];
      if (row.memberId === "") return;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("memberId", String(row.memberId));
      event.dataTransfer.setData("source", "slot");
      event.dataTransfer.setData("rowIndex", String(rowIndex));
    },
    [rows]
  );

  // 드롭 핸들러
  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>, targetRowIndex: number) => {
      event.preventDefault();
      event.stopPropagation();

      const memberId = Number(event.dataTransfer.getData("memberId"));
      const source = event.dataTransfer.getData("source");
      const sourceRowIndex =
        source === "slot"
          ? Number(event.dataTransfer.getData("rowIndex"))
          : null;

      if (!memberId || isNaN(memberId)) return;

      setRows((prev) => {
        const next = [...prev];
        const targetRow = { ...next[targetRowIndex] };

        // 같은 슬롯에 드롭한 경우 무시
        if (sourceRowIndex === targetRowIndex) return prev;

        // 다른 슬롯에서 드래그한 경우, 원래 슬롯 비우기
        if (sourceRowIndex !== null) {
          next[sourceRowIndex] = {
            ...next[sourceRowIndex],
            memberId: "",
            position: "",
            championName: "",
          };
        }

        // 대상 슬롯에 멤버 배치
        targetRow.memberId = memberId;
        next[targetRowIndex] = targetRow;

        return next;
      });
    },
    []
  );

  // 드래그 오버 핸들러 (드롭 허용)
  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // 멤버 목록으로 드롭 (슬롯에서 멤버 제거)
  const handleMemberListDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const source = event.dataTransfer.getData("source");
      if (source !== "slot") return;

      const rowIndex = Number(event.dataTransfer.getData("rowIndex"));
      if (isNaN(rowIndex)) return;

      setRows((prev) => {
        const next = [...prev];
        next[rowIndex] = {
          ...next[rowIndex],
          memberId: "",
          position: "",
          championName: "",
        };
        return next;
      });
    },
    []
  );

  // 슬롯에서 멤버 제거 (X 버튼)
  const handleRemoveMember = useCallback((rowIndex: number) => {
    setRows((prev) => {
      const next = [...prev];
      next[rowIndex] = {
        ...next[rowIndex],
        memberId: "",
        position: "",
        championName: "",
      };
      return next;
    });
  }, []);

  const handleRowChange = useCallback(
    (
      index: number,
      field: "memberId" | "position" | "championName",
      value: string
    ) => {
      setRows((prev) => {
        const next = [...prev];
        const row = { ...next[index] };
        if (field === "memberId") {
          row.memberId = value ? Number(value) : "";
        } else {
          row[field] = value;
        }
        next[index] = row;
        return next;
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setSuccess(null);

      if (members.length === 0) {
        setError("멤버 목록이 비어 있습니다. 먼저 멤버를 등록해주세요.");
        return;
      }

      const missing = rows.some((row) => row.memberId === "");
      if (missing) {
        setError("모든 슬롯에 멤버를 선택해주세요.");
        return;
      }

      const ids = new Set<number>();
      for (const row of rows) {
        const id = row.memberId as number;
        if (ids.has(id)) {
          setError("동일한 멤버가 중복 선택되었습니다.");
          return;
        }
        ids.add(id);
      }

      const blueCount = rows.filter((row) => row.teamSide === "BLUE").length;
      const redCount = rows.filter((row) => row.teamSide === "RED").length;
      if (blueCount !== 5 || redCount !== 5) {
        setError("BLUE와 RED 팀에 각각 5명의 멤버를 배치해주세요.");
        return;
      }

      setCreating(true);
      try {
        await createMatch({
          playedAt: playedAt
            ? new Date(`${playedAt}T00:00:00`).toISOString()
            : null,
          info: info.trim() || null,
          players: rows.map((row) => ({
            memberId: row.memberId as number,
            teamSide: row.teamSide,
            position: row.position.trim() || null,
            championName: row.championName.trim() || null,
          })),
        });

        setSuccess(
          "매치가 등록되었습니다. 승리 팀을 지정하려면 진행 중 매치 페이지로 이동하세요."
        );
        resetRows();
        setPlayedAt("");
        setInfo("");
        setTimeout(() => navigate("/matches/pending"), 400);
      } catch (err) {
        console.error(err);
        setError("매치를 등록하는 중 오류가 발생했습니다.");
      } finally {
        setCreating(false);
      }
    },
    [info, members.length, navigate, playedAt, resetRows, rows]
  );

  const renderTeamSection = (team: "BLUE" | "RED") => {
    let order = 0;
    const teamRows = rows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => row.teamSide === team);

    return (
      <div
        className={`match-create-page__team-card match-create-page__team-card--${team.toLowerCase()}`}
      >
        <div className="match-create-page__team-head">
          <h2>{TEAM_LABEL[team]}</h2>
          <span className="match-create-page__team-count">
            {teamRows.filter(({ row }) => row.memberId !== "").length}/5
          </span>
        </div>
        <div className="match-create-page__team-grid">
          {teamRows.map(({ row, index }) => {
            order += 1;
            const member = members.find((m) => m.id === row.memberId);
            return (
              <div
                className={`match-create-page__player-card ${
                  row.memberId === "" ? "match-create-page__player-card--empty" : ""
                }`}
                key={`${team}-${index}`}
                draggable={row.memberId !== ""}
                onDragStart={(e) => handleSlotDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
              >
                <div className="match-create-page__player-slot">
                  <span className="match-create-page__player-slot-index">
                    {order}
                  </span>
                  {row.memberId === "" ? (
                    <div className="match-create-page__drop-zone">
                      멤버를 드롭하세요
                    </div>
                  ) : (
                    <div className="match-create-page__member-display">
                      <span className="match-create-page__member-name">
                        {member?.name} ({member?.riotId})
                      </span>
                      <button
                        type="button"
                        className="match-create-page__remove-button"
                        onClick={() => handleRemoveMember(index)}
                        disabled={creating}
                        title="제거"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                {row.memberId !== "" && (
                  <div className="match-create-page__player-inputs">
                    <input
                      type="text"
                      placeholder="챔피언"
                      value={row.championName}
                      onChange={(event) =>
                        handleRowChange(index, "championName", event.target.value)
                      }
                      disabled={creating}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="match-create-page">
      <header className="match-create-page__header">
        <div>
          <h1>매치 등록</h1>
          <p>팀 구성을 입력하고 새로운 매치 정보를 기록하세요.</p>
        </div>
        <button
          type="button"
          className="match-create-page__ghost-button"
          onClick={resetRows}
          disabled={creating}
        >
          행 초기화
        </button>
      </header>

      <form className="match-create-page__form" onSubmit={handleSubmit}>
        {error && <p className="match-create-page__error-text">{error}</p>}
        {success && (
          <p className="match-create-page__success-text">{success}</p>
        )}
        {memberError && (
          <p className="match-create-page__error-text">{memberError}</p>
        )}

        <div className="match-create-page__form-grid">
          <label className="match-create-page__field">
            <span>경기 날짜</span>
            <input
              type="date"
              value={playedAt}
              onChange={(event) => setPlayedAt(event.target.value)}
              disabled={creating}
            />
          </label>
          <label className="match-create-page__field match-create-page__field--info">
            <span>경기 정보</span>
            <textarea
              value={info}
              onChange={(event) => setInfo(event.target.value)}
              placeholder="예: 주말 내전"
              disabled={creating}
            />
          </label>
        </div>

        <div className="match-create-page__main-layout">
          <aside className="match-create-page__member-list">
            <div className="match-create-page__member-list-header">
              <h3>멤버 목록</h3>
              <span className="match-create-page__member-count">
                {availableMembers.length}명
              </span>
            </div>
            {loadingMembers ? (
              <p className="match-create-page__status">멤버 불러오는 중...</p>
            ) : availableMembers.length === 0 ? (
              <p className="match-create-page__status">
                모든 멤버가 배치되었습니다.
              </p>
            ) : (
              <div
                className="match-create-page__member-list-content"
                onDrop={handleMemberListDrop}
                onDragOver={handleDragOver}
              >
                {availableMembers.map((member) => (
                  <div
                    key={member.id}
                    className="match-create-page__member-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, member.id)}
                  >
                    <span className="match-create-page__member-item-name">
                      {member.name}
                    </span>
                    <span className="match-create-page__member-item-riot">
                      {member.riotId}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </aside>

          <div className="match-create-page__teams">
            {renderTeamSection("BLUE")}
            {renderTeamSection("RED")}
          </div>
        </div>

        <div className="match-create-page__actions">
          <button
            type="submit"
            className="match-create-page__primary-button"
            disabled={creating}
          >
            {creating ? "등록 중..." : "매치 등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
