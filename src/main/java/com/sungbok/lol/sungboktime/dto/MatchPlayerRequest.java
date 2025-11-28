package com.sungbok.lol.sungboktime.dto;

import com.sungbok.lol.sungboktime.entity.MatchPlayer;
import jakarta.validation.constraints.NotNull;

public record MatchPlayerRequest(
        @NotNull
        Long memberId,

        @NotNull
        MatchPlayer.TeamSide teamSide,
        String position,
        String championName
) {
}
