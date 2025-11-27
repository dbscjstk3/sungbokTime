package com.sungbok.lol.sungboktime.config;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class RestTemplateConfig {

    @Bean
    private RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
