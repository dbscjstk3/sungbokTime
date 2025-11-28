package com.sungbok.lol.sungboktime.dto;

import com.sungbok.lol.sungboktime.entity.Match;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record MatchCreateRequest(
        LocalDateTime playedAt,
        String info,
        Match.WinSide winSide,
        @NotNull
        List<MatchPlayerRequest> players
) {
}
