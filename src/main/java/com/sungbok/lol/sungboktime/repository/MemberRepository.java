package com.sungbok.lol.sungboktime.repository;

import com.sungbok.lol.sungboktime.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByRiotId(String riotId);
}
