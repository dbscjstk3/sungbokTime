package com.sungbok.lol.sungboktime.controller;

import com.sungbok.lol.sungboktime.dto.MemberCreateRequest;
import com.sungbok.lol.sungboktime.dto.MemberResponse;
import com.sungbok.lol.sungboktime.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping
    public List<MemberResponse> getMembers() {
        return memberService.getMembers();
    }

    @PostMapping
    public MemberResponse createMember(@RequestBody @Valid MemberCreateRequest request) {
        return memberService.createMember(request);
    }
}
