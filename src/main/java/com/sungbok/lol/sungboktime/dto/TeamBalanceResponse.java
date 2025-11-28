package com.sungbok.lol.sungboktime.dto;

import com.sungbok.lol.sungboktime.entity.Member;

import java.util.List;

public record TeamBalanceResponse(
        List<TeamMemberDto> blueTeam,
        int blueTeamScore,
        List<TeamMemberDto> redTeam,
        int redTeamScore
) {

    public record TeamMemberDto(
            Long memberId,
            String name,
            String riotId,
            String tier,
            int score
    ) {
        public static TeamMemberDto from(Member m, int score) {
            return new TeamMemberDto(m.getId(), m.getName(), m.getRiotId(), m.getTier(), score);
        }
    }
}
