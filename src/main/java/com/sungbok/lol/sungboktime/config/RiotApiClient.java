package com.sungbok.lol.sungboktime.config;

import com.sungbok.lol.sungboktime.dto.AccountResponse;
import com.sungbok.lol.sungboktime.dto.LeagueResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RiotApiClient {

    private static final Logger log = LoggerFactory.getLogger(RiotApiClient.class);

    private final RestTemplate restTemplate;
    private final RiotApiProperties riotApiProperties;

    public AccountResponse getAccountByRiotId(String gameName, String tagLine) {
        // Build and encode URI to handle non-ASCII and reserved characters
        URI uri = UriComponentsBuilder
                .fromUriString(riotApiProperties.getAccountBaseUrl())
                .path("/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}")
                .buildAndExpand(gameName, tagLine)
                .encode(StandardCharsets.UTF_8)
                .toUri();

        if (log.isDebugEnabled()) {
            log.debug("Requesting Riot Account by Riot ID. URI={}", uri);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Riot-Token", riotApiProperties.getApiKey());
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<AccountResponse> response = restTemplate.exchange(uri, HttpMethod.GET, entity, AccountResponse.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new IllegalArgumentException("Failed to fetch account information from Riot API");
            }

            return response.getBody();
        } catch (HttpClientErrorException e) {
            // Log details for 4xx errors (bad request, unauthorized, not found)
            log.error("Riot API request failed: status={} body={} uri={}", e.getStatusCode(), e.getResponseBodyAsString(), uri, e);
            throw e;
        }
    }

    public Optional<LeagueResponse> getSoloRankByPuuid(String puuid) {
        URI uri = UriComponentsBuilder
                .fromUriString(riotApiProperties.getLeagueBaseUrl())
                .path("/lol/league/v4/entries/by-puuid/{puuid}")
                .buildAndExpand(puuid)
                .encode(StandardCharsets.UTF_8)
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Riot-Token", riotApiProperties.getApiKey());
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<LeagueResponse[]> response = restTemplate.exchange(uri, HttpMethod.GET, entity, LeagueResponse[].class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new IllegalArgumentException("Failed to fetch league information from Riot API");
            }

            List<LeagueResponse> entries = Arrays.asList(response.getBody());

            return entries.stream()
                    .filter(e -> "RANKED_SOLO_5x5".equals(e.queueType()))
                    .findFirst();
        } catch (HttpClientErrorException e) {
            log.error("Riot API request failed: status={} body={} uri={}", e.getStatusCode(), e.getResponseBodyAsString(), uri, e);
            throw e;
        }
    }
}
