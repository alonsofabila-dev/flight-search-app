package com.encoramx.backendflightsearch.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Objects;

@Service
public class AmadeusFlightSearchService {

    private final RestTemplate restTemplate;

    @Value("${spring.security.oauth2.client.registration.amadeus-api-client.client-id}")
    private String apiKey;

    @Value("${spring.security.oauth2.client.registration.amadeus-api-client.client-secret}")
    private String apiSecret;

    @Value("${spring.security.oauth2.client.registration.amadeus-api-client.authorization-grant-type}")
    private String authorizationGrantType;

    public AmadeusFlightSearchService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public String getAirportCodes() {
        String url = "https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=MUC&countryCode=DE";
        HttpHeaders headers = new HttpHeaders();
        System.out.println("TOKEN    " + getAccessToken());
        headers.set("Authorization", "Bearer " + getAccessToken());
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return response.getBody();
    }

    private String getAccessToken() {
        String tokenUrl = "https://test.api.amadeus.com/v1/security/oauth2/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Prepare request body
        String requestBody = "grant_type=" + authorizationGrantType +
                "&client_id=" + apiKey +
                "&client_secret=" + apiSecret;

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(tokenUrl, HttpMethod.POST, requestEntity, Map.class);

        return Objects.requireNonNull(response.getBody()).get("access_token").toString();
    }

}