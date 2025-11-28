import api from "./client";

export type MatchSummary = {
  matchId: number;
  playedAt: string;
  info: string | null;
  winSide: "BLUE" | "RED" | "PENDING" | null;
};

export type MatchPlayer = {
  memberId: number;
  name: string;
  riotId: string;
  teamSide: "BLUE" | "RED";
  isWin: boolean;
  position: string | null;
  championName: string | null;
};

export type MatchDetail = {
  matchId: number;
  playedAt: string;
  info: string | null;
  winSide: "BLUE" | "RED" | "PENDING" | null;
  players: MatchPlayer[];
};

export type CreateMatchPlayerInput = {
  memberId: number;
  teamSide: "BLUE" | "RED";
  position?: string | null;
  championName?: string | null;
};

export type CreateMatchRequest = {
  playedAt?: string | null;
  info?: string | null;
  winSide?: "BLUE" | "RED" | "PENDING" | null;
  players: CreateMatchPlayerInput[];
};

export async function fetchMatches(): Promise<MatchSummary[]> {
  const res = await api.get<MatchSummary[]>("/api/matches");
  return res.data;
}

export async function fetchMatchDetail(matchId: number): Promise<MatchDetail> {
  const res = await api.get<MatchDetail>(`/api/matches/${matchId}`);
  return res.data;
}

export async function createMatch(
  payload: CreateMatchRequest
): Promise<MatchDetail> {
  const res = await api.post<MatchDetail>("/api/matches", payload);
  return res.data;
}

export type SetMatchResultRequest = {
  winSide: "BLUE" | "RED";
};

export async function setMatchResult(
  matchId: number,
  payload: SetMatchResultRequest
): Promise<MatchDetail> {
  const res = await api.post<MatchDetail>(
    `/api/matches/${matchId}/result`,
    payload
  );
  return res.data;
}
