package com.encoramx.backendflightsearch.integrations;

import com.encoramx.backendflightsearch.records.AmadeusAccessInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

@Component
public class AmadeusFlightsAPIIntegration {

    Logger logger = LoggerFactory.getLogger(AmadeusFlightsAPIIntegration.class);

    private final RestTemplate restTemplate;

    @Value("${spring.security.oauth2.client.registration.amadeus-api-client.client-id}")
    private String apiKey;

    @Value("${spring.security.oauth2.client.registration.amadeus-api-client.client-secret}")
    private String apiSecret;

    @Value("${spring.security.oauth2.client.registration.amadeus-api-client.authorization-grant-type}")
    private String authorizationGrantType;

    @Value("${spring.security.oauth2.client.provider.amadeus-api-provider.token-uri}")
    private String tokenUrl;


    public AmadeusFlightsAPIIntegration(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }


    private String getAccessToken() {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String requestBody = "grant_type=" + authorizationGrantType +
                "&client_id=" + apiKey +
                "&client_secret=" + apiSecret;

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<AmadeusAccessInfo> responseEntity = restTemplate.postForEntity(tokenUrl, requestEntity, AmadeusAccessInfo.class);
            return Objects.requireNonNull(responseEntity.getBody()).accessToken();
        } catch (RestClientException e) {
            logger.error(e.getMessage());
            return "Failed to retrieve access token";
        }

    }


    private String setUpGETRequest(String endpoint) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + getAccessToken());
        HttpEntity<String> entity = new HttpEntity<>(headers);

        String url = String.format("https://test.api.amadeus.com%s", endpoint);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return response.getBody();
        } catch (RestClientException e) {
            logger.error(e.getMessage());
            return "Failed to make request";
        }

    }


    public String getAirports(String city) {
        String endpoint = String.format(
                "/v1/reference-data/locations" +
                        "?subType=CITY" +
                        "&keyword=%s" +
                        "&page[limit]=5" +
                        "&page[offset]=0" +
                        "&sort=analytics.travelers.score" +
                        "&view=LIGHT",
                city
        );
        return setUpGETRequest(endpoint);
    }


    public String getAirlinesInfo() {
        String endpoint = "/v1/reference-data/airlines?airlineCodes=BA";
        return setUpGETRequest(endpoint);
    }


    public String getFlightOffers() {
        String endpoint = "/v2/shopping/flight-offers?originLocationCode=SYD&destinationLocationCode=BKK&departureDate=2024-11-01&adults=1&max=2";
        return setUpGETRequest(endpoint);
    }

}
