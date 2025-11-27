// src/features/teamBalance/pages/TeamBalancePage.tsx
import { useEffect, useState } from "react";
import { fetchMembers, type Member } from "../api/members";
import {
    requestTeamBalance,
    type TeamBalanceResponse,
} from "../api/teamBalance";

function TeamBalancePage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [result, setResult] = useState<TeamBalanceResponse | null>(null);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 멤버 목록 로드
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
                // 이미 선택된 경우 해제
                return prev.filter((id) => id !== memberId);
            } else {
                // 최대 10명까지만
                if (prev.length >= 10) return prev;
                return [...prev, memberId];
            }
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
        } catch (e: any) {
            console.error(e);
            const msg =
                e?.response?.data?.message ??
                "팀 밸런스를 계산하는 중 오류가 발생했습니다.";
            setError(msg);
        } finally {
            setLoadingBalance(false);
        }
    };

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem" }}>
            <h1>팀 밸런스</h1>

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

            {/* 선택한 인원 수 */}
            <p>선택된 멤버: {selectedIds.length} / 10</p>

            {/* 멤버 목록 + 체크박스 */}
            <section style={{ marginBottom: "1.5rem" }}>
                <h2>멤버 선택</h2>
                {loadingMembers && <p>멤버 불러오는 중...</p>}
                {!loadingMembers && members.length === 0 && (
                    <p>등록된 멤버가 없습니다. 먼저 멤버를 추가해주세요.</p>
                )}
                {!loadingMembers && members.length > 0 && (
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
                                선택
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
                        {members.map((m) => {
                            const checked = selectedIds.includes(m.id);
                            return (
                                <tr key={m.id}>
                                    <td
                                        style={{
                                            borderBottom: "1px solid #eee",
                                            padding: 8,
                                            textAlign: "center",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggleSelect(m.id)}
                                        />
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
                            );
                        })}
                        </tbody>
                    </table>
                )}

                <div style={{ marginTop: "1rem", textAlign: "right" }}>
                    <button
                        onClick={handleTeamBalance}
                        disabled={loadingBalance || selectedIds.length !== 10}
                        style={{
                            padding: "0.5rem 1.2rem",
                            borderRadius: 4,
                            border: "none",
                            backgroundColor:
                                selectedIds.length === 10 ? "#16a34a" : "#9ca3af",
                            color: "white",
                            cursor:
                                selectedIds.length === 10 && !loadingBalance
                                    ? "pointer"
                                    : "not-allowed",
                        }}
                    >
                        {loadingBalance ? "계산 중..." : "팀 짜기"}
                    </button>
                </div>
            </section>

            {/* 결과 영역 */}
            {result && (
                <section style={{ marginTop: "2rem" }}>
                    <h2>팀 배정 결과</h2>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem",
                            marginTop: "1rem",
                        }}
                    >
                        <div
                            style={{
                                border: "1px solid #93c5fd",
                                borderRadius: 8,
                                padding: "0.75rem 1rem",
                            }}
                        >
                            <h3 style={{ color: "#2563eb" }}>BLUE 팀</h3>
                            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                {result.blueTeam.map((p) => (
                                    <li key={p.id} style={{ padding: "0.25rem 0" }}>
                                        {p.name} ({p.riotId}){" "}
                                        {p.tier && <span> - {p.tier}</span>}{" "}
                                        {p.position && <span> [{p.position}]</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div
                            style={{
                                border: "1px solid #fca5a5",
                                borderRadius: 8,
                                padding: "0.75rem 1rem",
                            }}
                        >
                            <h3 style={{ color: "#ef4444" }}>RED 팀</h3>
                            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                {result.redTeam.map((p) => (
                                    <li key={p.id} style={{ padding: "0.25rem 0" }}>
                                        {p.name} ({p.riotId}){" "}
                                        {p.tier && <span> - {p.tier}</span>}{" "}
                                        {p.position && <span> [{p.position}]</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

export default TeamBalancePage;
