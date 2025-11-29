package com.sungbok.lol.sungboktime.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "match_players")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MatchPlayer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Enumerated(EnumType.STRING)
    @Column(name = "team_side", nullable = false)
    private TeamSide teamSide;

    @Column(name = "win", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isWin;

    @Column
    private String position;

    @Column(name = "champion_name")
    private String championName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum TeamSide {
        BLUE, RED
    }

    void SetMatch(Match match) {
        this.match = match;
    }

    public void markWin(boolean isWin) {
        this.isWin = isWin;
    }
}
