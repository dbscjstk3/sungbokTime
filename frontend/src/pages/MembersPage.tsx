import { isAxiosError } from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { createMember, fetchMembers, type Member } from "../api/members";
import "./MembersPage.css";

function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태
  const [name, setName] = useState("");
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMembers();
      setMembers(data);
    } catch (e) {
      console.error(e);
      setError("멤버 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !gameName || !tagLine) {
      setError("이름, 라이엇 ID, 태그는 필수입니다.");
      return;
    }

    try {
      setError(null);
      await createMember({
        name,
        gameName,
        tagLine,
      });

      // 등록 후 목록 새로고침
      await loadMembers();

      // 폼 초기화
      setName("");
      setGameName("");
      setTagLine("");
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
        setError(message ?? "멤버를 등록하는 중 오류가 발생했습니다.");
        return;
      }
      setError("멤버를 등록하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="members-page">
      <header className="members-page__header">
        <h1>멤버 관리</h1>
      </header>

      <div className="members-page__layout">
        <section className="members-page__form-section">
          <div className="members-page__card">
            <h2>새 멤버 추가</h2>

            {error && <div className="members-page__error">{error}</div>}

            <form className="members-page__form" onSubmit={handleSubmit}>
              <div className="members-page__field">
                <label htmlFor="member-name">이름</label>
                <input
                  id="member-name"
                  type="text"
                  value={name}
                  placeholder="예: 윤현석"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="members-page__field">
                <label htmlFor="member-riot-name">소환사명</label>
                <input
                  id="member-riot-name"
                  type="text"
                  value={gameName}
                  placeholder="예: 지수fan"
                  onChange={(e) => setGameName(e.target.value)}
                />
              </div>

              <div className="members-page__field">
                <label htmlFor="member-tag-line">태그 (# 빼고 입력)</label>
                <input
                  id="member-tag-line"
                  type="text"
                  value={tagLine}
                  placeholder="예: KR1"
                  onChange={(e) => setTagLine(e.target.value)}
                />
              </div>

              <div className="members-page__field members-page__actions">
                <button type="submit">멤버 등록</button>
              </div>
            </form>
          </div>
        </section>

        <section className="members-page__list-section">
          <div className="members-page__card">
            <h2>멤버 목록</h2>
            {loading && <p className="members-page__status">불러오는 중...</p>}
            {!loading && members.length === 0 && (
              <p className="members-page__status">등록된 멤버가 없습니다.</p>
            )}

            {!loading && members.length > 0 && (
              <div className="members-page__table-wrapper">
                <table className="members-page__table">
                  <thead>
                    <tr>
                      <th scope="col">이름</th>
                      <th scope="col">소환사명</th>
                      <th scope="col">티어</th>
                      <th scope="col">경기 수</th>
                      <th scope="col">승</th>
                      <th scope="col">패</th>
                      <th scope="col">승률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id}>
                        <td>{m.name}</td>
                        <td>{m.riotId}</td>
                        <td>{m.tier ?? "-"}</td>
                        <td>{m.totalGames}</td>
                        <td className="members-page__stat--win">{m.wins}</td>
                        <td className="members-page__stat--loss">{m.losses}</td>
                        <td className="members-page__stat--rate">
                          {m.totalGames > 0 ? `${m.winRate.toFixed(1)}%` : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default MembersPage;
