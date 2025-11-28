package com.sungbok.lol.sungboktime.service;

import com.sungbok.lol.sungboktime.config.RiotApiClient;
import com.sungbok.lol.sungboktime.dto.AccountResponse;
import com.sungbok.lol.sungboktime.dto.LeagueResponse;
import com.sungbok.lol.sungboktime.dto.MemberCreateRequest;
import com.sungbok.lol.sungboktime.dto.MemberResponse;
import com.sungbok.lol.sungboktime.entity.Member;
import com.sungbok.lol.sungboktime.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final RiotApiClient riotApiClient;

    public List<MemberResponse> getMembers() {
        return memberRepository.findAll().stream()
                .map(MemberResponse::from)
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
        return MemberResponse.from(saved);
    }
}
