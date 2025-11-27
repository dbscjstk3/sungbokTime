package com.sungbok.lol.sungboktime.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record MatchCreateRequest(
        LocalDateTime playedAt,
        String info,
        @NotNull
        List<MatchPlayerRequest> players
) {
}
