package com.sungbok.lol.sungboktime.dto;

import com.sungbok.lol.sungboktime.entity.Match;

import java.time.LocalDateTime;

public record MatchSummaryResponse(
        Long matchId,
        LocalDateTime playedAt,
        String info,
        Match.WinSide winSide
) {
    public static MatchSummaryResponse from(Match match) {
        return new MatchSummaryResponse(match.getId(), match.getPlayedAt(), match.getInfo(), match.getWinSide());
    }
}
