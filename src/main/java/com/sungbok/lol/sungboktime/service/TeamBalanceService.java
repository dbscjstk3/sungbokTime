package com.sungbok.lol.sungboktime.service;

import com.sungbok.lol.sungboktime.dto.TeamBalanceRequest;
import com.sungbok.lol.sungboktime.dto.TeamBalanceResponse;
import com.sungbok.lol.sungboktime.dto.TeamBalanceResponse.TeamMemberDto;
import com.sungbok.lol.sungboktime.entity.Member;
import com.sungbok.lol.sungboktime.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TeamBalanceService {

    private final MemberRepository memberRepository;

    public TeamBalanceResponse balance(TeamBalanceRequest request) {
        List<Member> members = memberRepository.findAllById(request.memberIds());

        if (members.size() != 10) {
            throw new IllegalArgumentException("Exactly 10 members are required for team balancing.");
        }

        List<MemberWithScore> scored = members.stream()
                .map(m -> new MemberWithScore(m, calculateScore(m)))
                .toList();

        List<MemberWithScore> sorted = new ArrayList<>(scored);
        sorted.sort(Comparator.comparingInt((MemberWithScore mws) -> mws.score).reversed());

        List<MemberWithScore> blue = new ArrayList<>();
        List<MemberWithScore> red = new ArrayList<>();
        int blueSum = 0;
        int redSum = 0;

        for (MemberWithScore mws : sorted) {
            if (blue.size() < 5 && (blueSum <= redSum || red.size() >= 5)) {
                blue.add(mws);
                blueSum += mws.score;
            } else {
                red.add(mws);
                redSum += mws.score;
            }
        }

        List<TeamMemberDto> blueTeam =
                blue.stream().map(mws -> TeamMemberDto.from(mws.member, mws.score)).toList();
        List<TeamMemberDto> redTeam =
                red.stream().map(mws -> TeamMemberDto.from(mws.member, mws.score)).toList();

        return new TeamBalanceResponse(blueTeam, blueSum, redTeam, redSum);
    }

    private int calculateScore(Member member) {
        String tier = Optional.ofNullable(member.getTier()).orElse("UNRANKED");

        return switch (tier.toUpperCase()) {
            case "IRON" -> 100;
            case "BRONZE" -> 200;
            case "SILVER" -> 300;
            case "GOLD" -> 400;
            case "PLATINUM" -> 500;
            case "EMERALD" -> 600;
            case "DIAMOND" -> 700;
            case "MASTER" -> 800;
            default -> 50;
        };
    }

    private record MemberWithScore(Member member, int score) {}
}
