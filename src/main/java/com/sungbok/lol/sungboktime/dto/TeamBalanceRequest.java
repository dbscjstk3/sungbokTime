package com.sungbok.lol.sungboktime.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record TeamBalanceRequest(
        @NotNull
        List<Long> memberIds
) {
}
