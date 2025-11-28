import api from "./client";

export type Member = {
  id: number;
  name: string;
  riotId: string;
  tier: string | null;
};

export type CreateMemberRequest = {
  name: string;
  gameName: string;
  tagLine: string;
};

export async function fetchMembers(): Promise<Member[]> {
  const res = await api.get<Member[]>("/api/members");
  return res.data;
}

export async function createMember(
  payload: CreateMemberRequest
): Promise<Member> {
  const res = await api.post<Member>("/api/members", payload);
  return res.data;
}
