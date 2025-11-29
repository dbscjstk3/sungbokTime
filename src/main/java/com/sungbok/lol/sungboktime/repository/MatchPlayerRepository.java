package com.sungbok.lol.sungboktime.repository;

import com.sungbok.lol.sungboktime.entity.MatchPlayer;
import com.sungbok.lol.sungboktime.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MatchPlayerRepository extends JpaRepository<MatchPlayer, Long> {
    List<MatchPlayer> findByMember(Member member);
    
    @Query("SELECT mp FROM MatchPlayer mp JOIN FETCH mp.match m WHERE mp.member = :member AND m.winSide != 'PENDING'")
    List<MatchPlayer> findByMemberAndMatchWinSideNotPending(@Param("member") Member member);
    
    @Query("SELECT mp FROM MatchPlayer mp JOIN FETCH mp.match m WHERE mp.member = :member")
    List<MatchPlayer> findByMemberWithMatch(@Param("member") Member member);
    
    @Query(value = "SELECT mp.* FROM match_players mp " +
            "INNER JOIN matches m ON mp.match_id = m.id " +
            "WHERE mp.member_id = :memberId AND m.win_side != 'PENDING'", 
            nativeQuery = true)
    List<MatchPlayer> findCompletedMatchesByMemberId(@Param("memberId") Long memberId);
}
