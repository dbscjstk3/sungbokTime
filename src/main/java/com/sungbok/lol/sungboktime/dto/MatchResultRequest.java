package com.sungbok.lol.sungboktime.dto;

import com.sungbok.lol.sungboktime.entity.Match;

public record MatchResultRequest(
        Match.WinSide winSide
) {
}
