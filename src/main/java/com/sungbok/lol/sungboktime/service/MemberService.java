package com.sungbok.lol.sungboktime.service;

import com.sungbok.lol.sungboktime.config.RiotApiClient;
import com.sungbok.lol.sungboktime.dto.AccountResponse;
import com.sungbok.lol.sungboktime.dto.LeagueResponse;
import com.sungbok.lol.sungboktime.dto.MemberCreateRequest;
import com.sungbok.lol.sungboktime.dto.MemberResponse;
import com.sungbok.lol.sungboktime.entity.Member;
import com.sungbok.lol.sungboktime.entity.MatchPlayer;
import com.sungbok.lol.sungboktime.repository.MemberRepository;
import com.sungbok.lol.sungboktime.repository.MatchPlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final MatchPlayerRepository matchPlayerRepository;
    private final RiotApiClient riotApiClient;

    public List<MemberResponse> getMembers() {
        return memberRepository.findAll().stream()
                .map(member -> {
                    // 네이티브 쿼리로 직접 조회 (더 확실함)
                    List<MatchPlayer> matchPlayers = matchPlayerRepository.findCompletedMatchesByMemberId(member.getId());
                    
                    log.info("Member: {} (ID: {}), Found {} completed matches", 
                            member.getName(), member.getId(), matchPlayers.size());
                    
                    int totalGames = matchPlayers.size();
                    
                    // isWin 값 확인 및 집계
                    int wins = 0;
                    int losses = 0;
                    
                    for (MatchPlayer mp : matchPlayers) {
                        Boolean isWin = mp.getIsWin();
                        log.debug("  - MatchPlayer ID: {}, isWin: {} (type: {})", 
                                mp.getId(), isWin, (isWin != null ? isWin.getClass().getSimpleName() : "null"));
                        
                        if (isWin != null) {
                            if (isWin) {
                                wins++;
                            } else {
                                losses++;
                            }
                        } else {
                            log.warn("  - MatchPlayer ID: {} has null isWin value!", mp.getId());
                            losses++; // null은 패배로 처리
                        }
                    }
                    
                    double winRate = totalGames > 0 ? (double) wins / totalGames * 100 : 0.0;
                    
                    log.info("Member: {}, Total: {}, Wins: {}, Losses: {}, WinRate: {:.2f}%", 
                            member.getName(), totalGames, wins, losses, winRate);
                    
                    return MemberResponse.from(member, totalGames, wins, losses, winRate);
                })
                .toList();
    }

    @Transactional
    public MemberResponse createMember(MemberCreateRequest request) {
        AccountResponse account = riotApiClient.getAccountByRiotId(
                request.gameName(),
                request.tagLine()
        );

        String puuid = account.puuid();
        Optional<LeagueResponse> leagueOpt = riotApiClient.getSoloRankByPuuid(puuid);

        String tier = null;

        if (leagueOpt.isPresent()) {
            LeagueResponse league = leagueOpt.get();
            tier = league.tier();
        }

        Member member = Member.builder()
                .name(request.name())
                .riotId(account.gameName() + "#" + account.tagLine())
                .riotPuuid(puuid)
                .tier(tier == null ? "UNRANKED" : tier)
                .build();

        Member saved = memberRepository.save(member);
        return MemberResponse.from(saved, 0, 0, 0, 0.0);
    }
}
