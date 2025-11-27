package com.sungbok.lol.sungboktime.controller;

import com.sungbok.lol.sungboktime.dto.TeamBalanceRequest;
import com.sungbok.lol.sungboktime.dto.TeamBalanceResponse;
import com.sungbok.lol.sungboktime.service.TeamBalanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/team-balance")
@RequiredArgsConstructor
public class TeamBalanceController {

    private final TeamBalanceService teamBalanceService;

    @PostMapping
    public TeamBalanceResponse balance(@RequestBody @Valid TeamBalanceRequest request) {
        return teamBalanceService.balance(request);
    }
}
