package com.sungbok.lol.sungboktime.dto;

import com.sungbok.lol.sungboktime.entity.Match;
import com.sungbok.lol.sungboktime.entity.MatchPlayer;

public record MatchPlayerResponse(
        Long memberId,
        String name,
        String riotId,
        MatchPlayer.TeamSide teamSide,
        Boolean isWin,
        String position,
        String championName
) {
    public static MatchPlayerResponse from(MatchPlayer p) {
        return new MatchPlayerResponse(
                p.getMember().getId(),
                p.getMember().getName(),
                p.getMember().getRiotId(),
                p.getTeamSide(),
                p.getIsWin(),
                p.getPosition(),
                p.getChampionName()
        );
    }
}
