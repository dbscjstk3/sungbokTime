package com.sungbok.lol.sungboktime.repository;

import com.sungbok.lol.sungboktime.entity.MatchPlayer;
import com.sungbok.lol.sungboktime.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchPlayerRepository extends JpaRepository<MatchPlayer, Long> {
    List<MatchPlayer> findByMember(Member member);
}
