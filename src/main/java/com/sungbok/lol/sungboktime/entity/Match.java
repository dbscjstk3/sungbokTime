package com.sungbok.lol.sungboktime.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "played_at", nullable = false)
    private LocalDateTime playedAt;

    @Column(name = "info")
    private String info;

    @Enumerated(EnumType.STRING)
    @Column(name = "win_side", nullable = false)
    private WinSide winSide;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MatchPlayer> players = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.playedAt == null) {
            this.playedAt = now;
        }
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addPlayer(MatchPlayer player) {
        this.players.add(player);
        player.SetMatch(this);
    }

    public enum WinSide {
        BLUE, RED
    }
}
