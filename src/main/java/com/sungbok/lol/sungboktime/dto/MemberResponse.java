package com.sungbok.lol.sungboktime.dto;

import com.sungbok.lol.sungboktime.entity.Member;

public record MemberResponse(
        Long id,
        String name,
        String riotId,
        String tier,
        Integer totalGames,
        Integer wins,
        Integer losses,
        Double winRate
) {
    public static MemberResponse from(Member m, int totalGames, int wins, int losses, double winRate) {
        return new MemberResponse(
                m.getId(),
                m.getName(),
                m.getRiotId(),
                m.getTier(),
                totalGames,
                wins,
                losses,
                winRate
        );
    }
}
