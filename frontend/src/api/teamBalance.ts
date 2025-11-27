import api from "./client"

export type TeamBalanceMember = {
    id: number;
    name: string;
    riotId: string;
    tier: string | null;
    position: string | null;
};

export type TeamBalanceResponse = {
    blueTeam: TeamBalanceMember[];
    redTeam: TeamBalanceMember[];
};

export type TeamBalanceRequest = {
    memberIds: number[];
};

export async function requestTeamBalance(
    payload: TeamBalanceRequest
): Promise<TeamBalanceResponse> {
    const res = await api.post<TeamBalanceResponse>("/api/team-balance", payload);
    return res.data;
}