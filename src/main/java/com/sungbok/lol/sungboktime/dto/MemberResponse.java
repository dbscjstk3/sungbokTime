package com.sungbok.lol.sungboktime.dto;

import com.sungbok.lol.sungboktime.entity.Member;

public record MemberResponse(
        Long id,
        String name,
        String riotId,
        String tier,
        String position
) {
    public static MemberResponse from(Member m) {
        return new MemberResponse(m.getId(), m.getName(), m.getRiotId(), m.getTier(), m.getPosition());
    }
}
