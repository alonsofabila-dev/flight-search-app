package com.encoramx.backendflightsearch.integrations;

import com.encoramx.backendflightsearch.records.AmadeusAccessInfo;
import com.encoramx.backendflightsearch.records.SearchFilters;
import com.encoramx.backendflightsearch.records.airportandcityapi.AirlineAndCityResponseAPI;
import com.encoramx.backendflightsearch.records.flightofferssearchapi.FlightOffersResponseApi;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
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


//    public AirlineAndCityResponseAPI getAirports(String city) {
//        String endpoint = "/v1/reference-data/locations" +
//                "?subType=CITY" +
//                "&keyword=" + city +
//                "&page[limit]=5" +
//                "&page[offset]=0" +
//                "&sort=analytics.travelers.score" +
//                "&view=LIGHT";
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "Bearer " + getAccessToken());
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        String url = "https://test.api.amadeus.com" + endpoint;
//
//        ResponseEntity<AirlineAndCityResponseAPI> response = restTemplate.exchange(url, HttpMethod.GET, entity, AirlineAndCityResponseAPI.class);
//
//        return response.getBody();
//    }


    // quitar dependencia despues     implementation 'com.fasterxml.jackson.core:jackson-databind:2.15.0'
    public AirlineAndCityResponseAPI getAirports(String city) {
        try {
            ClassPathResource resource = new ClassPathResource("static/mockAirportAndCityResponse.json");
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(resource.getFile(), AirlineAndCityResponseAPI.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load mock flight offers data", e);
        }
    }

//    public FlightOffersResponseApi getFlightOffers(SearchFilters searchFilter) {
//        String endpoint = "/v2/shopping/flight-offers" +
//                "?originLocationCode=" + searchFilter.departureCity() +
//                "&destinationLocationCode=" + searchFilter.arrivalCity() +
//                "&departureDate=" + searchFilter.departureDate() +
//                "&returnDate=" + searchFilter.returnDate() +
//                "&adults=" + searchFilter.travelers().adults() +
//                "&children=" + searchFilter.travelers().children() +
//                "&infants=" + searchFilter.travelers().infants() +
//                "&nonStop=" + searchFilter.nonStop() +
//                "&currencyCode=" + searchFilter.currency();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "Bearer " + getAccessToken());
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        String url = "https://test.api.amadeus.com" + endpoint;
//
//        ResponseEntity<FlightOffersResponseApi> response = restTemplate.exchange(url, HttpMethod.GET, entity, FlightOffersResponseApi.class);
//
//        return response.getBody();
//    }


    // quitar dependencia despues  implementation 'com.fasterxml.jackson.core:jackson-databind:2.15.0'
    public FlightOffersResponseApi getFlightOffers(SearchFilters searchFilter) {
        try {
            ClassPathResource resource = new ClassPathResource("static/mockFlightOffersResponse.json");
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(resource.getFile(), FlightOffersResponseApi.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load mock flight offers data", e);
        }
    }


}
