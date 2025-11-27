import { useEffect, useState, type FormEvent } from "react";
import { createMember, fetchMembers, type Member } from "../api/members";

function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 폼 상태
    const [name, setName] = useState("");
    const [gameName, setGameName] = useState("");
    const [tagLine, setTagLine] = useState("KR1");
    const [position, setPosition] = useState("");

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
                position: position || undefined,
            });

            // 등록 후 목록 새로고침
            await loadMembers();

            // 폼 초기화
            setName("");
            setGameName("");
            setTagLine("KR1");
            setPosition("");
        } catch (e: any) {
            console.error(e);
            const msg =
                e?.response?.data?.message ??
                "멤버를 등록하는 중 오류가 발생했습니다.";
            setError(msg);
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
            <h1>멤버 관리</h1>

            {/* 등록 폼 */}
            <section style={{ marginBottom: "2rem" }}>
                <h2>새 멤버 추가</h2>

                {error && (
                    <div
                        style={{
                            backgroundColor: "#ffe5e5",
                            padding: "0.5rem 1rem",
                            marginBottom: "1rem",
                            borderRadius: 4,
                        }}
                    >
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.75rem 1rem",
                        marginBottom: "1rem",
                    }}
                >
                    <div>
                        <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>
                            친구 이름
                        </label>
                        <input
                            type="text"
                            value={name}
                            placeholder="예: 지수"
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: "100%", padding: "0.4rem 0.6rem" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>
                            라이엇 ID (이름)
                        </label>
                        <input
                            type="text"
                            value={gameName}
                            placeholder="예: 지수fan"
                            onChange={(e) => setGameName(e.target.value)}
                            style={{ width: "100%", padding: "0.4rem 0.6rem" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>
                            태그 (TagLine)
                        </label>
                        <input
                            type="text"
                            value={tagLine}
                            placeholder="예: KR1"
                            onChange={(e) => setTagLine(e.target.value)}
                            style={{ width: "100%", padding: "0.4rem 0.6rem" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: 14, marginBottom: 4 }}>
                            포지션
                        </label>
                        <input
                            type="text"
                            value={position}
                            placeholder="예: TOP / JUNGLE / MID / ADC / SUPPORT"
                            onChange={(e) => setPosition(e.target.value)}
                            style={{ width: "100%", padding: "0.4rem 0.6rem" }}
                        />
                    </div>

                    <div style={{ gridColumn: "1 / span 2", textAlign: "right" }}>
                        <button
                            type="submit"
                            style={{
                                padding: "0.5rem 1.2rem",
                                borderRadius: 4,
                                border: "none",
                                backgroundColor: "#2563eb",
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            멤버 등록
                        </button>
                    </div>
                </form>
            </section>

            {/* 멤버 리스트 */}
            <section>
                <h2>멤버 목록</h2>
                {loading && <p>불러오는 중...</p>}
                {!loading && members.length === 0 && <p>등록된 멤버가 없습니다.</p>}

                {!loading && members.length > 0 && (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: "0.5rem",
                            fontSize: 14,
                        }}
                    >
                        <thead>
                        <tr>
                            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                                ID
                            </th>
                            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                                이름
                            </th>
                            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                                라이엇 ID
                            </th>
                            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                                티어
                            </th>
                            <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}>
                                포지션
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {members.map((m) => (
                            <tr key={m.id}>
                                <td
                                    style={{
                                        borderBottom: "1px solid #eee",
                                        padding: 8,
                                        textAlign: "center",
                                    }}
                                >
                                    {m.id}
                                </td>
                                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                                    {m.name}
                                </td>
                                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                                    {m.riotId}
                                </td>
                                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                                    {m.tier ?? "-"}
                                </td>
                                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                                    {m.position ?? "-"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}

export default MembersPage;
