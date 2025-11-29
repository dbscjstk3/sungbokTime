package com.sungbok.lol.sungboktime.service;

import com.sungbok.lol.sungboktime.dto.*;
import com.sungbok.lol.sungboktime.entity.Match;
import com.sungbok.lol.sungboktime.entity.Match.WinSide;
import com.sungbok.lol.sungboktime.entity.MatchPlayer;
import com.sungbok.lol.sungboktime.entity.MatchPlayer.TeamSide;
import com.sungbok.lol.sungboktime.entity.Member;
import com.sungbok.lol.sungboktime.repository.MatchPlayerRepository;
import com.sungbok.lol.sungboktime.repository.MatchRepository;
import com.sungbok.lol.sungboktime.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MatchService {

    private final MatchRepository matchRepository;
    private final MatchPlayerRepository matchPlayerRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public MatchDetailResponse createMatch(MatchCreateRequest request) {
        LocalDateTime playedAt = request.playedAt() != null
                ? request.playedAt()
                : LocalDateTime.now();

        WinSide winSide = request.winSide() != null ? request.winSide() : WinSide.PENDING;

        Match match = Match.builder()
                .playedAt(playedAt)
                .info(request.info())
                .winSide(winSide)
                .build();

        for (MatchPlayerRequest playerRequest : request.players()) {
            Member member = memberRepository.findById(playerRequest.memberId())
                    .orElseThrow(() -> new IllegalArgumentException("Member not found"));

            boolean isWin = false;
            if (winSide != WinSide.PENDING) {
                isWin = (winSide == WinSide.BLUE && playerRequest.teamSide() == TeamSide.BLUE)
                        || (winSide == WinSide.RED && playerRequest.teamSide() == TeamSide.RED);
            }

            MatchPlayer player = MatchPlayer.builder()
                    .member(member)
                    .teamSide(playerRequest.teamSide())
                    .isWin(isWin)
                    .position(playerRequest.position())
                    .championName(playerRequest.championName())
                    .build();

            match.addPlayer(player);
        }

        Match saved = matchRepository.save(match);

        List<MatchPlayerResponse> playerResponses = saved.getPlayers().stream()
                .map(MatchPlayerResponse::from)
                .toList();

        return MatchDetailResponse.from(saved, playerResponses);
    }

    public List<MatchSummaryResponse> getMatches() {
        return matchRepository.findAll().stream()
                .map(MatchSummaryResponse::from)
                .toList();
    }

    public MatchDetailResponse getMatchDetail(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));

        List<MatchPlayerResponse> playerResponses = match.getPlayers().stream()
                .map(MatchPlayerResponse::from)
                .toList();

        return MatchDetailResponse.from(match, playerResponses);
    }


    @Transactional
    public MatchDetailResponse setMatchResult(Long matchId, MatchResultRequest request) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));

        WinSide winSide = request.winSide();
        if (winSide == null || winSide == WinSide.PENDING) {
            throw new IllegalArgumentException("Win side is required");
        }

        match.setWinSide(winSide);

        // players를 명시적으로 로드하고 업데이트
        List<MatchPlayer> players = match.getPlayers();
        for (MatchPlayer player : players) {
            TeamSide teamSide = player.getTeamSide();
            boolean win = (winSide == WinSide.BLUE && teamSide == TeamSide.BLUE) ||
                    (winSide == WinSide.RED && teamSide == TeamSide.RED);
            player.markWin(win);
            // MatchPlayer를 명시적으로 저장
            matchPlayerRepository.save(player);
        }

        // Match와 MatchPlayer 모두 저장
        matchRepository.save(match);

        // 저장 후 다시 조회하여 최신 데이터 가져오기
        Match refreshedMatch = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));

        List<MatchPlayerResponse> playerResponses = refreshedMatch.getPlayers().stream()
                .map(MatchPlayerResponse::from)
                .toList();

        return MatchDetailResponse.from(refreshedMatch, playerResponses);
    }
}
