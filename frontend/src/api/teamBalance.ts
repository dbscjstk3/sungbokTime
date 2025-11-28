import api from "./client";

export type TeamBalanceMember = {
  memberId: number;
  name: string;
  riotId: string;
  tier: string | null;
  score: number;
};

export type TeamBalanceResponse = {
  blueTeam: TeamBalanceMember[];
  blueTeamScore: number;
  redTeam: TeamBalanceMember[];
  redTeamScore: number;
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
