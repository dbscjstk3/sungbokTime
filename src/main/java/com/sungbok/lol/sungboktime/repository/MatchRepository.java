package com.sungbok.lol.sungboktime.repository;

import com.sungbok.lol.sungboktime.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<Match, Long> {
}
