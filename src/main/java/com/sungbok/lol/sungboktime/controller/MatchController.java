package com.sungbok.lol.sungboktime.controller;

import com.sungbok.lol.sungboktime.dto.MatchCreateRequest;
import com.sungbok.lol.sungboktime.dto.MatchDetailResponse;
import com.sungbok.lol.sungboktime.dto.MatchResultRequest;
import com.sungbok.lol.sungboktime.dto.MatchSummaryResponse;
import com.sungbok.lol.sungboktime.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping
    public MatchDetailResponse createMatch(@RequestBody @Valid MatchCreateRequest request) {
        return matchService.createMatch(request);
    }

    @GetMapping
    public List<MatchSummaryResponse> getMatches() {
        return matchService.getMatches();
    }

    @GetMapping("/{matchId}")
    public MatchDetailResponse getMatchDetail(@PathVariable Long matchId) {
        return matchService.getMatchDetail(matchId);
    }

    @PostMapping("/{matchId}/result")
    public MatchDetailResponse setMatchResult(
            @PathVariable Long matchId,
            @RequestBody @Valid MatchResultRequest request
    ) {
        return matchService.setMatchResult(matchId, request);
    }
}
