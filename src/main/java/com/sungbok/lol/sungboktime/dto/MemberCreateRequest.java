package com.sungbok.lol.sungboktime.dto;

import jakarta.validation.constraints.NotBlank;

public record MemberCreateRequest(
        @NotBlank
        String name,
        @NotBlank
        String gameName,
        @NotBlank
        String tagLine,
        String position
) {
}
