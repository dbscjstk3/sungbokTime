package com.sungbok.lol.sungboktime.dto;

import com.sungbok.lol.sungboktime.entity.Match;

import java.time.LocalDateTime;
import java.util.List;

public record MatchDetailResponse(
        Long matchId,
        LocalDateTime playedAt,
        String info,
        Match.WinSide winSide,
        List<MatchPlayerResponse> players
) {
    public static MatchDetailResponse from(Match match, List<MatchPlayerResponse> players) {
        return new MatchDetailResponse(match.getId(), match.getPlayedAt(), match.getInfo(), match.getWinSide(), players);
    }
}
